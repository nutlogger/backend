const mongoose = require('mongoose');
const moment = require('moment');
const MealSchema = new mongoose.Schema({
  _someId: Schema.Types.ObjectId,
  items: {
    type: [],
  },
  updated: {
    type: String,
    default: moment
  },
});

const MealModel = mongoose.model('meal', MealSchema);

module.exports = MealModel;
