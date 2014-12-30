var Constants = require('../constants/Constants');
var Dispatcher = require('flux').Dispatcher;
var assign = require('object-assign');

var PayloadSources = Constants.PayloadSources;

var AppDispatcher = assign(new Dispatcher(), {

  handleServerAction: function(action) {
    console.log('in handleServerAction');
    var payload = {
      source: PayloadSources.SERVER_ACTION,
      action: action
    };
    console.log('payload: ', payload);
    this.dispatch(payload);
  },

  handleViewAction: function(action) {
    var payload = {
      source: PayloadSources.VIEW_ACTION,
      action: action
    };
    this.dispatch(payload);
  }

});

module.exports = AppDispatcher;
