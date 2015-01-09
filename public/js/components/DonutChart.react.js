var React = require('react');
var DonutChartStore = require('../stores/DonutChartStore');
var FilteredDataStore = require('../stores/FilteredDataStore');

var getStateFromStores = function() {
  var data = DonutChartStore.getData();
  var categoryOrMerchantData = {};
  var totalSpent = 0;
  data.forEach(function(item) {
    if (item.price > 0) {
      var itemLabel = item.primaryLabel;
      if (itemLabel === null) {
        itemLabel = 'Other';
      }
      totalSpent += item.price;
      if (!categoryOrMerchantData[itemLabel]) {
        categoryOrMerchantData[itemLabel] = item.price;
      } else {
        categoryOrMerchantData[itemLabel] += item.price;
      }
    }
  });
  var donutChartData = [];
  var donutChartDataOthers = [];
  var donutChartAllOthersItem = ['All Others', 0];
  for (var key in categoryOrMerchantData) {
    if (categoryOrMerchantData[key] / totalSpent * 100 >= 3) {
      var donutChartItem = [key, categoryOrMerchantData[key].toFixed(2)];
      donutChartData.push(donutChartItem);
    } else {
      donutChartAllOthersItem[1] += categoryOrMerchantData[key];
      donutChartDataOthers.push([key, categoryOrMerchantData[key].toFixed(2)])
    }
  }
  if (donutChartData.length < 8) {
    donutChartDataOthers.sort(function(a, b) {
      return a[1] - b[1];
    });
    while (donutChartData.length < 8 && donutChartDataOthers.length > 0) {
      donutChartAllOthersItem[1] -= donutChartDataOthers[donutChartDataOthers.length - 1][1];
      donutChartData.push(donutChartDataOthers.pop())
    }  
  }
  if (donutChartAllOthersItem[1] > 0) {
    donutChartAllOthersItem[1] = donutChartAllOthersItem[1].toFixed(2);
    donutChartData.push(donutChartAllOthersItem);
  }
  return {data: donutChartData};
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
