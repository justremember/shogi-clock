exports.encodeAsHMSMs = function(seconds) {
  var date = new Date(null);
  date.setMilliseconds(seconds * 1000);
  if (seconds >= 3600) {
    return date.toISOString().substr(11, 8);
  }
  if (seconds >= 10) {
    return date.toISOString().substr(14, 5);
  }
  if (seconds > 0) {
    return date.toISOString().substr(18, 4);
  }
  if (seconds === 0) {
    return ''
  }
}

exports.encodeState = function(clock, clockState) {
  var currClock = clockState[clock];
  var init = currClock['initial-time'] ? exports.encodeAsHMSMs(currClock['initial-time']) : '';
  var byo = (init ? ' + ' : '') + exports.encodeAsHMSMs(currClock['byoyomi']);
  var periods = ' x ' + currClock['num-periods'];
  if (currClock['num-periods'] === 1) {
    periods = '(Last period)';
  }
  if (currClock['num-periods'] === 0 || currClock['set-byoyomi'] == 0) {
    periods = '';
    byo = '';
  }
  return {
    init: init,
    byo: byo,
    periods: periods,
  };
}
