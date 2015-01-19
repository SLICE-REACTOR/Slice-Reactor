var dateFilters = require('../stores/FilteredDataStore').getFilterValue();

var formatDonutChartData = function(filteredData) {
  var categoryOrMerchantData = {};
  var totalSpent = 0;
  filteredData.forEach(function(item) {
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
    // the chart should display all categories that will take up more than 3%
    if (categoryOrMerchantData[key] / totalSpent * 100 >= 3 && key !== 'Other') {
      var donutChartItem = [key, categoryOrMerchantData[key].toFixed(2)];
      donutChartData.push(donutChartItem);
    } else {
      donutChartAllOthersItem[1] += categoryOrMerchantData[key];
      donutChartDataOthers.push([key, categoryOrMerchantData[key].toFixed(2)])
    }
  }
  // sort the array of categories from largest to smallest to set donut chart order
  donutChartData.sort(function(a, b) {
    return b[1] - a[1];
  });
  if (donutChartData.length < 8) {
    // sort the array of Other categories from smallest to largest so that largest can be popped off
    donutChartDataOthers.sort(function(a, b) {
      return a[1] - b[1];
    });
    while (donutChartData.length < 8 && donutChartDataOthers.length > 0) {
      if (donutChartDataOthers[donutChartDataOthers.length - 1][0] === "Other") {
        if (donutChartDataOthers.length > 1) {
          // if the largest category is Other then move the second largest category if it will be more than 1.5% of the chart
          if (donutChartDataOthers[donutChartDataOthers.length - 2][1] / totalSpent * 100 >= 1.5) {
            donutChartAllOthersItem[1] -= donutChartDataOthers[donutChartDataOthers.length - 2][1];
            var OtherTemp = donutChartDataOthers.pop();
            donutChartData.push(donutChartDataOthers.pop());
            donutChartDataOthers.push(OtherTemp);
          } else {
            break;
          }
        } else {
          break;
        }
      } else {
        // move the largest category out of All Others if there are fewer than 8 categories and it's larger than 1.5% of chart
        if (donutChartDataOthers[donutChartDataOthers.length - 1][1] / totalSpent * 100 >= 1.5) {
          donutChartAllOthersItem[1] -= donutChartDataOthers[donutChartDataOthers.length - 1][1];
          donutChartData.push(donutChartDataOthers.pop());
        } else {
          break;
        }
      }
    }
  }
  // add All Others to the the donut chart if it exists so that it takes the last position in the chart
  if (donutChartAllOthersItem[1] > 0) {
    donutChartAllOthersItem[1] = donutChartAllOthersItem[1].toFixed(2);
    donutChartData.push(donutChartAllOthersItem);
  }
  // return the chart data and the data for categories in all others so that a drill down into All Others can be performed
  return [donutChartData, donutChartDataOthers];
};

var lineChartItemConstructor = function(year, month, existingDates) {
  var lineGraphItem = {};
  var monthString = month;
  if (monthString < 10) {
    var monthString = "0" + month;
  }
  var dateKey = year + "-" + monthString + "-01";
    lineGraphItem['date'] = dateKey;
  if (existingDates[dateKey]) {
    lineGraphItem['price'] = existingDates[dateKey].toFixed(2);
  } else {
    lineGraphItem['price'] = 0;
  }
  return lineGraphItem;
};

var formatLineChartData = function(filteredData) {
  var sliceDataMonthly = {};
  var lineChartData = [];
  var minYearMonthDay = dateFilters.minDate.split('-');
  var maxYearMonthDay = dateFilters.maxDate.split('-');
  var minDate = new Date(minYearMonthDay[0], minYearMonthDay[1] - 1, minYearMonthDay[2]);
  var maxDate = new Date(maxYearMonthDay[0], maxYearMonthDay[1] - 1, maxYearMonthDay[2]);
  for (var i = 0; i < filteredData.length; i++) {
    var purchaseDateYearMonthDay = filteredData[i].date.split('-');
    var purchaseDate = new Date(purchaseDateYearMonthDay[0], purchaseDateYearMonthDay[1] - 1, purchaseDateYearMonthDay[2]);
    if (filteredData[i].price > 0) {
      var monthYear = purchaseDateYearMonthDay[0] + '-' + purchaseDateYearMonthDay[1] + '-01';
      // if the purchase date is between the minimum and maximum date
      if (purchaseDate >= minDate && purchaseDate <= maxDate) {
        if (!sliceDataMonthly[monthYear]) {
          sliceDataMonthly[monthYear] = filteredData[i].price;
        }
        else {
          sliceDataMonthly[monthYear] += filteredData[i].price;
        }
      }
    }
  }
  for (var year = parseInt(minYearMonthDay[0]); year <= parseInt(maxYearMonthDay[0]); year++) {
    for (var month = 1; month < 13; month ++) {
      if (minYearMonthDay[0] === maxYearMonthDay[0]) {
        if (month >= parseInt(minYearMonthDay[1]) && month <= parseInt(maxYearMonthDay[1])) {
          lineChartData.push(lineChartItemConstructor(year, month, sliceDataMonthly));
        }
      } else {
        if (year === parseInt(minYearMonthDay[0]) && month >= parseInt(minYearMonthDay[1])) {
          lineChartData.push(lineChartItemConstructor(year, month, sliceDataMonthly));
        } else if (year === parseInt(maxYearMonthDay[0]) && month <= parseInt(maxYearMonthDay[1])) {
          lineChartData.push(lineChartItemConstructor(year, month, sliceDataMonthly));
        } else if (year < parseInt(maxYearMonthDay[0]) && year > parseInt(minYearMonthDay[0])) {
          lineChartData.push(lineChartItemConstructor(year, month, sliceDataMonthly));
        }
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

var filterDonutChartPiece = function(categoryOrMerchantName, filteredData, allOthers){
  //responds to clicks on legend and donut piece filtering data only from specified merchant or category
  var donutPieceData = [];
  if (categoryOrMerchantName === 'All Others'){
    var allOthersData = [];
    allOthers.forEach(function(piece){
      //extracts names from all others array to match dataset from filtered data 
      allOthersData.push(piece[0]);
    });
    filteredData.map(function(item){
      for(var i = 0; i < allOthersData.length; i++){
        if(item.primaryLabel === allOthersData[i]){
          donutPieceData.push(item);
        }
      }
    })
  } else{
    filteredData.map(function(item){
      if(categoryOrMerchantName === item.primaryLabel){
        donutPieceData.push(item);
      }
    });
  }
  return donutPieceData;
};

module.exports.filterDonutChartPiece = filterDonutChartPiece;
module.exports.formatLineChartData = formatLineChartData;
module.exports.formatBarChartData = formatBarChartData;
module.exports.formatDonutChartData = formatDonutChartData;
