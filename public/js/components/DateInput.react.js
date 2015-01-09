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
  _handleMinDateChange: function(event) {
    this.setState({minDate: event.target.value});
  },
  _handleMaxDateChange: function(event) {
    this.setState({maxDate: event.target.value});
  },
  _filterByDate: function() {
    console.log('clicked submit');
    var dates = {};
    dates.minDate = this.state.minDate;
    dates.maxDate = this.state.maxDate;
    ChartActionCreators.filterByDate(dates);
  },
  render: function() {
    console.log('state in date input', this.state);
    var minDate = this.state.minDate;
    var maxDate = this.state.maxDate;
    return (
      <div id="date-filter-input">

        <form id="date-form">

          <label className="date-filter-label"><b>Date Range</b></label>
          <span className="date-input">
            <input type="date" id="minDate" onChange={this._handleMinDateChange} value={minDate} defaultValue={minDate}/>
          </span>
          <span className="date-input">
            <input type="date" id="maxDate" onChange={this._handleMaxDateChange} value={maxDate} defaultValue={maxDate}/>
          </span>

          <input type="reset" id="reset" value="RESET" />
          <input type="button" id="submit" value="SUBMIT" onClick={this._filterByDate}/>
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


