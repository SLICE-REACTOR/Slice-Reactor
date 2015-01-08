var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var FilteredDataStore = require('./FilteredDataStore');
var chartHelpers = require('../utils/chartHelpers');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

// DATA STORE
var _lineChartData = [];

var _formatData = function(filteredData) {
  console.log('formatted line chart data: ', chartHelpers.formatLineChartData(filteredData));
  _lineChartData = chartHelpers.formatLineChartData(filteredData);
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

    default:
      // do nothing
  }
});

module.exports = LineChartStore;
