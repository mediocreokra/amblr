var winston = require('winston');
var fs = require('fs');

/* Configure the logger */
var logDir = './logs';
var env = process.env.NODE_ENV || 'development';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

var logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: env === 'development' ? 'debug' : 'info',
      filename: logDir + '/logs.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

/* 
stream is used to allow morgan to style console output
in server.js
*/
module.exports = logger;
module.exports.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};
