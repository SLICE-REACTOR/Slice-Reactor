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
      padding: {
        right: 100,
        bottom: 40,
        left: 130,
      },
      data: {
        x : 'x',
        columns: [
            ['x', 'somesitename1', 'somesitename2', 'somesitename3', 'somesitename4', 'somesitename5', 'somesitename6', 'somesitename7', 'somesitename8', 'somesitename9'],
            ['pv', 90, 100, 140, 200, 100, 400, 90, 100, 140, 200, 100, 400],
        ],
        type: 'bar'
      },
      legend: {
        show: false
      },
      tooltip: {
        show: false
      },
      axis: {
        rotated: true,
        y: {
          label: {
            text: 'Dollars Spent',
            position: 'outer-center'
          }
        },
        x: {
          type: 'category',
          tick: {
              rotate: 75,
              multiline: false
          },
          height: 130
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


