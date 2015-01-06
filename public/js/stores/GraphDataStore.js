var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _graphData = [];
var _categoryGraphData = [];
var _merchantGraphData = [];

var _filteredGraphData = [];

function _addGraphData(graphData) {
  _graphData = graphData;
  _filterByCategory();
  _filterByMerchant();
};

function _filterByCategory() {
  // filter logic goes here
  // _categoryGraphData = graphData.filter
};

function _filterByMerchant() {
  // filter logic goes here
  // _categoryGraphMerchant = graphData.filter
};

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
    // TODO change to filteredGraphData after filtering is complete
    return _graphData;
  }
});

GraphDataStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECEIVE_GRAPH_DATA:
      _addGraphData(action.allGraphData);
      GraphDataStore.emitChange();
      break;

    case ActionTypes.FILTER_DATA:
      _switchToCategoryOrMerchant(action.filter);
      GraphDataStore.emitChange();
      break;

    default:
      // do nothing
  }
});

module.exports = GraphDataStore;
