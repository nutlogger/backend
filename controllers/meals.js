const express = require('express');
const moment = require('moment');
const _ = require('lodash');
const meals = require('../services/meals');

const router = express.Router();

router.get('/', (req, res) => {
  let start = moment().startOf('day').toDate();
  let end = moment().endOf('day').toDate();
  if (req.query.start && req.query.end) {
    start = moment(req.query.start).startOf('day').toDate();
    end = moment(req.query.end).endOf('day').toDate();
  }
  meals.find(start, end)
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
    meals.insertMeal(req)
      .then((log) => {
        const total = {
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
        _.forEach(log.meals, (meal) => {
          total.calories += meal.calories * meal.quantity;
          total.fat += meal.fat * meal.quantity;
          total.saturated += meal.saturated * meal.quantity;
          total.trans += meal.trans * meal.quantity;
          total.cholesterol += meal.cholesterol * meal.quantity;
          total.sodium += meal.sodium * meal.quantity;
          total.carbohydrate += meal.carbohydrate * meal.quantity;
          total.fibre += meal.fibre * meal.quantity;
          total.protein += meal.protein * meal.quantity;
        });
        res.status(200).json({
          isSuccess: true,
          log: {
            id: log._id,
            total,
            meals: log.meals,
            createdAt: log.createdAt,
          },
        });
      })
      .catch((error) => {
        res.status(500).json({
          isSuccess: false,
          error,
        });
      });
  } else {
    res.status(400).json({
      isSuccess: false,
      error: 'missing parameters',
    });
  }
});

module.exports = router;
