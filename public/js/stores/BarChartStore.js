var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var FilteredDataStore = require('./FilteredDataStore');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

// DATA STORE
var _barChartData = [];

var _reformatData = function(filteredData) {
  var sliceDataByCategory = {};
  var barChartData = [];
  var barChartAll = [];

  for (var i = 0; i < filteredData.length; i++) {
    if (filteredData[i].price > 0) {
      var itemCategory = filteredData[i].secondaryLabel;
      if (itemCategory === null) itemCategory = 'Other';
      if (!sliceDataByCategory[itemCategory])
        sliceDataByCategory[itemCategory] = filteredData[i].price;
      else
        sliceDataByCategory[itemCategory] += filteredData[i].price;
    }
  }

  for (var key in sliceDataByCategory) {
    var barChartItem = {};
    barChartItem['categoryName'] = key;
    barChartItem['price'] = sliceDataByCategory[key].toFixed(2);
    barChartAll.push(barChartItem);
  }

  barChartAll.sort(function(a, b) {return b.price - a.price;});

  var barChartOther = {
    categoryName: 'All Others',
    price: 0
  }

  for (var i = 0; i < barChartAll.length; i++) {
    if (i < 6)
      barChartData.push(barChartAll[i]);
    else
      barChartOther.price += parseFloat(barChartAll[i].price);
  }

  if (barChartOther.price > 0) barChartData.push(barChartOther);

  _barChartData = barChartData;
};

var BarChartStore = assign({}, EventEmitter.prototype, {
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
    return _barChartData;
  }
});

BarChartStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECEIVE_GRAPH_DATA:
      AppDispatcher.waitFor([FilteredDataStore.dispatchToken]);
      var filteredData = FilteredDataStore.getData();
      _reformatData(filteredData);
      BarChartStore.emitChange();
      break;

    default:
      // do nothing
  }
});

module.exports = BarChartStore;
