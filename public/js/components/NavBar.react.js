var React = require('react');
// var graphDataStore = require('../stores/GraphDataStore');

var NavBar = React.createClass({

  render: function() {
    return (
      <nav>
        <div id="nav-links">
          <div>Home</div>
          <div>Purchases</div>
          <div>Discover</div>
          <div>Slice & Dice</div>
        </div>
      </nav>
    );
  }
});


module.exports = NavBar;
