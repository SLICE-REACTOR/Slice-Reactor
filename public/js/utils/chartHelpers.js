var formatLineChartData = function(filteredData) {
  var sliceDataMonthly = {};
  var lineChartData = [];

  for (var i = 0; i < filteredData.length; i++) {
    if (filteredData[i].price > 0) {
      var purchaseDateArray = filteredData[i].date.split('-');
      var monthYear = purchaseDateArray[0] + '-' + purchaseDateArray[1] + '-01';
      if (!sliceDataMonthly[monthYear])
        sliceDataMonthly[monthYear] = filteredData[i].price;
      else
        sliceDataMonthly[monthYear] += filteredData[i].price;
    }
  }
  for (var key in sliceDataMonthly) {
    var lineChartItem = {};
    lineChartItem['date'] = key;
    lineChartItem['price'] = sliceDataMonthly[key].toFixed(2);
    lineChartData.push(lineChartItem);
  }
  return lineChartData;
};

var formatBarChartData = function(filteredData) {
  var sliceDataByCategory = {};
  var barChartData = [];
  var barChartAll = [];

  for (var i = 0; i < filteredData.length; i++) {
    if (filteredData[i].price > 0) {
      var itemCategory = filteredData[i].secondaryLabel;
      if (itemCategory === null) itemCategory = 'Other';
      if (!sliceDataByCategory[itemCategory])
        sliceDataByCategory[itemCategory] = filteredData[i].price;
      else
        sliceDataByCategory[itemCategory] += filteredData[i].price;
    }
  }

  for (var key in sliceDataByCategory) {
    var barChartItem = {};
    barChartItem['categoryName'] = key;
    barChartItem['price'] = sliceDataByCategory[key].toFixed(2);
    barChartAll.push(barChartItem);
  }

  barChartAll.sort(function(a, b) {return b.price - a.price;});

  var barChartOther = {
    categoryName: 'All Others',
    price: 0
  }

  for (var i = 0; i < barChartAll.length; i++) {
    if (i < 6)
      barChartData.push(barChartAll[i]);
    else
      barChartOther.price += parseFloat(barChartAll[i].price);
  }

  if (barChartOther.price > 0) barChartData.push(barChartOther);

  return barChartData;
};

module.exports.formatLineChartData = formatLineChartData;
module.exports.formatBarChartData = formatBarChartData;
