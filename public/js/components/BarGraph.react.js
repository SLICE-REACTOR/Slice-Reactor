var React = require('react');
var GraphData = require('../stores/GraphDataStore');

var categoryPrice = function(array){
  var categoryNames= {};
  var JSONobj = [];
  array.forEach(function(item){
    var key = item.merchant.href;
    console.dir(item)
    var value = item.orderTotal/100;
    categoryNames[key] = value;
  })
  JSONobj.push(categoryNames);
  return JSONobj;
};



var BarGraph = React.createClass({
  getInitialState: function(){
    var data = GraphData.getData();
    return {data: data}
  },
  componentDidMount: function(){
    this._renderChart(this.state.data);
  },
  _renderChart: function(dataset){
    var barChart = c3.generate({
      bindto: '#chart_3',
      data: {
        columns: [
            ['data1', 30, 200, 100, 400, 150, 250],
        ],
        types: {
            data1: 'bar',
        }
      },
      axis: {
        rotated: true
      }
    })
  },
  render: function() {
    return (
      <div>
        <div id="chart_3"></div>
      </div>
    );
  }
});


module.exports = BarGraph;


