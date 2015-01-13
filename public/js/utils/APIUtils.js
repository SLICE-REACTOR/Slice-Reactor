var ServerActionCreators = require('../actions/ServerActionCreators');

module.exports = {
  getAllGraphData: function() {
    $.get('/userdata', function(data, textStatus, xhr) {
      if (xhr.status === 200 && data === 'empty') {
        window.location = './newuser';
      } else {
        ServerActionCreators.receiveAllChartData(JSON.parse(data));
      }
    });
  }
};
