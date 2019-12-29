const moment = require('../generator/node_modules/moment');
module.exports = {
    server: '', //ex: https://cloud.DOMAIN.TLD
    username: '',
    password: '',
    calendars: {
      'Personal' :{
        start: moment().startOf('day').format(),
        end: moment().endOf('day').add(52, 'weeks').format()
      }
    },
    debug:false
}
