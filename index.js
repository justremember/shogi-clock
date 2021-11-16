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

function renderClockState(clock) {
  function renderAsHMSMs(seconds) {
    var date = new Date(null);
    date.setMilliseconds(seconds * 1000);
    if (seconds >= 3600) {
      return date.toISOString().substr(11, 8);
    }
    if (seconds >= 10) {
      return date.toISOString().substr(14, 5);
    }
    if (seconds > 0) {
      return date.toISOString().substr(17, 6);
    }
    if (seconds === 0) {
      return ''
    }
  }

  var currClock = clockState[clock];
  var init = currClock['initial-time'] ? renderAsHMSMs(currClock['initial-time']) : '';
  var byo = (init ? ' + ' : '') + renderAsHMSMs(currClock['byoyomi']);
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

function updateButtons() {
  for (var which of ['left', 'right']) {
    for (var timeAspect of ['init', 'byo', 'periods']) {
      $('#' + which + '-clock-' + timeAspect).text(renderClockState(which)[timeAspect]);
    }
  }
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
      $('#' + clockState.currTurn + '-clock-notif').text('Time up!');
    }
  }
  clockState.lastTime = currTime;
}

// Main loop
$(function() {
  setInterval(function() {
    if (clockState.started && !clockState.paused) {
      updateClock();
    }
    updateButtons();
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
        $('.settings form .field').addClass('disabled');
      } else {
        updateClock();
      }
      clockState.currTurn = leftOrRight === 'left' ? 'right' : 'left';
    }
  }(which));
}

$('#pause-button').click(function() {
  if (clockState.paused === false) {
    clockState.paused = true;
    $(this).text('Resume');
    if (clockState.started) {
      updateClock();
    }
  } else {
    clockState.paused = false;
    $(this).text('Pause');
    if (clockState.started) {
      clockState.lastTime = new Date().getTime();
    }
  }
});

$('#stop-button').click(function() {
  clockState.started = false;
  clockState.paused = false;
  clockState.left
  $('.settings form .field').removeClass('disabled');
  for (var fieldName of ['initial-time', 'byoyomi', 'num-periods']) {
    updateState(fieldName, $('input[name=' + fieldName + ']').val())
    $('#left-clock-notif').text('');
    $('#right-clock-notif').text('');
  }
});

$('.settings form')
  .form({
    on: 'blur',
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
