var React = require('react');
var GraphData = require('../stores/GraphDataStore');

var pullData = function(array){
  //gets data from json and extracts what is needed for chart
  var categoryNames= {};
  var JSONobj = [];
  array.forEach(function(item){
    var key = item.merchant.href;
    var value = item.orderTotal/100;
    categoryNames[key] = value;
  })
  JSONobj.push(categoryNames);
  return JSONobj;
};

var Donut = React.createClass({
  getInitialState: function(){
    var graphData = GraphData.getData();
    var data = pullData(graphData);
    return {data: data}
  },
  componentDidMount: function(){
    this._renderChart(this.state.data);
  },
  _renderChart: function(dataset){
    var key = Object.keys(dataset[0]);
    var donutChart = c3.generate({
      bindto: '#chart_1',
      data: {
        json: dataset,
        keys: {
          value: key
        },
        type: 'donut'
      },
      legend: {
        position: 'right'
      },
      donut: {
        label: {
          show: false
        },
        width: 90
      },
      color: {
        pattern: ['#AFD136' , '#923F96' , '#F06B50' , '#796BAE' , '#2FACBE' , '#D74667' , '#3B5E9F' , '#C678AF' , '#F8ED6B' , '#148493' , '#FAB44A' , '#3E784B']
      }
    })
  },
  render: function() {
    return (
      <div id="donut">
        <div className="graph-header">
          <h2>Spending by Category</h2>
        </div>
        <div id="chart_1"></div>
      </div>
    );
  }
});


module.exports = Donut;


