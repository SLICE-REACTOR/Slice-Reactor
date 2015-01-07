var React = require('react');
var GraphDataStore = require('../stores/GraphDataStore');
var GraphActionCreators = require('../actions/GraphActionCreators');

var getFilterState = function() {
  return GraphDataStore.getActiveFilter;
};

var BarGraph = React.createClass({

  getInitialState: function() {
    console.log('getting initial state');
    return {
      category: 'active',
      merchant: ''
    }
  },

  _filterByCategory: function() {
    console.log('_filterByCategory');

    GraphActionCreators.filterData('category');
    this.setState({
      category: 'active',
      merchant: ''
    });

    console.log('state: ', this.state);
  },

  _filterByMerchant: function() {
    console.log('_filterByMerchant');

    GraphActionCreators.filterData('merchant');
    this.setState({
      category: '',
      merchant: 'active'
    });

    console.log('state: ', this.state);
  },

  componentDidMount: function(){
    GraphDataStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    GraphDataStore.removeChangeListener(this._onChange);
  },

  render: function() {
    console.log('rendering datainput form');
    console.log('state.category: ', this.state.category);
    console.log('state.merchant: ', this.state.merchant);
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
  },
  _onChange: function() {
    this.setState({
      category: '',
      merchant: 'active'
    });
  }

});

module.exports = BarGraph;


