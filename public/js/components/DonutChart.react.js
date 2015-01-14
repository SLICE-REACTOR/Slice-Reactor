var React = require('react');
var DonutChartStore = require('../stores/DonutChartStore');
var FilteredDataStore = require('../stores/FilteredDataStore');
var ChartActionCreators = require('../actions/ChartActionCreators');

var colorArray = [];
var donutPieceColor, pieceName,dollarAmount;
var currentDisplayState = 'none';

var showDisplay = function(){
  return {display: currentDisplayState}
};

var donutPieceValue = function(name, amount){
  currentDisplayState = 'inline';
  pieceName = name;
  dollarAmount = "$" + Math.floor(amount);
};

var addColorToDiv = function(pieceName){
  colorArray.forEach(function(item){
    if(item[1] === pieceName){
      donutPieceColor = item[0];
    }
  });
  return {backgroundColor: donutPieceColor}
};

var updateChartData = function(item){
  ChartActionCreators.filterDonutChartData(item);
};

var getStateFromStores = function() {
  return {data: DonutChartStore.getData()}
};

var DonutChart = React.createClass({
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
        type: 'donut',
        order: null,
        color: function (color, d) {
          if (d.id){
            colorArray.push([color, d.id]);
          }
          return color;
        },
        onclick: function (d) { 
          addColorToDiv(d.id);
          donutPieceValue(d.id, d.value);
          updateChartData(d.id);
        }
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
        <div id="donutPieceName" style={showDisplay()}>
          <div id="donutPieceColor" style={addColorToDiv()}></div>
          <li id="elementName"><b>{pieceName}</b></li>
          <li id="elementValue"><b>{dollarAmount}</b> spent</li>
        </div>
        <div id="chart_1"></div>
      </div>
    );
  },
  _onChange: function() {
    this.setState(getStateFromStores());
    currentDisplayState = 'none';
  }
});

module.exports = DonutChart;
