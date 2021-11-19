var clockEncode = require('./clockEncode');

exports.render = function(clockState) {
  for (var which of ['left', 'right']) {
    for (var timeAspect of ['init', 'byo', 'periods']) {
      $('#' + which + '-clock-' + timeAspect).text(clockEncode.encodeState(which, clockState)[timeAspect]);
    }
  }
}

exports.timeUpNotif = function(which) {
  $('#' + which + '-clock-notif').text('Time up!');
}

exports.clearNotifs = function() {
  $('#left-clock-notif').text('');
  $('#right-clock-notif').text('');
}

exports.pause = function(text) {
  $('#pause-button').text('Resume');
}

exports.resume = function(text) {
  $('#pause-button').text('Pause');
}

exports.enableFormFields = function() {
  $('.settings form .field').removeClass('disabled');
}

exports.disableFormFields = function() {
  $('.settings form .field').addClass('disabled');
}

