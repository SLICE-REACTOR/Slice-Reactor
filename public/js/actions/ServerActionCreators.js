var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');

var ActionTypes = Constants.ActionTypes;

module.exports = {
  receiveAllGraphData: function(allGraphData) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.RECEIVE_GRAPH_DATA,
      allGraphData: allGraphData
    });
  }
};
