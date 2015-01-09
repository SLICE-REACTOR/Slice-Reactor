var keyMirror = require('keymirror');

module.exports = {

  ActionTypes: keyMirror({
    RECEIVE_CHART_DATA: null,
    FILTER_DATA: null,
    FILTER_BY_DATE: null
    FILTER_DONUT_PIECE_DATA: null
  }),

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })

};
