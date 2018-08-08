'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const eventSchema = new Schema({
  owner: {
    type: ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['poker', 'fifa', 'racketgames', 'golf', 'football', 'other']
    // required: true
  },
  location: {
    type: String
  },
  date: {
    type: Date
  },
  details: {
    type: String
  },
  applications: [{
    owner: {
      type: [ObjectId],
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['accepted', 'rejected', 'pending'],
      default: 'pending'
    }
  }]
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
