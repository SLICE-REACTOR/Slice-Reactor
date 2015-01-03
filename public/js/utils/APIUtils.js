var ServerActionCreators = require('../actions/ServerActionCreators');

module.exports = {

  getAllOrders: function() {
    // retrieve data from a database
    $.get('/userdata', function(data) {
      console.log('data', JSON.parse(data));
      ServerActionCreators.receiveAllOrders(JSON.parse(data));
    });
  },
};
