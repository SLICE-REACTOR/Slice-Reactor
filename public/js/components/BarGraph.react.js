var React = require('react');
var GraphDataStore = require('../stores/GraphDataStore');

var getStateFromStores = function() {
  return {data: GraphDataStore.getData()}
};

var BarGraph = React.createClass({
  getInitialState: function() {
    return getStateFromStores();
  },
  componentDidMount: function(){
    //invokes function to render chart to view
    GraphDataStore.addChangeListener(this._onChange);
    this._renderChart(this.state.data);
  },
  componentWillMount: function() {
    GraphDataStore.removeChangeListener(this._onChange);
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
    this._renderChart(this.state.data);
    return (
      <div id="bar-graph">
        <div className="graph-header">
          <h2>Top Merchants</h2>
        </div>
        <div id="chart_3"></div>
      </div>
    );
  },
  _onChange: function() {
    this.setState(getStateFromStores());
  }
});

module.exports = BarGraph;
