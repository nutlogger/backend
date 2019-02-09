const express = require('express');
const meals = require('../services/meals');

const router = express.Router();

router.get('/', (req, res) => {
  meals.find()
    .then((response) => {
      res.status(200).json({
        isSuccess: true,
        log: response,
      });
    })
    .catch((error) => {
      res.status(500).json({
        isSuccess: false,
        error,
      });
    });
});

router.post('/', async (req, res) => {
  meals.insertOne().then((response) => {
    res.status(200).json({
      isSuccess: true,
      id: response._id,
    });
  });
});

router.put('/', async (req, res) => {
  if (req.body.id) {
    meals.insertMeal(req).then((response) => {
      res.status(200).json({
        isSuccess: true,
        response,
      });
    });
  } else {
    res.status(402).json({
      isSuccess: false,
      error: 'missing parameters',
    });
  }
});


module.exports = router;
