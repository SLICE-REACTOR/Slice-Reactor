var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var FilteredDataStore = require('./FilteredDataStore');
var DonutChartStore = require('./DonutChartStore');
var chartHelpers = require('../utils/chartHelpers');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

// DATA STORE
var _lineChartData = [];

// Variable set for line chart axis formatting
var _maxPrice = 0;

var _formatData = function(filteredData) {
  _lineChartData = chartHelpers.formatLineChartData(filteredData);
  _maxPrice = 0;
  setMaxPrice(_lineChartData);
};

var setMaxPrice = function(chartData) {
  chartData.forEach(function(item) {
    if (parseInt(item.price, 10) > parseInt(_maxPrice, 10))
      _maxPrice = item.price;
  });
};

var LineChartStore = assign({}, EventEmitter.prototype, {
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
    return _lineChartData;
  },
  getMaxPrice: function() {
    console.log('maxprice: ', _maxPrice);
    return _maxPrice;
  }
});

LineChartStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECEIVE_CHART_DATA:
      AppDispatcher.waitFor([FilteredDataStore.dispatchToken]);
      var filteredData = FilteredDataStore.getData();
      _formatData(filteredData);
      LineChartStore.emitChange();
      break;

    case ActionTypes.FILTER_DATA:
      AppDispatcher.waitFor([FilteredDataStore.dispatchToken]);
      var filteredData = FilteredDataStore.getData();
      _formatData(filteredData);
      LineChartStore.emitChange();
      break;

    case ActionTypes.FILTER_BY_DATE:
      AppDispatcher.waitFor([FilteredDataStore.dispatchToken]);
      var filteredData = FilteredDataStore.getData();
      _formatData(filteredData);
      LineChartStore.emitChange();
      break;

    case ActionTypes.FILTER_DONUT_PIECE_DATA:
      AppDispatcher.waitFor([DonutChartStore.dispatchToken]);
      var filteredData = DonutChartStore.sendDonutPieceData();
      _formatData(filteredData);
      LineChartStore.emitChange();
      break;

    default:
      // do nothing
  }
});

module.exports = LineChartStore;
