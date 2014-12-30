var React = require('react');
// var graphDataStore = require('../stores/GraphDataStore');

var NavBar = React.createClass({

  render: function() {
    return (
      <nav>
        <span>Home</span>
        <span>Purchases</span>
        <span>Discover</span>
        <span>Slice & Dice</span>
      </nav>
    );
  }
});


module.exports = NavBar;
