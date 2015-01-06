var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

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
        secondary: 'Category',
        category: '',
        merchant: 'active'
      }
    } else {
      _filterValue = {
        primary: 'Category',
        secondary: 'Merchant',
        category: 'active',
        merchant: ''
      }
    }
  },
  getFilterValue: function() {
    return _filterValue;
  },
  getLineChart: function() {
    var sliceDataMonthly = {};
    for (var i = 0; i < _graphData.length; i++) {
      if (_graphData[i].price > 0) {
        var purchaseDateArray = _graphData[i].purchaseDate.split('-');
        var monthYear = purchaseDateArray[0] + '-' + purchaseDateArray[1] + '-01';
        if (!sliceDataMonthly[monthYear]) {
          sliceDataMonthly[monthYear] = _graphData[i].price / 100;
        } else {
          sliceDataMonthly[monthYear] += _graphData[i].price / 100;
        }
      }
    }
    lineChartData = [];
    for (var key in sliceDataMonthly) {
      var lineGraphItem = {};
      lineGraphItem['purchaseDate'] = key;
      lineGraphItem['price'] = sliceDataMonthly[key].toFixed(2);
      lineChartData.push(lineGraphItem);
    }
    return lineChartData;
  },
  getBarGraph: function() {
    var sliceDataByCategory = {};
    for (var i = 0; i < _graphData.length; i++) {
      if (_graphData[i].price > 0) {
        var itemCategory = _graphData[i].categoryName;
        if (itemCategory === null) {
          itemCategory = 'Other';
        }
        if (!sliceDataByCategory[itemCategory]) {
          sliceDataByCategory[itemCategory] = _graphData[i].price / 100;
        } else {
          sliceDataByCategory[itemCategory] += _graphData[i].price / 100;
        }
      }
    }
    barGraphAll = [];
    for (var key in sliceDataByCategory) {
      var barChartItem = {};
      barChartItem['categoryName'] = key;
      barChartItem['price'] = sliceDataByCategory[key].toFixed(2);
      barGraphAll.push(barChartItem);
    }
    barGraphAll.sort(function(a, b) {
      return b.price - a.price;
    });
    barGraphData = [];
    var barChartOther = {
      categoryName: 'All Others',
      price: 0
    }
    for (var i = 0; i < barGraphAll.length; i++) {
      if (i < 6) {
        barGraphData.push(barGraphAll[i]);
      } else {
        barChartOther.price += parseFloat(barGraphAll[i].price);
      }
    }
    if (barChartOther.price > 0) {
      barGraphData.push(barChartOther);
    }
    return barGraphData;
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
