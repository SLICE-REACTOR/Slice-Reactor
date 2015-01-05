var React = require('react');
var GraphDataStore = require('../stores/GraphDataStore');

var getStateFromStores = function() {
  return {data: GraphDataStore.getData()}
};

var LineGraph = React.createClass({
  getInitialState: function(){
    return getStateFromStores();
  },
  componentDidMount: function(){
    GraphDataStore.addChangeListener(this._onChange);
    this._renderChart(this.state.data);
  },
  componentWillMount: function() {
    GraphDataStore.removeChangeListener(this._onChange);
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
        x: 'purchaseDate',
        json: dataset,
        keys: {
            x: 'purchaseDate',
            value: [ "quantity"]
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
            format: '%m-%Y'
          }
        },
        y : {
          tick: {
            values: [0, 1, 2, 3, 4]
          },
          label: {
            text: 'Dollars Spent',
            position: 'outer-middle'
          }
        }
      },
      legend: {
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


module.exports = LineGraph;

