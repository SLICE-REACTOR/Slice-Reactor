var React = require('react');
var Header = require('./Header.react');
var NavBar = require('./NavBar.react');
var Donut = require('./Donut.react');
var LineGraph = require('./LineGraph.react');
var BarGraph = require('./BarGraph.react');
var Footer = require('./Footer.react');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <Header />
        <NavBar />
        <Donut />
        <LineGraph />
        <BarGraph />
        <Footer />
      </div>
    );
  }
});

module.exports = App;
