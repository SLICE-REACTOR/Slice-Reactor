var React = require('react');
var Header = require('./Header.react');
var NavBar = require('./NavBar.react');
var DateInput = require('./DateInput.react');
var Donut = require('./Donut.react');
var LineGraph = require('./LineGraph.react');
var BarGraph = require('./BarGraph.react');
var Footer = require('./Footer.react');

console.log('app.react');

var App = React.createClass({
  render: function() {
    return (
      <div id="background">
        <Header />
        <NavBar />
        <div id="wrapper">
          <DateInput />
          <Donut />
          <LineGraph />
          <BarGraph />
          <Footer />
        </div>
      </div>
    );
  }
});

module.exports = App;
