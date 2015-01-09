var AppDispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');

var ActionTypes = Constants.ActionTypes;

module.exports = {
  filterData: function(categoryOrMerchant) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.FILTER_DATA,
      filter: categoryOrMerchant
    });
  },
  filterByDate: function(dates) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.FILTER_BY_DATE,
      dates: dates
    });
  },
  filterDonutChartData: function(categoryNameOrMerchantName){
    AppDispatcher.handleViewAction({
      type: ActionTypes.FILTER_DONUT_PIECE_DATA,
      filterChart: categoryNameOrMerchantName
    });
  }
};
