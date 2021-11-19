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
}
