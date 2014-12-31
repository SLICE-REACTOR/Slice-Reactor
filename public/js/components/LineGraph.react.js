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

    var lineChart = c3.generate({
      bindto: '#chart_2',
      data: {
        columns: [
            ['data1', 400, 10, 20, 90, 120, 30, 40, 50, 200, 100, 70, 150, 100],
        ],
        regions: {
            'data1': [{'start':1, 'end':2, 'style':'dashed'},{'start':3}],
        }
      },
      color: {
        pattern: ['#24ACBF']
      },
      point: {
        r: 6
      },
      axis: {
        y : {
          label: {
            text: 'Dollars Spent',
            position: 'outer-middle'
          }
        },
        x: {
          tick: {
            rotate: 90
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


