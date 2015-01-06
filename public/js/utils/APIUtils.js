var ServerActionCreators = require('../actions/ServerActionCreators');

module.exports = {

  // getAllOrders: function() {
  //   // retrieve data from a database
  //   $.get('/userdata', function(data) {
  //     ServerActionCreators.receiveAllOrders(JSON.parse(data));
  //   });
  // },
  getAllGraphData: function() {
    $.get('/userdata', function() {
      ServerActionCreators.receiveAllGraphData(JSON.parse(data));
    });
  }
};
