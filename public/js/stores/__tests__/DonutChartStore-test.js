jest.dontMock('../DonutChartStore');
jest.dontMock('react/lib/merge');

describe('DonutChartStore', function() {
  var Constants = require('../../constants/Constants');

  var allChartDataPayload = {
    source: 'SERVER_ACTION',
    action: {
      type: Constants.ActionTypes.RECEIVE_CHART_DATA,
      allChartData: []
    }
  };

  // values used in mock payloads
  var categoryName = ['category name 1','category name 2','category name 3'];
  var merchantName = ['merchant name 1','merchant name 2','merchant name 3'];
  var date = ['2013-01-01','2014-01-01','2015-01-01'];
  var price = [50, 100, 300];

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

  var AppDispatcher;
  var DonutChartStore;
  var callback;

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/Dispatcher');
    FilteredDataStore = require('../FilteredDataStore');
    DonutChartStore = require('../DonutChartStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('contains emitChange function', function() {
    expect(typeof DonutChartStore.emitChange).toEqual('function');
  });

  it('contains addChangeListener function', function() {
    expect(typeof DonutChartStore.addChangeListener).toEqual('function');
  });

  it('contains removeChangeListener function', function() {
    expect(typeof DonutChartStore.removeChangeListener).toEqual('function');
  });

  it('contains getData function', function() {
    expect(typeof DonutChartStore.getData).toEqual('function');
  });

  it('intializes with no graph data', function() {
    var graphData = DonutChartStore.getData();
    expect(graphData).toEqual([]);
  });

  it('gets data from the FilteredDataStore', function() {
    var FilteredDataStore = require('../FilteredDataStore');
    FilteredDataStore.getData.mockReturnValue(filteredData);
  });

});

