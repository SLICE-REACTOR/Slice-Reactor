var lineChartProcessing = function(data) {
  var sliceDataMonthly = {};
  for (var i = 0; i < data.length; i++) {
    if (data[i].price > 0) {
      var purchaseDateArray = data[i].purchaseDate.split('-');
      var monthYear = purchaseDateArray[0] + '-' + purchaseDateArray[1] + '-01';
      if (!sliceDataMonthly[monthYear]) {
        sliceDataMonthly[monthYear] = data[i].price / 100;
      } else {
        sliceDataMonthly[monthYear] += data[i].price / 100;
      }
    }
  }
  lineChartData = [];
  for (var key in sliceDataMonthly) {
    var lineGraphItem = {};
    lineGraphItem['purchaseDate'] = key;
    lineGraphItem['price'] = sliceDataMonthly[key].toFixed(2);
    lineChartData.push(lineGraphItem);
  }
  return lineChartData;
};

var barGraphProcessing = function(data) {
  var sliceDataByCategory = {};
  for (var i = 0; i < data.length; i++) {
    if (data[i].price > 0) {
      var itemCategory = data[i].secondaryLabel;
      if (itemCategory === null) {
        itemCategory = 'Other';
      }
      if (!sliceDataByCategory[itemCategory]) {
        sliceDataByCategory[itemCategory] = data[i].price;
      } else {
        sliceDataByCategory[itemCategory] += data[i].price;
      }
    }
  }
  barGraphAll = [];
  for (var key in sliceDataByCategory) {
    var barChartItem = {};
    barChartItem['categoryName'] = key;
    barChartItem['price'] = sliceDataByCategory[key].toFixed(2);
    barGraphAll.push(barChartItem);
  }
  barGraphAll.sort(function(a, b) {
    return b.price - a.price;
  });
  barGraphData = [];
  var barChartOther = {
    categoryName: 'All Others',
    price: 0
  }
  for (var i = 0; i < barGraphAll.length; i++) {
    if (i < 6) {
      barGraphData.push(barGraphAll[i]);
    } else {
      barChartOther.price += parseFloat(barGraphAll[i].price);
    }
  }
  if (barChartOther.price > 0) {
    barGraphData.push(barChartOther);
  }
  return barGraphData;
};

module.exports.lineChartProcessing = lineChartProcessing;
module.exports.barGraphProcessing = barGraphProcessing;
