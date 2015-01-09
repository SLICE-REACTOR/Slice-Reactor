var ServerActionCreators = require('../actions/ServerActionCreators');

module.exports = {
  getAllGraphData: function() {
    $.get('/userdata', function(data) {
      ServerActionCreators.receiveAllChartData(JSON.parse(data));
    });
  }
};
