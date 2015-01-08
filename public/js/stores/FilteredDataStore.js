var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';


// DATA STORES
var _chartData = [];
var _filteredChartData = [];

var _filterValue = {
  primary: 'Category',
  secondary: 'Merchant',
  category: 'active',
  merchant: ''
}

function _addChartData(chartData) {
  _chartData = chartData;
  _filterByCategory(chartData);
  _filterByMerchant(chartData);
  _filteredChartData = _categoryChartData;
};

function _filterByCategory(chartData) {
  var categories = chartData.map(function(item) {
    var categoryObj = {
      primaryLabel: item.categoryName,
      secondaryLabel: item.Order.Merchant.name,
      price: item.price / 100,
      date: item.purchaseDate
    };
    return categoryObj;
  });

  _categoryChartData = categories;
};

function _filterByMerchant(chartData) {
  var merchants = chartData.map(function(item) {
    var merchantObj = {
      primaryLabel: item.Order.Merchant.name,
      secondaryLabel: item.categoryName,
      price: item.price / 100,
      date: item.purchaseDate
    };
    return merchantObj;
  });

  _merchantChartData = merchants;
};

function _filterData(categoryOrMerchant) {
  if (categoryOrMerchant === 'merchant')
    _filteredChartData = _merchantChartData;
  else
    _filteredChartData = _categoryChartData;
};

var FilteredDataStore = assign({}, EventEmitter.prototype, {

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
    return _chartData;
  }
});

FilteredDataStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECEIVE_CHART_DATA:
      _addChartData(action.allChartData);
      break;

    case ActionTypes.FILTER_DATA:
      _filterData(action.filter);
      break;

    default:
      // do nothing
  }
});

