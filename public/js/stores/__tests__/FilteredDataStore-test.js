jest.dontMock('../FilteredDataStore');
jest.dontMock('react/lib/merge');

describe('GraphDataStore', function() {

  var Constants = require('../../constants/Constants');

  // mock actions inside dispatch payloads
  var ordersPayload = {
    source: 'SERVER_ACTION',
    action: {
      type: Constants.ActionTypes.RECEIVE_ORDERS,
      allOrders: [{foo: 'foo'}]
    }
  };

  var AppDispatcher;
  var GraphDataStore;
  var callback;

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/Dispatcher');
    FilteredDataStore = require('../FilteredDataStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
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

  it('intializes with no graph data', function() {
    var graphData = GraphDataStore.getData();
    expect(graphData).toEqual({});
  });

  it('receives orders', function() {
    callback(ordersPayload);
    var orders = GraphDataStore.getData();
    expect(orders[0]).toEqual({foo: 'foo'});
  });
});
