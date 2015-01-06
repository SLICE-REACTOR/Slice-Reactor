var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _graphData = [];
var _filteredGraphData = [];

var _categoryGraphData = [];
var _merchantGraphData = [];

function _addGraphData(graphData) {
  _graphData = graphData;
};

// function _addOrders(allOrders) {
//   _graphData = allOrders;
// };

function _switchToCategoryOrMerchant(categoryOrMerchant) {
  if (categoryOrMerchant === 'merchant') {
    _filteredGraphData = _merchantGraphData;
  } else {
    _filteredGraphData = _categoryGraphData;
  }
};

var GraphDataStore = assign({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  getData: function() {
    return _graphData;
  },
  filterByCategoryOrMerchant: function(categoryOrMerchant) {
    _switchToCategoryOrMerchant(categoryOrMerchant);
  }
});

GraphDataStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    // case ActionTypes.RECEIVE_ORDERS:
    //   _addOrders(action.allOrders);
    //   GraphDataStore.emitChange();
    //   break;

    case ActionTypes.RECEIVE_GRAPH_DATA:
      _addGraphData(action.allGraphData);
      GraphDataStore.emitChange();
      break;

    default:
      // do nothing
  }
});

module.exports = GraphDataStore;
