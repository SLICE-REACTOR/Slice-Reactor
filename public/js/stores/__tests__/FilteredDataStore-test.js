jest.dontMock('../FilteredDataStore');
jest.dontMock('react/lib/merge');

describe('FilteredDataStore', function() {
  var Constants = require('../../constants/Constants');

  // values used in mock payloads
  var categoryName = ['category name 1','category name 2','category name 3'];
  var merchantName = ['merchant name 1','merchant name 2','merchant name 3'];
  var date = ['2013-01-01','2014-01-01','2015-01-01'];
  var price = [50, 100, 300];


  // mock actions inside dispatch payloads
  var allChartDataPayload = {
    source: 'SERVER_ACTION',
    action: {
      type: Constants.ActionTypes.RECEIVE_CHART_DATA,
      allChartData: [
      {
        categoryName: categoryName[0],
        Order: {Merchant: {name: merchantName[0]}},
        price: price[0],
        purchaseDate: date[0]
      },
      {
        categoryName: categoryName[1],
        Order: {Merchant: {name: merchantName[1]}},
        price: price[1],
        purchaseDate: date[1]
      },
      {
        categoryName: categoryName[2],
        Order: {Merchant: {name: merchantName[2]}},
        price: price[2],
        purchaseDate: date[2]
      }]
    }
  };

  var filterByMerchantPayload = {
    source: 'VIEW_ACTION',
    action: {
      type: Constants.ActionTypes.FILTER_DATA,
      filter: 'merchant'
    }
  };

  var filterByCategoryPayload = {
    source: 'VIEW_ACTION',
    action: {
      type: Constants.ActionTypes.FILTER_DATA,
      filter: 'category'
    }
  };

  // selected date range to eliminate
  var filterByDatePayload = {
    source: 'VIEW_ACTION',
    action: {
      type: Constants.ActionTypes.FILTER_BY_DATE,
      dates: {
        minDate: '2013-06-01',
        maxDate: '2014-06-01'
      }
    }
  }

  var AppDispatcher;
  var FilteredDataStore;
  var callback;

  beforeEach(function() {
    AppDispatcher = require('../../dispatcher/Dispatcher');
    FilteredDataStore = require('../FilteredDataStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('intializes with no graph data', function() {
    var graphData = FilteredDataStore.getData();
    expect(graphData).toEqual([]);
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

  it('gets filter values', function() {
    var keys = Object.keys(FilteredDataStore.getFilterValue());
    expect(keys).toContain('maxDate');
    expect(keys).toContain('minDate');
    expect(keys).toContain('primary');
    expect(keys).toContain('secondary');
  });

  it('receives all chart data', function() {
    callback(allChartDataPayload);
    var chartData = FilteredDataStore.getData();
    expect(chartData[0]).toEqual({
      primaryLabel: categoryName[0],
      secondaryLabel: merchantName[0],
      price: price[0] / 100,
      date: date[0]
    });
  });

  it('toggles filter values to merchant', function() {
    callback(filterByMerchantPayload);
    var filterValues = FilteredDataStore.getFilterValue();
    expect(filterValues.primary).toBe('Merchant');
    expect(filterValues.secondary).toBe('Categories');
    expect(filterValues.category).toBe('');
    expect(filterValues.merchant).toBe('active');
  });

  it('toggles filter values to category', function() {
    callback(filterByMerchantPayload);
    callback(filterByCategoryPayload);
    var filterValues = FilteredDataStore.getFilterValue();
    expect(filterValues.primary).toBe('Category');
    expect(filterValues.secondary).toBe('Merchants');
    expect(filterValues.category).toBe('active');
    expect(filterValues.merchant).toBe('');
  });

  it('returns filtered values', function() {
    callback(allChartDataPayload);
    callback(filterByMerchantPayload);
    var chartData = FilteredDataStore.getData();
    expect(chartData[0]).toEqual({
      primaryLabel: merchantName[0],
      secondaryLabel: categoryName[0],
      price: price[0] / 100,
      date: date[0]
    })
  });

  it('filters by date', function() {
    callback(allChartDataPayload);
    callback(filterByDatePayload);
    var chartData = FilteredDataStore.getData();
    expect(chartData[0].date).toEqual('2014-01-01');
  });

});
