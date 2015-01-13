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
    ChartActionCreators.filterData('category');
  },
  _filterByMerchant: function() {
    ChartActionCreators.filterData('merchant');
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
              value={this.state.minDate}
              min={this.state.setMinDate}
              max={this.state.maxDate}
              readOnly="true"
              defaultValue={this.state.minDate} />
          </span>
          <span className="date-input">
            <input type="date"
              id="maxDate"
              value={this.state.maxDate}
              min={this.state.minDate}
              max={this.state.setMaxDate}
              readOnly="true"
              defaultValue={this.state.maxDate} />
          </span>

          <input type="button" id="reset" value="RESET" onClick={this._resetDates}/>
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
    $('#minDate').datepicker({
      dateFormat: 'yy-mm-dd',
      minDate: FilteredDataStore.getFilterValue().setMinDate,
      maxDate: FilteredDataStore.getFilterValue().setMaxDate,
      changeYear: true,
      prevText: '<<',
      nextText: '>>',
      onSelect: function(data, inst) {
        this.setState({minDate: data});
        ChartActionCreators.filterByDate(this.state);
      }.bind(this)
    });
    $('#maxDate').datepicker({
      dateFormat: 'yy-mm-dd',
      minDate: FilteredDataStore.getFilterValue().setMinDate,
      maxDate: FilteredDataStore.getFilterValue().setMaxDate,
      changeYear: true,
      prevText: '<<',
      nextText: '>>',
      onSelect: function(data, inst) {
        this.setState({maxDate: data});
        ChartActionCreators.filterByDate(this.state);
      }.bind(this)
    });
    this.setState(getStateFromStores());
  }
});

module.exports = DateInput;


