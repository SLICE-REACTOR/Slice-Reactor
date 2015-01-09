var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var dateFilterHelpers = require('../utils/dateFilterHelpers');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

// DATA STORES
var _allChartData = [];
var _filteredChartData = [];
var _categoryChartData = [];
var _merchantChartData = [];
var _filteredCategoryData = [];
var _filteredMerchantData = [];

var _today = dateFilterHelpers.getToday();

// default filter values
var _filterValue = {
  primary: 'Category',
  secondary: 'Merchant',
  category: 'active',
  merchant: '',
  minDate: '9999-12-30',
  maxDate: '',
  setMinDate: '',
  setMaxDate: dateFilterHelpers.getToday().string
};

function _addFilteredData(chartData) {
  _allChartData = chartData;
  _categoryChartData = _filterByCategory(chartData);
  _merchantChartData = _filterByMerchant(chartData);
  _filteredChartData = _categoryChartData;
};

function _filterByCategory(chartData) {
  _filterValue.maxDate = _today.string;

  return categories = chartData.map(function(item) {
    if (new Date(item.purchaseDate) < new Date(_filterValue.minDate)) {
      _filterValue.minDate = item.purchaseDate;
      _filterValue.setMinDate = item.purchaseDate;
    }
    var categoryObj = {
      primaryLabel: item.categoryName,
      secondaryLabel: item.Order.Merchant.name,
      price: item.price / 100,
      date: item.purchaseDate
    };
    return categoryObj;
  });
};

function _filterByMerchant(chartData) {
  return merchants = chartData.map(function(item) {
    var dateArray = item.purchaseDate.split('-');
    var parsedDateArray = dateArray.map(function(item) {
      return parseInt(item, 10);
    });

    var merchantObj = {
      primaryLabel: item.Order.Merchant.name,
      secondaryLabel: item.categoryName,
      price: item.price / 100,
      date: item.purchaseDate
    };
    return merchantObj;
  });
};

function _filterByDate(dates) {
  var minDate = dates.minDate;
  var maxDate = dates.maxDate;

  _filteredCategoryData = _categoryChartData.filter(function(item) {
    return new Date(minDate) < new Date(item.date) && new Date(item.date) < new Date(maxDate);
  });

  _filteredMerchantData = _merchantChartData.filter(function(item) {
    return new Date(minDate) < new Date(item.date) && new Date(item.date) < new Date(maxDate);
  });

  if (_filterValue.merchant === 'active')
    _filteredChartData = _filteredMerchantData;
  else
    _filteredChartData = _filteredCategoryData;
};

function _toggleData(categoryOrMerchant) {
  if (categoryOrMerchant === 'merchant')
    _filteredChartData = _filteredMerchantData;
  else
    _filteredChartData = _filteredCategoryData;
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
  setFilter: function(categoryOrMerchant) {
    if (categoryOrMerchant === 'merchant') {
      _filterValue = {
        primary: 'Merchant',
        secondary: 'Categories',
        category: '',
        merchant: 'active'
      }
    } else {
      _filterValue = {
        primary: 'Category',
        secondary: 'Merchants',
        category: 'active',
        merchant: ''
      }
    }
  },
  getFilterValue: function() {
    return _filterValue;
  },
  getData: function() {
    return _filteredChartData;
  }
});

FilteredDataStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECEIVE_CHART_DATA:
      _addFilteredData(action.allChartData);
      FilteredDataStore.emitChange();
      break;

    case ActionTypes.FILTER_DATA:
      _toggleData(action.filter);
      break;

    case ActionTypes.FILTER_BY_DATE:
      _filterByDate(action.dates);
      break;

    default:
      // do nothing
  }
});

module.exports = FilteredDataStore;
