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

var _formatData = function(filteredData) {
  _donutChartData = chartHelpers.formatDonutChartData(filteredData);
};

function _filterDonutPieceData(categoryNameOrMerchantName, filteredData){
  if(categoryNameOrMerchantName === 'All Others'){
    _donutPieceData = filteredData;
  }else{
    var donutPiece = filteredData.map(function(item){
      if(categoryNameOrMerchantName === item.primaryLabel){
        _donutPieceData.push(item); 
      } 
    });
  }
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
  sendDonutPieceDatatoBar: function(){
    var _donutChartPieceBarData = _donutPieceData;
    _donutPieceData = [];
    return _donutChartPieceBarData;
  },
  sendDonutPieceDatatoLine: function(){
    var _donutChartPieceLineData = _donutPieceData;
    return _donutChartPieceLineData;
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
  
    case ActionTypes.FILTER_DONUT_PIECE_DATA:
      var filteredData = FilteredDataStore.getData();
      _filterDonutPieceData(action.filterChart, filteredData);
      DonutChartStore.emitChange();
      break;

    case ActionTypes.FILTER_BY_DATE:
      AppDispatcher.waitFor([FilteredDataStore.dispatchToken]);
      var filteredData = FilteredDataStore.getData();
      _formatData(filteredData);
      DonutChartStore.emitChange();
      break;

    default:
      // do nothing
  }
});

module.exports = DonutChartStore;
