var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');

var ActionTypes = Constants.ActionTypes;

module.exports = {

  receiveAllOrders: function(allOrders) {
    console.log('in receiveAllOrders');
    AppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_ORDERS,
      allOrders: allOrders
    });
  }
};
