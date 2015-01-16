var React = require('react');
var DonutChartStore = require('../stores/DonutChartStore');
var FilteredDataStore = require('../stores/FilteredDataStore');
var ChartActionCreators = require('../actions/ChartActionCreators');

var colorArray = [];
var donutPieceColor, pieceName, dollarAmount, currentDisplayState;
var currentItem = 'none';

var showDisplay = function(){
  //hides div if no donut piece is selected
  currentDisplayState = DonutChartStore.donutPieceNameDisplay();
  return {display: currentDisplayState}
};

var updateChartData = function(id, value){
  addColorToDiv(id);
  donutPieceValue(id, value);
  sendChartData(id);
};
  
var findAmount = function(dataset, id){
  //find amount from corresponding legend item since not transferred on click
  dataset.forEach(function(item){
    if(item[0] === id){
      dollarAmount = item[1];
    }
  })
  updateChartData(id);
};

var donutPieceValue = function(name, amount){
  //sets value to display donut drill down
  amount = amount || dollarAmount;
  pieceName = name;
  dollarAmount = "$" + Math.floor(amount);
};

var addColorToDiv = function(pieceName){
  //finds corresponding color from donut piece name to display in drill down
  colorArray.forEach(function(item){
    if(item[1] === pieceName){
      donutPieceColor = item[0];
    }
  });
  return {backgroundColor: donutPieceColor}
};

var sendChartData = function(item){
  item = item || currentItem;
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
          currentItem = d.id;
          updateChartData(currentItem, d.value);
        }
      },
      legend: {
        position: 'right',
        item : {
          onclick: function(id){
            currentItem = id;
            findAmount(dataset, currentItem);
          }
        }
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
        <DonutDrillDown/>
        <div id="chart_1"></div>
      </div>
    );
  },
  _onChange: function() {
    this.setState(getStateFromStores());
    currentDisplayState = 'none';
  }
});

var DonutDrillDown = React.createClass({
  _handleClick: function(){
    sendChartData();
  },
  render: function(){
    return (
      <div className="donutPieceName" style={showDisplay()}>
        <div id="donutPieceColor" style={addColorToDiv()}></div>
        <CloseButton onButtonClicked={this._handleClick}/>
        <li id="elementValue"><strong>{dollarAmount}</strong> spent</li>
      </div>
    )
  }
});

var CloseButton = React.createClass({
  render: function(){
      return (
        <div className="closeDonutPiece">
          <li id="elementName"><strong>{pieceName}</strong> 
            <span id="xToClose" onClick={this.props.onButtonClicked}> x </span>
          </li>
        </div>
      )
  }
});


module.exports = DonutChart;
