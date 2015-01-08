var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var FilteredDataStore = require('./FilteredDataStore');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _lineChartData = [];

var _reformatData = function() {};

var _addLineChartData = function() {};

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

    case ActionTypes.RECEIVE_GRAPH_DATA:
      // TODO insert arguments here
      _reformatData();
      _addLineChartData();
      LineChartStore.emitChange();
      break;

    default:
      // do nothing
  }
});

module.exports = LineChartStore;
