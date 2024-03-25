/**
 * placementController.js
 *
 * @author Nestor Nathingo <nessynathingo@gmail.com>
 * © 2024 All rights reserved
 */

const Placement = require('../models/Placement');

exports.createPlacement = async (req, res) => {
  const { campaign, zone, startDate, endDate } = req.body;
  try {
    const newPlacement = new Placement({ campaign, zone, startDate, endDate });
    const placement = await newPlacement.save();
    res.json(placement);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.getPlacements = async (req, res) => {
  try {
    const placements = await Placement.find().populate('campaign').populate('zone');
    res.json(placements);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.updatePlacement = async (req, res) => {
  const { startDate, endDate, status } = req.body;
  try {
    let placement = await Placement.findById(req.params.id);
    if (!placement) return res.status(404).json({ msg: 'Placement not found' });

    placement = await Placement.findByIdAndUpdate(req.params.id, { $set: { startDate, endDate, status } }, { new: true });
    res.json(placement);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.deletePlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);
    if (!placement) return res.status(404).json({ msg: 'Placement not found' });

    await Placement.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Placement removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
