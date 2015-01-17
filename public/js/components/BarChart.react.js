var React = require('react');
var BarChartStore = require('../stores/BarChartStore');
var FilteredDataStore = require('../stores/FilteredDataStore');

var getStateFromStores = function() {
  return {data: BarChartStore.getData()}
};

var BarChart = React.createClass({
  getInitialState: function() {
    return getStateFromStores();
  },
  componentDidMount: function() {
    BarChartStore.addChangeListener(this._onChange);
    this._renderChart(this.state.data);
  },
  componentWillMount: function() {
    BarChartStore.removeChangeListener(this._onChange);
  },
  _renderChart: function(dataset) {
    // creates bar chart using C3
    var barChart = c3.generate({
      bindto: '#chart_3',
      data: {
        json: dataset,
        keys: { //name of keys in dataset to set axis valuses
          x : 'categoryOrMerchantName',
          value: ['price']
        },
          type: 'bar'
      },
      axis: {
        rotated: true,
        x: {
          // this needed to load string x value
          type: 'categoryOrMerchantName'
        }
      },
      color: {
        pattern: ['#24ACBF' , '#F16A4A' , '#FBC162' , '#AFD136' , '#923F96' , '#3B5E9F' , '#F8ED6B' , '#D74667' , '#3E784B']
      },
      legend: {
        show: false
      },
      grid: {
        y: {
          show: true
        },
        x: {
          show: false
        }
      },
      tooltip: {
        format: {
          //hides table title natively displayed
          title: function (d) { return },
          value: function (value, ratio, id) {
            //removes decimals from number and adds '$' to price
            var newValue = Math.floor(value);
            var format = d3.format('$');
              return format(newValue);
          }
        }
      }
    })
  },
  render: function() {
    this._renderChart(this.state.data);
    return (
      <div id="bar-graph">
        <div className="graph-header">
          <h2>Top {FilteredDataStore.getFilterValue().secondary}</h2>
        </div>
        <div id="chart_3"></div>
      </div>
    );
  },
  _onChange: function() {
    this.setState(getStateFromStores());
  }
});

module.exports = BarChart;
