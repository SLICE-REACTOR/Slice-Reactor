var React = require('react');
var LineChartStore = require('../stores/LineChartStore');
var FilteredDataStore = require('../stores/FilteredDataStore');

var getStateFromStores = function() {
  return {data: LineChartStore.getData()}
};

var LineChart = React.createClass({
  getInitialState: function(){
    return getStateFromStores();
  },
  componentDidMount: function(){
    LineChartStore.addChangeListener(this._onChange);
    this._renderChart(this.state.data);
  },
  componentWillMount: function() {
    LineChartStore.removeChangeListener(this._onChange);
  },
  _renderChart: function(dataset){
    var lineChart = c3.generate({
      bindto: '#chart_2',
      padding: {
        right: 100,
        bottom: 40,
        left: 90,
      },
      data: {
        x: 'date',
        json: dataset,
        keys: {
          x: 'date',
          value: [ "price"]
        }
      },
      color: {
        pattern: ['#24ACBF']
      },
      point: {r: 4},
      axis: {
        x: {
          type: 'timeseries',
          tick: {rotate: 90, format: '%b-%Y'}
        },
        y : {
          label: {text: 'Dollars Spent', position: 'outer-middle'},
          padding: {top: 20, bottom: 10},
          tick: {
            format: function(d) {
              if (d > 100) {
                return Math.round(d / 50) * 50;
              } else if (d > 20) {
                return Math.round(d / 20) * 20;
              } else if (d > 5) {
                return Math.round(d / 5) * 5;
              } else {
                return Math.round(d);
              }
            },
            values: [0, LineChartStore.getMaxPrice()/2, LineChartStore.getMaxPrice()]
          },
          min: 0
        }
      },
      legend: {show: false},
      grid: {
        y: {show: true}
      },
      tooltip: {
        format: {
          title: function (d) { return },
          value: function (value, ratio, id) {
            var newValue = Math.floor(value);
            var format = d3.format('$');  
              return format(newValue);
          }
        }
      }
    });
  },
  render: function() {
    this._renderChart(this.state.data);
    return (
      <div id="line-graph">
        <div className="graph-header">
        <h2>Spending Trends</h2>
        </div>
        <div id="chart_2"></div>
      </div>
    );
  },
  _onChange: function() {
    this.setState(getStateFromStores());
  }
});

module.exports = LineChart;
