var React = require('react');
var DonutChartStore = require('../stores/DonutChartStore');
var FilteredDataStore = require('../stores/FilteredDataStore');
var ChartActionCreators = require('../actions/ChartActionCreators');

var updateChartData = function(item){
  ChartActionCreators.filterDonutChartData(item);
};

var getStateFromStores = function() {
  return {data: DonutChartStore.getData()}
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
    var donutChart = c3.generate({
      bindto: '#chart_1',
      data: {
        columns: dataset,
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
