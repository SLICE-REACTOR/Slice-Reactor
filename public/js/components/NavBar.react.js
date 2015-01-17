var React = require('react');
// var graphDataStore = require('../stores/GraphDataStore');

var NavBar = React.createClass({
  render: function() {
    return (
      <nav>
        <div id="nav-links">
          <div>HOME</div>
          <div>PURCHASES</div>
          <div>DISCOVER</div>
          <div>SLICE & DICE</div>
        </div>
      </nav>
    );
  }
});


module.exports = NavBar;
