jest.dontMock('../GraphDataStore');
jest.dontMock('react/lib/merge');

describe('GraphDataStore', function() {

  var Constants = require('../../constants/Constants');

  // mock actions inside dispatch payloads
  var actionOrdersCreate = {
    source: 'SERVER_ACTION',
    action: {
      actionType: Constants.RECEIVE_ORDERS,
      allOrders: 'foo'
    }
  };

  // var actionTodoCreate = {
  //   source: 'VIEW_ACTION',
  //   action: {
  //     actionType: TodoConstants.TODO_CREATE,
  //     text: 'foo'
  //   }
  // };

  var AppDispatcher;
  var GraphDataStore;
  var callback;

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/Dispatcher');
    GraphDataStore = require('../GraphDataStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('intializes with no graph data', function() {
    var graphData = GraphDataStore.getData();
    expect(graphData).toEqual({});
  });

  // it('receives orders', function() {
  //   callback(actionOrdersCreate);
  //   var orders = GraphDataStore.getData();
  //   console.log('orders: ', orders);
  //   expect(orders).toEqual('foo');
  // });

  // ***** EXAMPLES ***** //


  // it('initializes with no to-do items', function() {
  //   var all = TodoStore.getAll();
  //   expect(all).toEqual({});
  // });

  // it('creates a to-do item', function() {
  //   callback(actionTodoCreate);
  //   var all = TodoStore.getAll();
  //   var keys = Object.keys(all);
  //   expect(keys.length).toBe(1);
  //   expect(all[keys[0]].text).toEqual('foo');
  // });

  // it('destroys a to-do item', function() {
  //   callback(actionTodoCreate);
  //   var all = TodoStore.getAll();
  //   var keys = Object.keys(all);
  //   expect(keys.length).toBe(1);
  //   actionTodoDestroy.action.id = keys[0];
  //   callback(actionTodoDestroy);
  //   expect(all[keys[0]]).toBeUndefined();
  // });

});
