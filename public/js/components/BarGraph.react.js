var React = require('react');
var GraphData = require('../stores/GraphDataStore');

var BarGraph = React.createClass({
  getInitialState: function(){
    //receives data and sets to state in order to render chart
    var data = GraphData.getData();
    return {data: data}
  },
  componentDidMount: function(){
    //invokes function to render chart to view
    this._renderChart(this.state.data);
  },
  _renderChart: function(dataset){
    //creates chart
    var barChart = c3.generate({
      bindto: '#chart_3',
      data: {
        json: dataset,
        keys: {
          x : 'merchant',
          value: ['orderTotal']
        },
          type: 'bar'
        },
        axis: {
          rotated: true,
          x: {
            type: 'category' // this needed to load string x value
          }
        },
      color: {
        pattern: ['#24ACBF' , '#F16A4A' , '#FBC162' , '#AFD136' , '#923F96' , '#3B5E9F' , '#F8ED6B' , '#D74667' , '#3E784B']
      }
    })
  },
  render: function() {
    return (
      <div id="bar-graph">
        <div className="graph-header">
          <h2>Top Merchants</h2>
        </div>
        <div id="chart_3"></div>
      </div>
    );
  }
});


module.exports = BarGraph;


