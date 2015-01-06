var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _graphData = [];


function _addOrders(allOrders) {
  _graphData = allOrders;
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
    return _graphData;
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
        console.log(barChartOther.price, " & ", barGraphAll[i].categoryName);
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

    case ActionTypes.RECEIVE_ORDERS:
      _addOrders(action.allOrders);
      GraphDataStore.emitChange();
      break;

    default:
      // do nothing
  }
});

module.exports = GraphDataStore;
