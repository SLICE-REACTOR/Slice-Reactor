var keyMirror = require('../../../node_modules/react/lib/keymirror');

module.exports = {

  ActionTypes: keyMirror({
    RECEIVE_GRAPH_DATA: null,
    RECEIVE_ORDERS: null,
    RECEIVE_ITEMS: null

///// EXAMPLES /////

    // CLICK_THREAD: null,
    // CREATE_MESSAGE: null,
    // RECEIVE_RAW_CREATED_MESSAGE: null,
    // RECEIVE_RAW_MESSAGES: null
  }),

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })

};
