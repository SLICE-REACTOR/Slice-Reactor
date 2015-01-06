var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');

var ActionTypes = Constants.ActionTypes;

module.exports = {
  // receiveAllOrders: function(allOrders) {
  //   AppDispatcher.handleServerAction({
  //     type: ActionTypes.RECEIVE_ORDERS,
  //     allOrders: allOrders
  //   });
  // },
  receiveAllGraphData: function(allGraphData) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_GRAPH_DATA,
      allGraphData: allGraphData
    });
  }
};
