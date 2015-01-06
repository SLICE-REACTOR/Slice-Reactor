var keyMirror = require('keymirror');

module.exports = {

  ActionTypes: keyMirror({
    RECEIVE_GRAPH_DATA: null,
    RECEIVE_ORDERS: null,
    RECEIVE_ITEMS: null,
    FILTER_DATA: null
  }),

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })

};
