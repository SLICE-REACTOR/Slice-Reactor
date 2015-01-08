var React = require('react');
var GraphDataStore = require('../stores/GraphDataStore');
var FilteredDataStore = require('../stores/FilteredDataStore');
var ChartActionCreators = require('../actions/ChartActionCreators');

var getStateFromStores = function() {
  return GraphDataStore.getFilterValue();
};

var BarChart = React.createClass({

  getInitialState: function() {
    console.log('getting initial state');
    return {
      category: 'active',
      merchant: ''
    }
  },

  _filterByCategory: function() {
    FilteredDataStore.setFilter('category');
    this.setState(FilteredDataStore.getFilterValue());
    ChartActionCreators.filterData('category');
  },

  _filterByMerchant: function() {
    FilteredDataStore.setFilter('merchant');
    this.setState(FilteredDataStore.getFilterValue());
    ChartActionCreators.filterData('merchant');
  },

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
          <div className={this.state.category + " category-merchant-button"} onClick={this._filterByCategory}>By Category</div>
          <div className={this.state.merchant + " category-merchant-button"} onClick={this._filterByMerchant}>By Merchant</div>
        </div>

        <div className="divider"></div>
      </div>
    );
  }

});

module.exports = BarChart;


