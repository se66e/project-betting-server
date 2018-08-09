const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const Mongoose = require('mongoose');

// ----- GET events-list page ----- \\

router.get('/', (req, res, next) => {
  Event.find().populate('owner').populate('applications applications.user')
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
  }
  Event.findById(req.params.id).populate('applications applications.user').populate('owner owner.user')
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

// ----- POST one event page and update ----- \\

router.post('/:id/apply', (req, res, next) => {
  if (!req.session.currentUser) {
    res.status(401).json({ code: 'unauthorized' });
    return next();
  } else {
    const eventId = req.params.id;
    Event.findById(eventId)
      .then((result) => {
        const ownerId = result.owner._id.toString();
        if (ownerId !== req.session.currentUser._id) {
          Event.findByIdAndUpdate(eventId, { $push: { applications: { user: req.session.currentUser._id } } })
            .then(re => {
              res.json(re);
            });
        } else {
          res.status(406).json({ code: 'not-acceptable' });
        }
      })
      .catch(next);
  };
});

router.put('/:id/reject', (req, res, next) => {
  console.log(req.body);
  const appId = req.body.applicationId;
  const eventId = req.params.id;
  Event.update({ '_id': eventId, 'applications.user': appId }, { $set: { 'applications.$.status': 'rejected' } })
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.put('/:id/accept', (req, res, next) => {
  const appId = req.body.applicationId;
  const eventId = req.params.id;
  Event.update({ '_id': eventId, 'applications.user': appId }, { $set: { 'applications.$.status': 'accepted' } })
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

module.exports = router;
