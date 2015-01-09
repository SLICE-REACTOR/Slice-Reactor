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
  _filterByCategory: function(event) {
    ChartActionCreators.filterData('category');
  },
  _filterByMerchant: function() {
    ChartActionCreators.filterData('merchant');
  },
  _handleMinDateChange: function(event) {
    this.setState({minDate: event.target.value});
  },
  _handleMaxDateChange: function(event) {
    this.setState({maxDate: event.target.value});
  },
  _submitDates: function() {
    // relies on this.state having properties 'minDate' and 'maxDate'
    ChartActionCreators.filterByDate(this.state);
  },
  _resetDates: function() {
    this.setState({
      minDate: this.state.setMinDate,
      maxDate: this.state.setMaxDate
    });
    var date = {}
    date.minDate = this.state.setMinDate;
    date.maxDate = this.state.setMaxDate;
    ChartActionCreators.filterByDate(date);
  },
  render: function() {
    return (
      <div id="date-filter-input">

        <form id="date-form">

          <label className="date-filter-label"><b>Date Range</b></label>
          <span className="date-input">
            <input type="date"
              id="minDate"
              onChange={this._handleMinDateChange}
              value={this.state.minDate}
              min={this.state.setMinDate}
              max={this.state.setMaxDate}
              defaultValue={this.state.minDate}/>
          </span>
          <span className="date-input">
            <input type="date"
              id="maxDate"
              onChange={this._handleMaxDateChange}
              value={this.state.maxDate}
              min={this.state.setMinDate}
              max={this.state.setMaxDate}
              defaultValue={this.state.maxDate}/>
          </span>

          <input type="button" id="reset" value="RESET" onClick={this._resetDates}/>
          <input type="button" id="submit" value="SUBMIT" onClick={this._submitDates}/>
        </form>

        <div id="filter-wrapper">
          <span className="date-filter-label"><b>Filter</b></span>
          <div className={this.state.category + " category-merchant-button"} value="category" onClick={this._filterByCategory}>By Category</div>
          <div className={this.state.merchant + " category-merchant-button"} value="merchant" onClick={this._filterByMerchant}>By Merchant</div>
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


