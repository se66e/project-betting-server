'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  owner: String,
  name: {
    type: String,
    required: true
  },
  category: {
    enum: ['poker', 'fifa', 'racketgames', 'golf', 'football', 'other']
  },
  details: {
    location: String,
    date: Date,
    details: String
  },
  applications: [
    {
      application: {
        type: Schema.Types.ObjectId,
        enum: ['rejected', 'accepted', 'pending']
      }
    }
  ]
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
