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
      point: {
        //increases size of point
        r: 5
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            rotate: 75,
            format: '%b-%Y'
          }
        },
        y : {
          label: {
            text: 'Dollars Spent',
            position: 'outer-middle'
          }
        }
      },
      legend: {
          show: false
      },
      grid: {
        y: {
            show: true
        }
      },
      tooltip: {
        show: false
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
