
const winston = require('winston');

const log = winston.createLogger({
  format: winston.format.combine(winston.format.splat(), winston.format.cli()),
  transports: [
    new (winston.transports.Console)({
      handleExceptions: true,
      humanReadableUnhandledException: true,
    }),
  ],
});


export default log;
