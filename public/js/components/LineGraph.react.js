var React = require('react');
var GraphData = require('../stores/GraphDataStore');

var categoryPrice = function(array){
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

var LineGraph = React.createClass({
  getInitialState: function(){
    var data = GraphData.getData();
    return {data: data}
  },
  componentDidMount: function(){
    this._renderChart(this.state.data);
  },
  _renderChart: function(dataset){
    var data = categoryPrice(dataset);
    var key = Object.keys(data[0]);
    console.log(dataset);

    var lineChart = c3.generate({
      bindto: '#chart_2',
      data: {
        columns: [
            ['data1', 30, 200, 100, 400, 150, 250],
            ['data2', 50, 20, 10, 40, 15, 25]
        ],
        regions: {
            'data1': [{'start':1, 'end':2, 'style':'dashed'},{'start':3}],
            'data2': [{'end':3}]
        }
      },
      legend: {
          show: false
      }
    });
  },
  render: function() {
    return (
      <div>
        <div id="chart_2"></div>
      </div>
    );
  }
});


module.exports = LineGraph;


