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
