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
const MongoStore = require("connect-mongo");
const session = require("express-session");

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

app.use(
  session({
    secret: process.env.SESSION_SECRET, // A secret key for signing the session ID cookie
    resave: false, // Don't save session if unmodified
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI_DEV }), // Use MongoDB to store session
    cookie: { secure: process.env.NODE_ENV === "production" }, // Enable secure cookies in production
  })
);
// Use helmet to set various HTTP headers for security
app.use(helmet());
// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

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

app.use(express.static("public")); // For serving static files from 'public' directory

// Define Routes
app.use("/api/publishers", require("./routes/publisherRoutes"));
app.use("/api/advertisers", require("./routes/advertiserRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/campaigns", require("./routes/campaignRoutes"));
app.use("/api/ads", require("./routes/adRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).send("Server Error");
});

const PORT = process.env.PORT || 8000;

// Initialize Swagger Docs
swaggerDocs(app, PORT);

app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));
