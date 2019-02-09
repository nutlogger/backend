const mongodb = require('mongodb');
const moment = require('moment');

const loadMealsCollection = () => mongodb.MongoClient.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
  },
).then(client => client.db(process.env.MONGODB_USER).collection('meals'));

module.exports.find = () => loadMealsCollection()
  .then(meals => meals.find({}).toArray().then(query => query));

module.exports.insertOne = () => loadMealsCollection()
  .then(meals => meals.insertOne({ meals: [] }).then(response => response.ops[0]));

/*

router.patch('/:id', async (req, res) => {
  const channels = await loadChannelsCollection();
  if(req.params.id && (req.body.track || req.body.listeners)){
    req.body.updatedAt = new Date();
    await channels.findOneAndUpdate({
      _id: req.params.id,
    }, {
      $set: req.body,
    }, {
      returnOriginal: false
    },(err, response) => {
      if(err){
        console.log(err);
      }else{
        ioClient.emit('propagate', response.value);
      }
    });
    res.status(200).send();
  }else{
    res.status(400).send();
  }
});
 */


module.exports.insertMeal = req => loadMealsCollection()
  .then(meals => meals.findOneAndUpdate({
    _id: mongodb.ObjectId(req.body.id),
  }, {
    $set: {
      createdAt: moment().format(),
    },
    $push: {
      meals: {
        calories: req.body.meal.calories || 0,
        fats: req.body.meal.fats || 0,
        cholesterol: req.body.meal.cholesterol || 0,
      },
    },
  }, {
    returnOriginal: false,
  }).then((response) => {
    console.log(response);
  }));
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
