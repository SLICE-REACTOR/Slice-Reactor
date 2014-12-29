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
  console.log('in _addOrders function');
  console.log('allOrders: ', allOrders);
};

var GraphDataStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  // /**
  //  * @param {function} callback
  //  */
  // addChangeListener: function(callback) {
  //   this.on(CHANGE_EVENT, callback);
  // },

  // removeChangeListener: function(callback) {
  //   this.removeListener(CHANGE_EVENT, callback);
  // },

  // get: function(id) {
  //   return _messages[id];
  // },

  // getAll: function() {
  //   return _messages;
  // }
});

GraphDataStore.dispatchToken = AppDispatcher.register(function(payload) {
  console.log('in GraphDataStore dispatcher register');
  var action = payload.action;
  console.log('action: ', action);

  switch(action.type) {

    case ActionTypes.RECEIVE_ORDERS:
      console.log('in RECEIVE_ORDERS');
      _addOrders(action.allOrders);
      // AppDispatcher.waitFor([ThreadStore.dispatchToken]);
      GraphDataStore.emitChange();
      break;

    default:
      // do nothing
  }
});

module.exports = GraphDataStore;
