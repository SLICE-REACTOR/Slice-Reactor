var ServerActionCreators = require('../actions/ServerActionCreators');

module.exports = {

  getAllOrders: function() {
    // simulate retrieving data from a database
    var rawOrderData = JSON.parse(localStorage.getItem('orders'));

    // simulate success callback
    ServerActionCreators.receiveAllOrders(rawOrderData);
  },
};
