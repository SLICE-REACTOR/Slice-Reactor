var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var helper = require('../utils/chartHelpers');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _graphData = [];
var _categoryGraphData = [];
var _merchantGraphData = [];

var _filteredGraphData = [];

var _filterValue = {
  primary: 'Category',
  secondary: 'Merchant',
  category: 'active',
  merchant: ''
}

function _addGraphData(graphData) {
  _graphData = graphData;
  _filterByCategory(graphData);
  _filterByMerchant(graphData);
  _filteredGraphData = _categoryGraphData;
};

function _filterByCategory(graphData) {
  var categories = graphData.map(function(item) {
    var categoryObj = {
      primaryLabel: item.categoryName,
      secondaryLabel: item.Order.Merchant.name,
      price: item.price / 100,
      date: item.purchaseDate
    };
    return categoryObj;
  });

  _categoryGraphData = categories;
};

function _filterByMerchant(graphData) {
  var merchants = graphData.map(function(item) {
    var merchantObj = {
      primaryLabel: item.Order.Merchant.name,
      secondaryLabel: item.categoryName,
      price: item.price / 100,
      date: item.purchaseDate
    };
    return merchantObj;
  });

  _merchantGraphData = merchants;
};

function _filterData(categoryOrMerchant) {
  if (categoryOrMerchant === 'merchant') {
    _filteredGraphData = _merchantGraphData;
  } else {
    _filteredGraphData = _categoryGraphData;
  }
};

var GraphDataStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getData: function() {
    return _filteredGraphData;
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
  getLineChart: function() {
    return helper.lineChartProcessing(_graphData);
  },
  getBarGraph: function() {
    return helper.barGraphProcessing(_filteredGraphData);
  }

});

GraphDataStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECEIVE_GRAPH_DATA:
      _addGraphData(action.allGraphData);
      GraphDataStore.emitChange();
      break;

    case ActionTypes.FILTER_DATA:
      _filterData(action.filter);
      GraphDataStore.emitChange();
      break;

    default:
      // do nothing
  }
});

module.exports = GraphDataStore;
