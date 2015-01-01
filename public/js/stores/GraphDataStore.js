var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _graphData = {};

// function _addGraphData(graphData) {
//   _graphData = graphData;
// };

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

  getData: function(){
    return _graphData;
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
