// mirrors the key as the value
var keyMirror = require('keymirror');

// actions used throughout the application
module.exports = {

  ActionTypes: keyMirror({
    RECEIVE_CHART_DATA: null,
    FILTER_DATA: null,
    FILTER_BY_DATE: null,
    FILTER_DONUT_PIECE_DATA: null
  }),

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })

};
