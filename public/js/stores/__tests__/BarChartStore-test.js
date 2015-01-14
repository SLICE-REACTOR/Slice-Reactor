jest.dontMock('../BarChartStore');
jest.dontMock('react/lib/merge');

describe('BarChartStore', function() {
  var Constants = require('../../constants/Constants');

  var AppDispatcher;
  var BarChartStore;
  var callback;

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/Dispatcher');
    BarChartStore = require('../BarChartStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
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
});
