/**
 * logger.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const winston = require("winston");
const path = require("path");

// Define custom log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
};

// Function to determine the log directory based on the environment
const logDir = "logs"; // Example directory for logs

// Create a logger instance
const logger = winston.createLogger({
  levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.printf((info) => {
      let message = `${info.timestamp} [${info.level}]: ${info.message}`;
      message = info.stack ? `${message}\nStack: ${info.stack}` : message;
      return message;
    })
  ),
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error", // Ensures only errors are logged here
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: path.join(logDir, "all.log"),
      level: "info", // Log info and above
      format: winston.format.json(),
    }),
  ],
});

// If not in production, add console log
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
