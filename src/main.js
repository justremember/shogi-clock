var clockRender = require('./clockRender');
var validations = require('./validations');

var clockState = {
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
}

function updateState(fieldName, val) {
    var num = parseInt(val);
    if (!isNaN(num) && num < 86400) {
      clockState.left[fieldName] = num;
      clockState.right[fieldName] = num;
      if (fieldName === 'byoyomi') {
        clockState.left['set-byoyomi'] = num;
        clockState.right['set-byoyomi'] = num;
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
  clockState.lastTime = currTime;
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
        clockState.lastTime = new Date().getTime();
        clockState.started = true;
        clockState.disableFormFields();
      } else if (!clockState.paused) {
        updateClock();
      }
      clockState[leftOrRight]['byoyomi'] = clockState[leftOrRight]['set-byoyomi'];
      clockState.currTurn = leftOrRight === 'left' ? 'right' : 'left';
    }
  }(which));
}

$('#pause-button').click(function() {
  if (clockState.paused === false) {
    clockState.paused = true;
    clockRender.pause();
    if (clockState.started) {
      updateClock();
    }
  } else {
    clockState.paused = false;
    clockRender.resume();
    if (clockState.started) {
      clockState.lastTime = new Date().getTime();
    }
  }
});

$('#stop-button').click(function() {
  clockState.started = false;
  clockState.paused = false;
  clockRender.resume();
  clockRender.enableFormFields();
  for (var fieldName of ['initial-time', 'byoyomi', 'num-periods']) {
    updateState(fieldName, $('input[name=' + fieldName + ']').val())
    clockRender.clearNotifs();
  }
});
