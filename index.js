(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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


},{"./clockEncode":1}],3:[function(require,module,exports){
// Stores the app state and all state changes to be processed in the next iteration of main loop
module.exports = {
  started: false,
  paused: false,
  lastTime: new Date().getTime(),
  currTurn: 'left',
  left: {
    'initial-time': 0,
    'set-byoyomi': 60,
    'byoyomi': 60,
    'num-periods': 5,
  },
  right: {
    'initial-time': 0,
    'set-byoyomi': 60,
    'byoyomi': 60,
    'num-periods': 5,
  },

  changedStateKeys: new Set(),

  set: function(key, val) {
    var keyParts = key.split('.');
    var obj = this;
    for (var k of keyParts.slice(0, keyParts.length - 1)) {
      obj = obj[k];
    }
    obj[keyParts[keyParts.length - 1]] = val;
    this.changedStateKeys.add(key);
  },

  popStateChanges: function() {
    var changedStateKeys = this.changedStateKeys;
    this.changedStateKeys = [];
    return changedStateKeys;
  }
}

},{}],4:[function(require,module,exports){
var clockRender = require('./clockRender');
var clockState = require('./clockState');
var validations = require('./validations');


function updateState(fieldName, val) {
  var num = parseInt(val);
  if (!isNaN(num) && num < 86400) {
    clockState.set('left.' + fieldName, num);
    clockState.set('right.' + fieldName, num);
    if (fieldName === 'byoyomi') {
      clockState.set('left.set-byoyomi', num);
      clockState.set('right.set-byoyomi', num);
    }
  }
}

function updateStateAfterFormChange(fieldName) {
  return function() {
    updateState(fieldName, $(this).val());
  }
}

function updateClock() {
  var currClock = clockState[clockState.currTurn];
  var currTime = new Date().getTime();
  var timeToSubtract = (currTime - clockState.lastTime) / 1000;
  if (currClock['initial-time']) {
    currClock['initial-time'] -= timeToSubtract;
    if (currClock['initial-time'] <= 0) {
      timeToSubtract = -1 * currClock['initial-time'];
      currClock['initial-time'] = 0;
    } else timeToSubtract = 0;
  }
  if (timeToSubtract && currClock['byoyomi']) {
    currClock['byoyomi'] -= timeToSubtract;
    if (currClock['byoyomi'] <= 0) {
      timeToSubtract = -1 * currClock['byoyomi'];
      currClock['byoyomi'] = 0;
    } else timeToSubtract = 0;
  }
  if (timeToSubtract && currClock['num-periods']) {
    currClock['num-periods'] -= 1;
    if (currClock['num-periods'] > 0) {
      currClock['byoyomi'] = currClock['set-byoyomi'] - timeToSubtract;
    } else {
      // stop time
      clockState.started = false;
      clockRender.timeUp(clockState.currTurn);
    }
  }
  clockState.set('lastTime', currTime);
}

// Main loop
$(function() {
  validations();
  setInterval(function() {
    if (clockState.started && !clockState.paused) {
      updateClock();
    }
    clockRender.render(clockState);
  }, 1000/60);
});

// Events

for (var fieldName of ['initial-time', 'byoyomi', 'num-periods']) {
  $('input[name=' + fieldName + ']').on('input', updateStateAfterFormChange(fieldName));
}

for (var which of ['left', 'right']) {
  $('#' + which + '-clock').click(function(leftOrRight) {
    return function() {
      if (!clockState.started) {
        clockState.set('lastTime', new Date().getTime());
        clockState.set('started', true);
        clockRender.disableFormFields();
      } else if (!clockState.paused) {
        updateClock();
      }
      clockState.set(leftOrRight + '.byoyomi', clockState[leftOrRight]['set-byoyomi']);
      clockState.set('currTurn', leftOrRight === 'left' ? 'right' : 'left');
    }
  }(which));
}

$('#pause-button').click(function() {
  if (clockState.paused === false) {
    clockState.set('paused', true);
    clockRender.pause();
    if (clockState.started) {
      updateClock();
    }
  } else {
    clockState.set('paused', false);
    clockRender.resume();
    if (clockState.started) {
      clockState.set('lastTime', new Date().getTime());
    }
  }
});

$('#stop-button').click(function() {
  clockState.set('started', false);
  clockState.set('paused', false);
  clockRender.resume();
  clockRender.enableFormFields();
  for (var fieldName of ['initial-time', 'byoyomi', 'num-periods']) {
    updateState(fieldName, $('input[name=' + fieldName + ']').val())
    clockRender.clearNotifs();
  }
});

},{"./clockRender":2,"./clockState":3,"./validations":5}],5:[function(require,module,exports){
module.exports = function() {
  $('.settings form')
    .form({
      on: 'change',
      fields: {
        initialTime: {
          identifier  : 'initial-time',
          rules: [
            {
              type   : 'integer[0..86399]',
              prompt : 'Please enter a positive value below 86400'
            }
          ]
        },
        byoyomi: {
          identifier  : 'byoyomi',
          rules: [
            {
              type   : 'integer[0..86399]',
              prompt : 'Please enter a positive value below 86400'
            }
          ]
        },
        periods: {
          identifier  : 'num-periods',
          rules: [
            {
              type   : 'integer[0..86399]',
              prompt : 'Please enter a positive value below 86400'
            }
          ]
        },
      }
    })
  ;
};

},{}]},{},[4]);
