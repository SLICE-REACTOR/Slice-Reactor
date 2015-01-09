var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

// DATA STORES
var _allChartData = [];
var _filteredChartData = [];
var _categoryChartData = [];
var _merchantChartData = [];

var _filterValue = {
  primary: 'Category',
  secondary: 'Merchant',
  category: 'active',
  merchant: ''
};

var _dateMin = [9999, 99, 99];
var _dateMax = [0, 0, 0];

function _addFilteredData(chartData) {
  _allChartData = chartData;
  _categoryChartData = _filterByCategory(chartData);
  _merchantChartData = _filterByMerchant(chartData);
  _filteredChartData = _categoryChartData;
};

function _getMinMaxDate(dateArray, stringDate) {
  // sets min date
  if (dateArray[0] < _dateMin[0]) {
    _dateMin = dateArray;
    _filterValue.minDate = stringDate;
  }
  else if (dateArray[0] === _dateMin[0] && dateArray[1] < _dateMin[1]) {
    _dateMin = dateArray;
    _filterValue.minDate = stringDate;
  }
  else if (dateArray[0] === _dateMin[0] && dateArray[1] === _dateMin[1] && dateArray[2] < _dateMin[2]) {
    _dateMin = dateArray;
    _filterValue.minDate = stringDate;
  }

  // sets max date
  if (dateArray[0] > _dateMax[0]) {
    _dateMax = dateArray;
    _filterValue.maxDate = stringDate;
  }
  else if (dateArray[0] === _dateMax[0] && dateArray[1] > _dateMax[1]) {
    _dateMax = dateArray;
    _filterValue.maxDate = stringDate;
  }
  else if (dateArray[0] === _dateMax[0] && dateArray[1] === _dateMax[1] && dateArray[2] > _dateMax[2]) {
    _dateMax = dateArray;
    _filterValue.maxDate = stringDate;
  }
};

function _filterByCategory(chartData) {
  return categories = chartData.map(function(item) {

    var dateArray = item.purchaseDate.split('-');

    var parsedDateArray = dateArray.map(function(item) {
      return parseInt(item, 10);
    });

    _getMinMaxDate(parsedDateArray, item.purchaseDate);

    var categoryObj = {
      primaryLabel: item.categoryName,
      secondaryLabel: item.Order.Merchant.name,
      price: item.price / 100,
      date: item.purchaseDate,
      year: parsedDateArray[0],
      month: parsedDateArray[1],
      day: parsedDateArray[2]
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
      date: item.purchaseDate,
      year: parsedDateArray[0],
      month: parsedDateArray[1],
      day: parsedDateArray[2]
    };
    return merchantObj;
  });
};

function _toggleData(categoryOrMerchant) {
  if (categoryOrMerchant === 'merchant')
    _filteredChartData = _merchantChartData;
  else
    _filteredChartData = _categoryChartData;
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

    default:
      // do nothing
  }
});

module.exports = FilteredDataStore;
