jest.dontMock('../LineChartStore');
jest.dontMock('react/lib/merge');

describe('LineChartStore', function() {
  var Constants = require('../../constants/Constants');

  var AppDispatcher;
  var LineChartStore;
  var callback;

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/Dispatcher');
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
});

