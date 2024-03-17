/**
 * app.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @author Selma Auala <selmaauala15@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const swaggerDocs = require("./config/swaggerConfig");
const logger = require("./utils/logger");

const app = express();

// Connect Database
connectDB();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Use helmet to set various HTTP headers for security
app.use(helmet());
// Apply the rate limiting middleware to all requests
app.use(limiter);

// Use cors to enable Cross-Origin Resource Sharing
app.use(
  cors({
    origin: "https://example.com", // Allow only this origin to access the API
    methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
    allowedHeaders: "Content-Type,Authorization", // Allowed headers
  })
);

//Init middleware
// This allows you to accept JSON data in the body of a request
app.use(express.json({ extended: false }));

// Logging middleware for incoming requests
app.use((req, res, next) => {
  logger.http(`HTTP ${req.method} ${req.url}`);
  next();
});

// Define a simple route for a health check
app.get("/", (req, res) => {
  logger.info("API Health Check Route Accessed");
  res.send("API Running");
});

// Define Routes
// Uncomment and adjust according to your actual file paths and route setups
// app.use('/api/auth', require('./routes/authRoutes'));

// If you have more routes, define them similarly
// Example:
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/advertisers", require("./routes/advertiserRoutes"));

// app.use('/api/campaigns', require('./routes/campaignRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).send("Server Error");
});

const PORT = process.env.PORT || 8000;

// Initialize Swagger Docs
swaggerDocs(app, PORT);

app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));
