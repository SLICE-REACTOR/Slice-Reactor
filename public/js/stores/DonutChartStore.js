var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var FilteredDataStore = require('./FilteredDataStore');
var chartHelpers = require('../utils/chartHelpers');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

// DATA STORES
var _donutChartData = [];
var _donutPieceData = [];
var _donutAllOthers = [];
var currentDisplayState = 'none';
var previousName;

// formats the data from the FIlteredDataStore for the donut chart
var _formatData = function(filteredData) {
  var chartData = chartHelpers.formatDonutChartData(filteredData);
  //gets data from individual catergory or merchant names
  _donutChartData = chartData[0];
  //gets data from catergory or merchant names contained in all others
  _donutAllOthers = chartData[1];
};

var _filterDonutPieceData = function(categoryNameOrMerchantName, filteredData, allOthersData){
  //clears data set received from donut piece
  _donutPieceData = [];
  //closes drill down if category or merchant name is already selected 
  if(previousName === categoryNameOrMerchantName){
    currentDisplayState = 'none'
    //sends original filtered data to for re-rendering by bar and line charts
    _donutPieceData = filteredData;
    previousName = '';
  }else{
    //onclick of donut piece filters data set to be re-rendered by bar and line charts
    currentDisplayState = 'inline-block';
    _donutPieceData = chartHelpers.filterDonutChartPiece(categoryNameOrMerchantName, filteredData, allOthersData);
    previousName = categoryNameOrMerchantName;
  }
};

var _showDisplay = function(){
  return currentDisplayState;
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
  },
  donutPieceNameDisplay: function(){
    return currentDisplayState;
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
      var allOthersData = _donutAllOthers;
      var filteredData = FilteredDataStore.getData();
      _filterDonutPieceData(action.filterChart, filteredData, allOthersData);
      _showDisplay();
      DonutChartStore.emitChange();
      break;

    case ActionTypes.FILTER_BY_DATE:
      AppDispatcher.waitFor([FilteredDataStore.dispatchToken]);
      var filteredData = FilteredDataStore.getData();
      _formatData(filteredData);
      DonutChartStore.emitChange();
      break;

    // do nothing by default
    default:
  }
});

module.exports = DonutChartStore;
