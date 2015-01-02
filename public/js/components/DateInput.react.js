var React = require('react');
var GraphData = require('../stores/GraphDataStore');
var BarGraph = React.createClass({

  render: function() {
    return (
      <div id="date-filter-input">

        <form id="date-form">
          <label className="date-filter-label"><b>Date Range</b></label>
          <span className="date-input">
            <input type="date" id="minDate" />
          </span>
          <span className="date-input">
            <input type="date" id="maxDate" />
          </span>
          <input type="reset" id="reset" value="RESET" />
        </form>

        <div id="filter-wrapper">
          <span className="date-filter-label"><b>Filter</b></span>
          <div className="category-merchant-button">By Category</div>
          <div className="category-merchant-button">By Merchant</div>
        </div>
        <div className="divider"></div>
      </div>
    );
  }
});

module.exports = BarGraph;


