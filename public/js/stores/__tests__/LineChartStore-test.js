jest.dontMock('../LineChartStore');
jest.dontMock('react/lib/merge');

describe('LineChartStore', function() {
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

  var AppDispatcher;
  var LineChartStore;
  var callback;

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/Dispatcher');
    FilteredDataStore = require('../FilteredDataStore');
    LineChartStore = require('../LineChartStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('contains emitChange function', function() {
    expect(typeof LineChartStore.emitChange).toEqual('function');
  });

  it('contains addChangeListener function', function() {
    expect(typeof LineChartStore.addChangeListener).toEqual('function');
  });

  it('contains removeChangeListener function', function() {
    expect(typeof LineChartStore.removeChangeListener).toEqual('function');
  });

  it('contains getData function', function() {
    expect(typeof LineChartStore.getData).toEqual('function');
  });

  it('intializes with no graph data', function() {
    var graphData = LineChartStore.getData();
    expect(graphData).toEqual([]);
  });
});

