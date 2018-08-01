const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const Mongoose = require('mongoose');

// ----- GET events-list page ----- \\

router.get('/', (req, res, next) => {
  Event.find()
    .populate('applications.application')
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});
router.post('/', (req, res, next) => {
  if (!req.body.name) {
    res.status(422).json({ code: 'incorrect-params' });
  }
  const data = {
    name: req.body.name,
    details: req.body.details,
    category: req.body.category,
    owner: req.body.owner,
    applications: req.body.applications
  };
  const newEvent = new Event(data);
  newEvent.save()
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

// ----- GET one event page ----- \\

router.get('/:id', (req, res, next) => {
  const validId = Mongoose.Types.ObjectId.isValid(req.params.id);
  if (!validId) {
    res.status(404).json({ code: 'not-found' });
    return next();
  }
  Event.findById(req.params.id)
    .populate('applications.application')
    .then((result) => {
      if (!result) {
        return next();
      }
      res.json(result);
      return next();
    })
    .catch(next);
});

// ----- POST one event page and update ----- \\

router.post('/:id', (req, res, next) => {
  const validId = Mongoose.Types.ObjectId.isValid(req.params.id);
  if (!validId) {
    res.status(404).json({ code: 'not-found' });
    return next();
  }
  Event.findByIdAndUpdate(req.params.id)
    .populate('applications.application')
    .then((result) => {
      res.json(result);
      return next();
    })
    .catch(next);
});

module.exports = router;
