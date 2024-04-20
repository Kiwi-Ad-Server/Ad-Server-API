/**
 * db.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const mongoose = require("mongoose");
const logger = require("../utils/logger");
require("dotenv").config();

const connectDB = async () => {
  const dbURI = process.env.MONGODB_URI;

  //Add a separate URI for a test database
  const dbURIDev = process.env.MONGODB_URI_DEV;

  // Use different database URIs based on the environment
  const effectiveURI = process.env.NODE_ENV === "dev" ? dbURIDev : dbURI;

  try {
    await mongoose.connect(effectiveURI, {
      dbName: `Kiwi_DB`,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
