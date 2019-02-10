const mongodb = require('mongodb');

const loadMealsCollection = () => mongodb.MongoClient.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
  },
).then(client => client.db(process.env.MONGODB_USER).collection('meals'));

module.exports.find = (start, end) => loadMealsCollection()
  .then(meals => meals.find({
    createdAt: {
      $gte: start,
      $lt: end,
    },
  }).toArray().then(query => query));

module.exports.insertOne = () => loadMealsCollection()
  .then(meals => meals.insertOne({
    meals: [],
    createdAt: new Date(),
  }).then(response => response.ops[0]));

module.exports.insertMeal = req => loadMealsCollection()
  .then(meals => meals.findOneAndUpdate({
    _id: mongodb.ObjectId(req.body.id),
  }, {
    $push: {
      meals: {
        calories: req.body.meal.calories || 0,
        fats: req.body.meal.fats || 0,
        cholesterol: req.body.meal.cholesterol || 0,
      },
    },
  }, {
    returnOriginal: false,
  }).then(response => response.value));
/*
.then(meals => meals.findOneAndUpdate({
  _id: req.body.id,
}, {
  $set: {
    createdAt: moment().format(),
  },
}, {
  returnOriginal: false,
})
  .then(response => response));
  */
