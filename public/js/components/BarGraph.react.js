var React = require('react');
var GraphDataStore = require('../stores/GraphDataStore');

var getStateFromStores = function() {
  var sliceData = GraphDataStore.getData();
  var sliceDataByCategory = {};
  for (var i = 0; i < sliceData.length; i++) {
    if (sliceData[i].price > 0) {
      var itemCategory = sliceData[i].categoryName;
      if (itemCategory === null) {
        itemCategory = 'Other';
      }
      if (!sliceDataByCategory[itemCategory]) {
        sliceDataByCategory[itemCategory] = sliceData[i].price / 100;
      } else {
        sliceDataByCategory[itemCategory] += sliceData[i].price / 100;
      }
    }
  }
  sliceData = [];
  for (var key in sliceDataByCategory) {
    var barChartItem = {};
    barChartItem['categoryName'] = key;
    barChartItem['price'] = sliceDataByCategory[key].toFixed(2);
    sliceData.push(barChartItem);
  }
  sliceData.sort(function(a, b) {
    return b.price - a.price;
  });
  var sliceDataShortened = sliceData.slice(0,10);
  console.log(sliceDataShortened);
  return {data: sliceDataShortened}
};

var BarGraph = React.createClass({
  getInitialState: function() {
    return getStateFromStores();
  },
  componentDidMount: function(){
    GraphDataStore.addChangeListener(this._onChange);
    this._renderChart(this.state.data);
  },
  componentWillMount: function() {
    GraphDataStore.removeChangeListener(this._onChange);
  },
  _renderChart: function(dataset){
    //creates chart
    var barChart = c3.generate({
      bindto: '#chart_3',
      data: {
        json: dataset,
        keys: {
          x : 'categoryName',
          value: ['price']
        },
          type: 'bar'
        },
        axis: {
          rotated: true,
          x: {
            type: 'categoryName' // this needed to load string x value
          }
        },
      color: {
        pattern: ['#24ACBF' , '#F16A4A' , '#FBC162' , '#AFD136' , '#923F96' , '#3B5E9F' , '#F8ED6B' , '#D74667' , '#3E784B']
      }
    })
  },
  render: function() {
    this._renderChart(this.state.data);
    return (
      <div id="bar-graph">
        <div className="graph-header">
          <h2>Top Merchants</h2>
        </div>
        <div id="chart_3"></div>
      </div>
    );
  },
  _onChange: function() {
    this.setState(getStateFromStores());
  }
});

module.exports = BarGraph;
