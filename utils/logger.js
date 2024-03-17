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
  // Specify the custom log levels
  levels,
  // Define the format of log messages
  format: winston.format.combine(
    // Include timestamp in log messages
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    // Include stack trace for errors if available
    winston.format.errors({ stack: true }),
    // Include arguments passed to the logger
    winston.format.splat(),
    // Convert log messages to a readable format
    winston.format.printf((info) => {
      let message = `${info.timestamp} [${info.level}]: ${info.message}`;
      message = info.stack ? `${message}\nStack: ${info.stack}` : message;
      return message;
    })
  ),
  // Define where to log the messages (transports)
  transports: [
    // Console transport for logging to the console
    new winston.transports.Console({
      level: "debug", // Log everything to console during development
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // File transport for error logs
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error", // Log only errors
      format: winston.format.json(), // Use JSON format for file logging
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: path.join(logDir, "all.log"),
      level: "info", // Log info and above (includes warn and error)
      format: winston.format.json(), // Use JSON format for file logging
    }),
  ],
});

// If we're not in production then log to the console with the format:
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
