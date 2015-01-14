var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var FilteredDataStore = require('./FilteredDataStore');
var chartHelpers = require('../utils/chartHelpers');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

// DATA STORE
var _donutChartData = [];
var _donutPieceData = [];
var _donutAllOthers = [];

var _formatData = function(filteredData) {
  var chartData = chartHelpers.formatDonutChartData(filteredData);
  //gets data from individual catergory or merchant names
  _donutChartData = chartData[0];
  //gets data from catergory or merchant names contained in all others
  _donutAllOthers = chartData[1];
};

function _filterDonutPieceData(categoryNameOrMerchantName, filteredData, allOthersData){
  //clears data set received from donut piece
  _donutPieceData = [];
  //onclick of donut piece filters data set to be re-rendered by bar and line charts
  _donutPieceData = chartHelpers.filterDonutChartPiece(categoryNameOrMerchantName, filteredData, allOthersData);
};

var DonutChartStore = assign({}, EventEmitter.prototype, {
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
    return _donutChartData;
  },
  sendDonutPieceData: function(){
    return _donutPieceData;
  }
});

DonutChartStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECEIVE_CHART_DATA:
      AppDispatcher.waitFor([FilteredDataStore.dispatchToken]);
      var filteredData = FilteredDataStore.getData();
      _formatData(filteredData);
      DonutChartStore.emitChange();
      break;

    case ActionTypes.FILTER_DATA:
      AppDispatcher.waitFor([FilteredDataStore.dispatchToken]);
      var filteredData = FilteredDataStore.getData();
      _formatData(filteredData);
      DonutChartStore.emitChange();
      break;

    case ActionTypes.FILTER_BY_DATE:
      AppDispatcher.waitFor([FilteredDataStore.dispatchToken]);
      var filteredData = FilteredDataStore.getData();
      _formatData(filteredData);
      DonutChartStore.emitChange();
      break;

    case ActionTypes.FILTER_DONUT_PIECE_DATA:
      var allOthersData = _donutAllOthers;
      var filteredData = FilteredDataStore.getData();
      _filterDonutPieceData(action.filterChart, filteredData, allOthersData);
      DonutChartStore.emitChange();
      break;

    default:
      // do nothing
  }
});

module.exports = DonutChartStore;
