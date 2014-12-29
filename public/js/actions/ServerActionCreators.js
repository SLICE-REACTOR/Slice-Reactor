var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');

var ActionTypes = Constants.ActionTypes;

module.exports = {

  receiveAllGraphData: function(graphData) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_GRAPH_DATA,
      graphData: graphData
    });
  },

  receiveAllOrders: function(allOrders) {
    console.log('in receiveAllOrders');
    AppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_ORDERS,
      allOrders: allOrders
    });
  },

  receiveAllItems: function(allItems) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_ITEMS,
      allItems: allItems
    });
  }

///// EXAMPLES /////

  // receiveAll: function(rawMessages) {
  //   ChatAppDispatcher.handleServerAction({
  //     type: ActionTypes.RECEIVE_RAW_MESSAGES,
  //     rawMessages: rawMessages
  //   });
  // },

  // receiveCreatedMessage: function(createdMessage) {
  //   ChatAppDispatcher.handleServerAction({
  //     type: ActionTypes.RECEIVE_RAW_CREATED_MESSAGE,
  //     rawMessage: createdMessage
  //   });
  // }

};
