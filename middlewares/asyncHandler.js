import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, errors } = format;

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    printf(({ level, message, timestamp, stack }) => {
      return `${timestamp} [${level}]: ${message} ${stack ? `\n${stack}` : ''}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log' }),
  ],
});

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch((error) => {
      logger.error(error);
      res.status(500).json({ message: 'An internal server error occurred.' });
    })
    .catch((error) => {
      logger.error(error);
      res.status(500).json({ message: 'An unknown error occurred.' });
    });
};

export default asyncHandler;