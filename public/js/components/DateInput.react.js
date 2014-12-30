var React = require('react');
var GraphData = require('../stores/GraphDataStore');
var BarGraph = React.createClass({

  render: function() {
    return (
      <div id="date-input">
        <span>Date Range</span>
        <span>Filter</span>
        <span className="category-merchant-button">By Category</span>
        <span className="category-merchant-button">By Merchant</span>
      </div>
    );
  }
});


module.exports = BarGraph;


