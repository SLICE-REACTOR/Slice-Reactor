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
    var lineChartItem = {};
    lineChartItem['purchaseDate'] = key;
    lineChartItem['price'] = sliceDataMonthly[key].toFixed(2);
    lineChartData.push(lineChartItem);
  }
  return lineChartData;
};

var barChartProcessing = function(data) {
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
  barChartAll = [];
  for (var key in sliceDataByCategory) {
    var barChartItem = {};
    barChartItem['categoryName'] = key;
    barChartItem['price'] = sliceDataByCategory[key].toFixed(2);
    barChartAll.push(barChartItem);
  }
  barChartAll.sort(function(a, b) {
    return b.price - a.price;
  });
  barChartData = [];
  var barChartOther = {
    categoryName: 'All Others',
    price: 0
  }
  for (var i = 0; i < barChartAll.length; i++) {
    if (i < 6) {
      barChartData.push(barChartAll[i]);
    } else {
      barChartOther.price += parseFloat(barChartAll[i].price);
    }
  }
  if (barChartOther.price > 0) {
    barChartData.push(barChartOther);
  }
  return barChartData;
};

module.exports.lineChartProcessing = lineChartProcessing;
module.exports.barChartProcessing = barChartProcessing;
