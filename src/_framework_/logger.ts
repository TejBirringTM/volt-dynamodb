import pino from 'pino';

const logger = pino({
  // Format timestamps in ISO format
  timestamp: pino.stdTimeFunctions.isoTime,

  // Pretty print
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

export default logger;
