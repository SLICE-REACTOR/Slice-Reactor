var React = require('react');
var GraphDataStore = require('../stores/GraphDataStore');

var LineGraph = React.createClass({
  getInitialState: function(){
    var data = GraphDataStore.getData();
    return {data: data}
  },
  componentDidMount: function(){
    this._renderChart(this.state.data);
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
        x: 'x',
        columns: [
          ['x', '2013-01-01', '2013-02-01', '2013-03-01', '2013-04-01', '2013-05-01', '2013-06-01'],
          ['data', 39, 2, 6, 11, 5, 4]
        ],
        regions: {
          //set region to remove excess fill from chart
          data: [[{'start':1, 'end':2, 'style':'dashed'}]]
        }
      },
      color: {
        pattern: ['#24ACBF']
      },
      point: {
        //increases size of point
        r: 6
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
          label: {
            text: 'Dollars Spent',
            position: 'outer-middle'
          }
        }
      },
      legend: {
          show: false
      },
      tooltip: {
        show: false
      }
    });
  },
  render: function() {
    return (
      <div id="line-graph">
        <div className="graph-header">
        <h2>Spending Trends</h2>
        </div>
        <div id="chart_2"></div>
      </div>
    );
  }
});


module.exports = LineGraph;


