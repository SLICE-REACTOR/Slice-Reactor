var React = require('react');
// var graphDataStore = require('../stores/GraphDataStore');

var NavBar = React.createClass({

  render: function() {
    return (
      <div>
        <h1>Nav Bar</h1>
        <div>Home</div>
        <div>Purchases</div>
        <div>Discover</div>
        <div>Slice & Dice</div>
      </div>
    );
  }
});


module.exports = NavBar;
