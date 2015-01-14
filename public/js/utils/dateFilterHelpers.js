var getToday = function() {
  var _today = {};
  _today.year = new Date().getFullYear();
  _today.month = new Date().getMonth() + 1;
  _today.day = new Date().getDate();
  _today.array = [_today.year, _today.month, _today.day];
  _today.string = _today.array.map(function(item) {
    var itemString = String(item);
    if (itemString.length === 1) {
      return ('0').concat(itemString);
    }
    return itemString;
  }).join('-');
  return _today.string;
};

module.exports.getToday = getToday;

