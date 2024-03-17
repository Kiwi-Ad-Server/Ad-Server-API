/**
 * advertiserController.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * @copyright (c) 2024
 * All rights reserved
 */

const Advertiser = require("../models/Advertiser");

exports.listAdvertisers = async (req, res) => {
  try {
    const advertisers = await Advertiser.find();
    res.json(advertisers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.createAdvertiser = async (req, res) => {
  const { name, contactEmail } = req.body;
  try {
    let advertiser = new Advertiser({ name, contactEmail });
    await advertiser.save();
    res.json(advertiser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
