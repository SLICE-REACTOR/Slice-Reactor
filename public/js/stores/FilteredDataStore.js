var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var dateFilterHelpers = require('../utils/dateFilterHelpers');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

// DATA STORES
var _allChartData = [];
var _allCategoryData = [];
var _allMerchantData = [];

// Data store that is passed to all other stores
var _filteredChartData = {};
_filteredChartData.category = [];
_filteredChartData.merchant = [];

// default filter values
var _filterValues = {
  primary: 'Category',
  secondary: 'Merchant',
  category: 'active',
  merchant: '',
  minDate: '9999-12-30',
  maxDate: '',
  setMinDate: '',
  setMaxDate: ''
};

// add all data to data stores
function _addFilteredData(chartData) {
  _allChartData = chartData;
  _allCategoryData = _filterByCategory(chartData); // min date defined here
  _allMerchantData = _filterByMerchant(chartData);
  _filterByDate(_filterValues);
};

// formats all raw data, organized by category, and finds min date
function _filterByCategory(chartData) {
  return categories = chartData.map(function(item) {

    // finds and sets min date
    if (new Date(item.purchaseDate) < new Date(_filterValues.minDate)) {
      _filterValues.minDate = item.purchaseDate;
      _filterValues.setMinDate = item.purchaseDate;
    }

    // formats raw data, organized by category
    var categoryObj = {
      primaryLabel: item.categoryName,
      secondaryLabel: item.Order.Merchant.name,
      price: item.price / 100,
      date: item.purchaseDate
    };
    return categoryObj;
  });
};

// formats all raw data, organized by merchant
function _filterByMerchant(chartData) {
  return merchants = chartData.map(function(item) {
    var merchantObj = {
      primaryLabel: item.Order.Merchant.name,
      secondaryLabel: item.categoryName,
      price: item.price / 100,
      date: item.purchaseDate
    };
    return merchantObj;
  });
};

// sets the user-submitted dates to the filterValue object
function _setDateRange(dates) {
  _filterValues.minDate = dates.minDate;
  _filterValues.maxDate = dates.maxDate;
};

// filters category and merchant data by date and returns objects to filteredChartData
function _filterByDate(dates) {
  _filteredChartData.category = _allCategoryData.filter(function(item) {
    return new Date(dates.minDate) <= new Date(item.date) && new Date(item.date) <= new Date(dates.maxDate);
  });
  _filteredChartData.merchant = _allMerchantData.filter(function(item) {
    return new Date(dates.minDate) <= new Date(item.date) && new Date(item.date) <= new Date(dates.maxDate);
  });
};

// returns a formatted string of today's date
function _getToday() {
  var year = new Date().getFullYear();
  var month = new Date().getMonth() + 1;
  var day = new Date().getDate();
  var todayArray = [year, month, day];

  var todayString = todayArray.map(function(item) {
    var itemString = String(item);
    if (itemString.length === 1) {
      return ('0').concat(itemString);
    }
    return itemString;
  }).join('-');

  return todayString;
};

// toggles the filter values
function _toggleFilter(categoryOrMerchant) {
  if (categoryOrMerchant === 'merchant') {
    _filterValues.primary = 'Merchant',
    _filterValues.secondary = 'Categories',
    _filterValues.category = '',
    _filterValues.merchant = 'active'
  } else {
    _filterValues.primary = 'Category',
    _filterValues.secondary = 'Merchants',
    _filterValues.category = 'active',
    _filterValues.merchant = ''
  }
};

var FilteredDataStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getFilterValue: function() {
    return _filterValues;
  },
  getData: function() {
    if (_filterValues.primary === 'Category')
      return _filteredChartData.category;
    else
      return _filteredChartData.merchant;
  }
});

FilteredDataStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECEIVE_CHART_DATA:
      _filterValues.maxDate = _filterValues.setMaxDate = _getToday();
      _addFilteredData(action.allChartData);
      FilteredDataStore.emitChange();
      break;

    case ActionTypes.FILTER_DATA:
      _toggleFilter(action.filter);
      FilteredDataStore.emitChange()
      break;

    case ActionTypes.FILTER_BY_DATE:
      _setDateRange(action.dates);
      _filterByDate(_filterValues);
      break;

    default:
      // do nothing
  }
});

module.exports = FilteredDataStore;
