const mongoose = require('mongoose');
const moment = require('moment');

const MealSchema = new mongoose.Schema({
  _someId: mongoose.Schema.Types.ObjectId,
  items: [{
    name: {
      type: String,
    },
    stuff: {
      type: String,
      lowercase: true,
      trim: true,
    },
  }],
  updated: {
    type: String,
    default: moment().format(),
  },
});

const MealModel = mongoose.model('meal', MealSchema);

module.exports = MealModel;
