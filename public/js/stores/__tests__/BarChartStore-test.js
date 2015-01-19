jest.dontMock('../FilteredDataStore');
jest.dontMock('../BarChartStore');
jest.dontMock('react/lib/merge');

describe('BarChartStore', function() {
  var Constants = require('../../constants/Constants');

  // values used in filtered data
  var categoryName = ['category name 1','category name 2','category name 3'];
  var merchantName = ['merchant name 1','merchant name 2','merchant name 3'];
  var date = ['2013-01-01','2014-01-01','2015-01-01'];
  var price = [50, 100, 300];

  // raw data from Database
  var rawData = [
  {
    categoryName: categoryName[0],
    Order: {Merchant: {name: merchantName[0]}},
    price: price[0],
    purchaseDate: date[0]
  },
  {
    categoryName: categoryName[1],
    Order: {Merchant: {name: merchantName[1]}},
    price: price[1],
    purchaseDate: date[1]
  },
  {
    categoryName: categoryName[2],
    Order: {Merchant: {name: merchantName[2]}},
    price: price[2],
    purchaseDate: date[2]
  }];

  // returned data from FilteredDataStore
  var filteredData = [
    {
      primaryLabel: merchantName[0],
      secondaryLabel: categoryName[0],
      price: price[0] / 100,
      date: date[0]
    },
    {
      primaryLabel: merchantName[1],
      secondaryLabel: categoryName[1],
      price: price[1] / 100,
      date: date[1]
    },
    {
      primaryLabel: merchantName[2],
      secondaryLabel: categoryName[2],
      price: price[2] / 100,
      date: date[2]
    }];

  var allChartDataPayload = {
    source: 'SERVER_ACTION',
    action: {
      type: Constants.ActionTypes.RECEIVE_CHART_DATA,
      allChartData: rawData
    }
  };

  var AppDispatcher;
  var FilteredDataStore;
  var BarChartStore;
  var FilteredDataCallback;
  var BarChartCallback;

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/Dispatcher');
    FilteredDataStore = require('../FilteredDataStore');
    BarChartStore = require('../BarChartStore');
    FilteredDataCallback = AppDispatcher.register.mock.calls[0][0];
    BarChartCallback = AppDispatcher.register.mock.calls[1][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(2);
  });

  it('contains emitChange function', function() {
    expect(typeof BarChartStore.emitChange).toEqual('function');
  });

  it('contains addChangeListener function', function() {
    expect(typeof BarChartStore.addChangeListener).toEqual('function');
  });

  it('contains removeChangeListener function', function() {
    expect(typeof BarChartStore.removeChangeListener).toEqual('function');
  });

  it('contains getData function', function() {
    expect(typeof BarChartStore.getData).toEqual('function');
  });

  it('intializes with no graph data', function() {
    var graphData = BarChartStore.getData();
    expect(graphData).toEqual([]);
  });

  it('gets data from the FilteredDataStore', function() {
    FilteredDataCallback(allChartDataPayload);
    console.log('FilteredDataStore.getData(): ', FilteredDataStore.getData());
    BarChartCallback(allChartDataPayload);
    console.log('BarChartStore.getData(): ', BarChartStore.getData());
  });
});
