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
