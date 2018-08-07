const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const Mongoose = require('mongoose');

// ----- GET events-list page ----- \\

router.get('/', (req, res, next) => {
  Event.find().populate('owner')
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

// --- GET events of the current user -- //

router.get('/my-events', (req, res, next) => {
  const currentUserId = req.session.currentUser._id;
  Event.find({ owner: currentUserId }).populate('owner')
    .then((result) => {
      res.json(result);
    });
});
// ----- Create event-page ----- \\

router.post('/', (req, res, next) => {
  if (!req.body.name) {
    res.status(422).json({ code: 'incorrect-params' });
    // return next();
  }
  const data = {
    name: req.body.name,
    details: req.body.details,
    location: req.body.location,
    date: req.body.date,
    category: req.body.category,
    owner: req.session.currentUser._id,
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
  } else {
    Event.findById(req.params.id).populate('applications')
      .then((result) => {
        res.json(result);
      })
      .catch(next);
  }
});

// const data = {
//   event: result,
//   owner: result.owner._id.toString() === req.session.currentUser._id,
//   applicants: !!result.applications.find((user) => user.toString() === req.session.currentUser._id)

// ----- POST one event page and update ----- \\

router.post('/:id/apply', (req, res, next) => {
  if (!req.session.currentUser) {
    res.status(401).json({ code: 'unauthorized' });
    // return next();
  } else {
    const eventId = req.params.id;
    const filter = { _id: eventId };
    const update = { $push: { applications: req.session.currentUser._id } };
    Event.update(filter, update)
      .then((result) => {
        res.json(result);
      })
      .catch(next);
  };
});

module.exports = router;
