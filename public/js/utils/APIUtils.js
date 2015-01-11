var ServerActionCreators = require('../actions/ServerActionCreators');

module.exports = {
  getAllGraphData: function() {
    $.get('/userdata', function(data, textStatus, xhr) {
      if (xhr.status === 200 && data === 'ok') {
        window.location = './loading';
      } else {
        ServerActionCreators.receiveAllChartData(JSON.parse(data));
      }
    });
  }
};
