const mongodb = require('mongodb');
const axios = require('axios');

const loadMealsCollection = () => mongodb.MongoClient.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
  },
).then(client => client.db(process.env.MONGODB_USER).collection('meals'));

module.exports.decrypt = (text, body) => {
  const data = text.split('\n');
  const result = {
    name: body.name || 'default',
    quantity: body.quantity || 1,
    calories: 0,
    fat: 0,
    saturated: 0,
    trans: 0,
    cholesterol: 0,
    sodium: 0,
    carbohydrate: 0,
    fibre: 0,
    sugars: 0,
    protein: 0,
  };
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].includes('Calories')) {
      result.calories = module.exports.parseNum(data[i]);
    } else if (data[i].includes('Fat') || data[i].includes('Lipides')) {
      result.fat = module.exports.parseNum(data[i]);
    } else if (data[i].includes('Saturated') || data[i].includes('saturés')) {
      result.saturated = module.exports.parseNum(data[i]);
    } else if (data[i].includes('Trans') || data[i].includes('trans')) {
      result.trans = module.exports.parseNum(data[i]);
    } else if (data[i].includes('Cholesterol') || data[i].includes('Cholestérol')) {
      result.cholesterol = module.exports.parseNum(data[i]);
    } else if (data[i].includes('Sodium')) {
      result.sodium = module.exports.parseNum(data[i]);
    } else if (data[i].includes('Carbohydrate') || data[i].includes('Glucides')) {
      result.carbohydrate = module.exports.parseNum(data[i]);
    } else if (data[i].includes('Fibre') || data[i].includes('Fibres')) {
      result.fibre = module.exports.parseNum(data[i]);
    } else if (data[i].includes('Sugars') || data[i].includes('Sucre')) {
      result.sugars = module.exports.parseNum(data[i]);
    } else if (data[i].includes('Protein') || data[i].includes('Protéines')) {
      result.protein = module.exports.parseNum(data[i]);
    }
  }
  return result;
};

module.exports.parseNum = (text) => {
  let parse = '';
  for (let i = 0; i < text.length; i += 1) {
    if ('0123456789'.indexOf(text[i]) !== -1) {
      parse += text[i];
    }
  }
  let number = 0;
  try {
    number = parseInt(parse, 10);
  } catch (err) {
    number = 0;
  }
  return number;
};


module.exports.find = (start, end) => loadMealsCollection()
  .then(meals => meals.find({
    createdAt: {
      $gte: start,
      $lt: end,
    },
  }).toArray().then(query => query));

module.exports.findOne = id => loadMealsCollection()
  .then(meals => meals.find({
    _id: mongodb.ObjectId(id),
  }).toArray().then(query => query[0]));

module.exports.insertOne = () => loadMealsCollection()
  .then(meals => meals.insertOne({
    meals: [],
    createdAt: new Date(),
  }).then(response => response.ops[0]));

module.exports.findOneAndUpdate = req => loadMealsCollection()
  .then(meals => meals.findOneAndUpdate({
    _id: mongodb.ObjectId(req.body.id),
  }, {
    $set: {
      meals: { [`meals.${req.body.position}`]: req.body.meal },
    },
  }, {
    returnOriginal: false,
  })
    .then(response => response.value)
    .catch(error => error));

module.exports.insertMeal = req => loadMealsCollection()
  .then(meals => axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_CLOUD_API}`, {
    requests: [
      {
        image: {
          content: req.body.content,
        },
        features: [
          {
            type: 'TEXT_DETECTION',
          },
        ],
      },
    ],
  }).then((gcp) => {
    console.log(gcp.data.responses[0]);
    const results = module.exports
      .decrypt(gcp.data.responses[0].textAnnotations[0].description, req.body);
    console.log(results);
    return meals.findOneAndUpdate({
      _id: mongodb.ObjectId(req.body.id),
    }, {
      $push: {
        meals: results,
      },
    }, {
      returnOriginal: false,
    })
      .then(response => response.value)
      .catch(error => error);
  }).catch((error) => {
    console.log(error.error);
    return error.data;
  }));
