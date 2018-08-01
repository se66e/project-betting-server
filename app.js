const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const authRouter = require('./routes/auth');
const eventRouter = require('./routes/events');

const app = express();

// ----- Connect to DB ----- \\

// ----- Middlewares ----- \\

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ----- CORS ----- \\
app.use(cors({
  credentials: true,
  origin: ['http://localhost:4200']
}));

// ----- Session ----- \\
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: 'some-string',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// ----- Routes Setup ----- \\

app.use('/', authRouter);
app.use('/events', eventRouter);

// ----- 404 and Error handler ----- \\

app.use((req, res, next) => {
  res.status(404).json({ code: 'not found' });
});

app.use((err, req, res, next) => {
  console.error('ERROR', req.method, req.path, err);
  if (!res.headersSent) {
    res.status(500).json({ code: 'unexpected' });
  }
});

module.exports = app;
