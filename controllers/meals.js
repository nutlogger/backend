const express = require('express');
const moment = require('moment');
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
        res.status(200).json({
          isSuccess: true,
          log,
        });
      })
      .catch((error) => {
        res.status(500).json({
          isSuccess: false,
          error,
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
