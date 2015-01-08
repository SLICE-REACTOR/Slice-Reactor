var React = require('react');
var DonutChartStore = require('../stores/DonutChartStore');
var FilteredDataStore = require('../stores/FilteredDataStore');

var getStateFromStores = function() {
  var array = DonutChartStore.getData();
  console.log('donut chart data: ', DonutChartStore.getData());
  var categoryNames = {};
  var JSONobj = [];
  array.forEach(function(item) {
    var key = item.primaryLabel;
    var value = 0;

    if (item.price > 0)
      value = item.price / 100;

    categoryNames[key] = value;
  });
  JSONobj.push(categoryNames);
  return {data: JSONobj};
};

var Donut = React.createClass({
  getInitialState: function(){
    return getStateFromStores();
  },
  componentDidMount: function(){
    DonutChartStore.addChangeListener(this._onChange);
    this._renderChart(this.state.data);
  },
  componentWillUnmount: function() {
    DonutChartStore.removeChangeListener(this._onChange);
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
          <h2>Spending by {FilteredDataStore.getFilterValue().primary}</h2>
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


