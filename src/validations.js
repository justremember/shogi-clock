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
