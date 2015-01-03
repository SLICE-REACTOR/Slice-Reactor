var React = require('react');
var GraphDataStore = require('../stores/GraphDataStore');

var getStateFromStores = function() {
  var array = GraphDataStore.getData();
  var categoryNames = {};
  var JSONobj = [];
  array.forEach(function(item) {
    var key = item.merchant.href
    var value = item.orderTotal / 100;
    categoryNames[key] = value;
  });
  JSONobj.push(categoryNames);
  console.log('state from stores: ', JSONobj);
  return {data: JSONobj};
};

var Donut = React.createClass({
  getInitialState: function(){
    return getStateFromStores();
  },
  componentDidMount: function(){
    console.log('in componentDidMount data', GraphDataStore.getData());
    GraphDataStore.addChangeListener(this._onChange);
    this._renderChart(this.state.data);
  },
  componentWillUnmount: function() {
    GraphDataStore.removeChangeListener(this._onChange);
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
    this._renderChart(this.state.data);
    return (
      <div id="donut">
        <div className="graph-header">
          <h2>Spending by Category</h2>
        </div>
        <div id="chart_1"></div>
      </div>
    );
  },
  _onChange: function() {
    this.setState(getStateFromStores());
  }
});


module.exports = Donut;


