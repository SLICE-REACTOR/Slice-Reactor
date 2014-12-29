var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

// var ActionTypes = Constants.ActionTypes;
// var CHANGE_EVENT = 'change';

var _graphData = {};

function _addGraphData(graphData) {
  _graphData = graphData;
};

function _addOrders(allOrders) {
  _graphData = allOrders;
};

// function _addMessages(rawMessages) {
//   rawMessages.forEach(function(message) {
//     if (!_messages[message.id]) {
//       _messages[message.id] = MessageUtils.convertRawMessage(
//         message,
//         ThreadStore.getCurrentID()
//       );
//     }
//   });
// }

// function _markAllInThreadRead(threadID) {
//   for (var id in _messages) {
//     if (_messages[id].threadID === threadID) {
//       _messages[id].isRead = true;
//     }
//   }
// }

// var MessageStore = assign({}, EventEmitter.prototype, {

//   emitChange: function() {
//     this.emit(CHANGE_EVENT);
//   },

//   /**
//    * @param {function} callback
//    */
//   addChangeListener: function(callback) {
//     this.on(CHANGE_EVENT, callback);
//   },

//   removeChangeListener: function(callback) {
//     this.removeListener(CHANGE_EVENT, callback);
//   },

//   get: function(id) {
//     return _messages[id];
//   },

//   getAll: function() {
//     return _messages;
//   },
// });

GraphDataStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECEIVE_ORDERS:
      _addOrders(action.allOrders);
      AppDispatcher.waitFor([ThreadStore.dispatchToken]);
      _markAllInThreadRead(ThreadStore.getCurrentID());
      GraphDataStore.emitChange();
      break;

    default:
      // do nothing
  }

// });

// module.exports = GraphDataStore;
