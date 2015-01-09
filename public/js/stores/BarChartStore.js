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
var _barChartData = [];

var _formatData = function(filteredData) {
  _barChartData = chartHelpers.formatBarChartData(filteredData);
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

    case ActionTypes.RECEIVE_CHART_DATA:
      AppDispatcher.waitFor([FilteredDataStore.dispatchToken]);
      var filteredData = FilteredDataStore.getData();
      _formatData(filteredData);
      BarChartStore.emitChange();
      break;

    case ActionTypes.FILTER_DATA:
      AppDispatcher.waitFor([FilteredDataStore.dispatchToken]);
      var filteredData = FilteredDataStore.getData();
      _formatData(filteredData);
      BarChartStore.emitChange();
      break;

    case ActionTypes.FILTER_BY_DATE:
      AppDispatcher.waitFor([FilteredDataStore.dispatchToken]);
      var filteredData = FilteredDataStore.getData();
      _formatData(filteredData);
      BarChartStore.emitChange();
      break;

    case ActionTypes.FILTER_DONUT_PIECE_DATA:
      AppDispatcher.waitFor([DonutChartStore.dispatchToken]);
      var filteredData = DonutChartStore.sendDonutPieceData();
      _formatData(filteredData);
      BarChartStore.emitChange();
      break;

    default:
      // do nothing
  }
});

module.exports = BarChartStore;
