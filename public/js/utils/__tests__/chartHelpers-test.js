jest.dontMock('../chartHelpers');
jest.dontMock('react/lib/merge');

var helper = require('../chartHelpers');

describe('chartHelpers', function() {
  describe('formatDonutChartData', function() {
    var filteredData = [{primaryLabel: "Electronics", price: 999 / 100},{primaryLabel: "Books", price: 899 / 100},{primaryLabel: "Household", price: 10099 / 100},{primaryLabel: "Payments", price: 399 / 100},{primaryLabel: "Travel", price: 12087 / 100},{primaryLabel: "Electronics", price: 10002 / 100},{primaryLabel: "Other", price: 1499 / 100},{primaryLabel: "Public Transit", price: 299 / 100},{primaryLabel: "Movies", price: 799 / 100},{primaryLabel: "Restaurants", price: 199 / 100},{primaryLabel: "Rent", price: 1299 / 100}];
    var response = helper.formatDonutChartData(filteredData);
    it('returns an array of 2 arrays', function() {
      expect(Array.isArray(response)).toEqual(true);
      expect(Array.isArray(response[0])).toEqual(true);
      expect(Array.isArray(response[1])).toEqual(true);
      expect(response.length).toEqual(2);
    });
    it('first array should have 9 arrays, last is "All Others"', function() {
      expect(response[0].length).toEqual(7);
      expect(response[0][response[0].length - 1][0]).toEqual("All Others");
    });
    it('both arrays are arrays of arrays', function() {
      expect(Array.isArray(response[0][1])).toEqual(true);
      expect(Array.isArray(response[1][0])).toEqual(true);
    });
    it('first array sorted by price (greatest to smallest)', function() {
      expect(response[0][0][0]).toEqual('Travel');
    });
    it('adds prices from items of the same category', function() {
      expect(response[0][1][1]).toEqual('110.01');
    });
    it('Other category should always be part of "All Others"', function() {
      expect(response[1][3][0]).toEqual('Other');
    });
    it('should not include category if it is less than 1.5% of chart', function() {
      expect(response[1][2][0]).toEqual('Payments');
    });
  });

});
