import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Custom levels with user level
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
  user: 5,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
  user: 'cyan',
};

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Custom format to mask sensitive data
const maskSensitiveData = winston.format((info) => {
  if (typeof info.message === 'object') {
    if (info.message.password) {
      info.message.password = '[MASKED]';
    }
    if (info.message.token) {
      info.message.token = info.message.token.substring(0, 10) + '...';
    }
    info.message = JSON.stringify(info.message);
  }
  return info;
});

const format = winston.format.combine(
  maskSensitiveData(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
  }),
  new winston.transports.File({
    filename: path.join(logsDir, 'all.log'),
  }),
  new winston.transports.File({
    filename: path.join(logsDir, 'users.log'),
    level: 'user',
  }),
];

// Assign colors to log levels
winston.addColors(colors);

const Logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  format,
  transports,
});

// Add type definitions for the user level
declare module 'winston' {
  interface Logger {
    user: winston.LeveledLogMethod;
  }
}

export default Logger;
