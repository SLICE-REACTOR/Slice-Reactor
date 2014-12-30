var React = require('react');
var GraphData = require('../stores/GraphDataStore');
var BarGraph = React.createClass({

  render: function() {
    return (
      <div id="date-filter-input">
        <span id="date-range-wrapper">
          <span><b>Date Range</b></span>
          <div className="date-input">May 1, 2012</div>
          <div className="date-input">Sep 1, 2014</div>
        </span>
        <div align="right" id="filter-wrapper">
          <span><b>Filter</b></span>
          <div className="category-merchant-button">By Category</div>
          <div className="category-merchant-button">By Merchant</div>
        </div>
        <div className="divider"></div>
      </div>
    );
  }
});


module.exports = BarGraph;


