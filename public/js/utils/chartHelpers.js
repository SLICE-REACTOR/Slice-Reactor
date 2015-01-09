var lineGraphItemConstructor = function(year, month, existingDates) {
  var lineGraphItem = {};
  var monthString = month;
  if (monthString < 10) {
    var monthString = "0" + month;
  }
  var dateKey = year + "-" + monthString + "-01";
    lineGraphItem['date'] = dateKey;
  if (existingDates[dateKey]) {
    lineGraphItem['price'] = existingDates[dateKey].toFixed(2) || 0;
  } else {
    lineGraphItem['price'] = 0;
  }
  return lineGraphItem;
};

var formatLineChartData = function(filteredData) {
  var sliceDataMonthly = {};
  var earliestYearMonthData = [];
  for (var i = 0; i < filteredData.length; i++) {
    var purchaseDateArray = filteredData[i].date.split('-');
    if (i === 0 || purchaseDateArray[0] < earliestYearMonthData[0]) {
      earliestYearMonthData[0] = purchaseDateArray[0];
      if (i === 0 || purchaseDateArray[1] < earliestYearMonthData[1]) {
        earliestYearMonthData[1] = purchaseDateArray[1];
      }
    }
    if (filteredData[i].price > 0) {
      var monthYear = purchaseDateArray[0] + '-' + purchaseDateArray[1] + '-01';
      if (!sliceDataMonthly[monthYear])
        sliceDataMonthly[monthYear] = filteredData[i].price;
      else
        sliceDataMonthly[monthYear] += filteredData[i].price;
    }
  }
  var lineChartData = [];
  var currentDate = new Date;
  var currentYearMonth = [currentDate.getFullYear(), currentDate.getMonth() + 1];
  for (var year = earliestYearMonthData[0]; year <= currentYearMonth[0]; year++) {
    for (var month = 1; month < 13; month ++) {
      if (year === earliestYearMonthData[0] && month >= earliestYearMonthData[1]) {
        lineChartData.push(lineGraphItemConstructor(year, month, sliceDataMonthly));
      } else if (year === currentYearMonth[0] && month <= currentYearMonth[1]) {
        lineChartData.push(lineGraphItemConstructor(year, month, sliceDataMonthly));
      } else if (year !== currentYearMonth[0] && year !== earliestYearMonthData[0]) {
        lineChartData.push(lineGraphItemConstructor(year, month, sliceDataMonthly));
      }
    }
  }
  return lineChartData;
};

var formatBarChartData = function(filteredData) {
  var sliceDataByCategoryOrMerchant = {};
  for (var i = 0; i < filteredData.length; i++) {
    if (filteredData[i].price > 0) {
      var itemLabel = filteredData[i].secondaryLabel;
      if (itemLabel === null) {
        itemLabel = 'Other';
      }
      if (!sliceDataByCategoryOrMerchant[itemLabel]) {
        sliceDataByCategoryOrMerchant[itemLabel] = filteredData[i].price;
      } else {
        sliceDataByCategoryOrMerchant[itemLabel] += filteredData[i].price;
      }
    }
  }
  barChartAll = [];
  for (var key in sliceDataByCategoryOrMerchant) {
    var barChartItem = {};
    barChartItem['categoryOrMerchantName'] = key;
    barChartItem['price'] = sliceDataByCategoryOrMerchant[key].toFixed(2);
    barChartAll.push(barChartItem);
  }
  barChartAll.sort(function(a, b) {
    return b.price - a.price;
  });
  barChartData = [];
  var barChartOther = {
    categoryOrMerchantName: 'All Others',
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

module.exports.formatLineChartData = formatLineChartData;
module.exports.formatBarChartData = formatBarChartData;
