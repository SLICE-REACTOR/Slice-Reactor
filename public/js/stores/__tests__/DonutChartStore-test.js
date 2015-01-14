jest.dontMock('../DonutChartStore');
jest.dontMock('react/lib/merge');

describe('DonutChartStore', function() {
  var Constants = require('../../constants/Constants');

  var AppDispatcher;
  var DonutChartStore;
  var callback;

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/Dispatcher');
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
});

