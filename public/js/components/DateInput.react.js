var React = require('react');
var FilteredDataStore = require('../stores/FilteredDataStore');
var ChartActionCreators = require('../actions/ChartActionCreators');

var getStateFromStores = function() {
  return FilteredDataStore.getFilterValue();
};

var DateInput = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },
  componentDidMount: function(){
    FilteredDataStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    FilteredDataStore.removeChangeListener(this._onChange);
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
    console.log('state in date input', this.state);
    return (
      <div id="date-filter-input">

        <form id="date-form">

          <label className="date-filter-label"><b>Date Range</b></label>
          <span className="date-input">
            <input type="date" id="minDate" value={this.state.minDate}/>
          </span>
          <span className="date-input">
            <input type="date" id="maxDate" value={this.state.maxDate}/>
          </span>

          <input type="reset" id="reset" value="RESET" />
          <input type="button" id="submit" value="SUBMIT" />
        </form>

        <div id="filter-wrapper">
          <span className="date-filter-label"><b>Filter</b></span>
          <div className={this.state.category + " category-merchant-button"} onClick={this._filterByCategory}>By Category</div>
          <div className={this.state.merchant + " category-merchant-button"} onClick={this._filterByMerchant}>By Merchant</div>
        </div>

        <div className="divider"></div>
      </div>
    );
  },
  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = DateInput;


