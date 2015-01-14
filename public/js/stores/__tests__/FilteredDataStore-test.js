jest.dontMock('../FilteredDataStore');
jest.dontMock('react/lib/merge');

describe('FilteredDataStore', function() {
  var Constants = require('../../constants/Constants');

  // mock actions inside dispatch payloads
  var allChartDataPayload = {
    source: 'SERVER_ACTION',
    action: {
      type: Constants.ActionTypes.RECEIVE_CHART_DATA,
      allChartData: [{
        categoryName: 'category name',
        Order: {Merchant: {name: 'merchant name'}},
        price: 100,
        purchaseDate: '2015-01-01'
      }]
    }
  };

  var AppDispatcher;
  var FilteredDataStore;
  var callback;

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/Dispatcher');
    FilteredDataStore = require('../FilteredDataStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('intializes with no graph data', function() {
    var graphData = FilteredDataStore.getData();
    expect(graphData).toEqual([]);
  });

  it('contains emitChange function', function() {
    expect(typeof FilteredDataStore.emitChange).toEqual('function');
  });

  it('contains addChangeListener function', function() {
    expect(typeof FilteredDataStore.addChangeListener).toEqual('function');
  });

  it('contains removeChangeListener function', function() {
    expect(typeof FilteredDataStore.removeChangeListener).toEqual('function');
  });

  it('contains getData function', function() {
    expect(typeof FilteredDataStore.getData).toEqual('function');
  });

  it('receives all chart data', function() {
    callback(allChartDataPayload);
    var chartData = FilteredDataStore.getData();
    console.log('chartData: ', chartData);
    expect(chartData[0]).toEqual({
      primaryLabel: 'category name',
      secondaryLabel: 'merchant name',
      price: 100,
      purchaseDate: '2014-01-01'
    });
  });

});
