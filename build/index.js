const _ = require('lodash');
const express = require('express');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const Sequelize = require('sequelize');
const URL = require('url').URL;

console.log(process.env.DATABASE_SSL);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: { ssl: !!parseInt(process.env.DATABASE_USE_SSL) }
});

const Entry = sequelize.define('entry', {
  email: Sequelize.STRING,
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  score: Sequelize.INTEGER,
  type: Sequelize.STRING,
});

/**
 * Authentication Strategies
 * Google & JWT
 */
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${config.api.host}/auth/google/callback`,
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, next) => {
  next(null, {
    email: profile.email,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
  });
}));

const jwtOptions = {
  secretOrKey: 'secret',
  issuer: 'accounts.examplesoft.com',
  audience: 'yoursite.net',
};

passport.use(new JwtStrategy(Object.assign(jwtOptions, {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeader(),
    ExtractJwt.fromUrlQueryParameter('token'),
  ])
}), (jwtPayload, done) => {
  done(null, jwtPayload);
}));

/**
 * Express server setup
 */
const port = process.env.PORT || 3000;
const app = express();

app.use(require('cors')());
app.use(require('morgan')('combined'));
app.use(require('body-parser').json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

/**
 * Authentication endpoints
 */
app.get('/auth/google', (req, res) => {
  const state = _.isEmpty(req.query.redirect) ? null : req.query.redirect;
  passport.authenticate('google', { scope: ['email', 'profile'], prompt: 'consent select_account' })(req, res);
});

app.get('/auth/google/callback',
  passport.authenticate('google', {
    // successRedirect: '/',
    failureRedirect: `${config.app.host}/error`,
    session: false
  }),
  (req, res) => {
    const token = jwt.sign(req.user, jwtOptions.secretOrKey, {
      audience: jwtOptions.audience,
      issuer: jwtOptions.issuer,
    });

    console.log(`${config.app.host}${req.query.state}`);
    const url = new URL(`${config.app.host}${req.query.state || ''}`);
    url.searchParams.set('token', token);

    res.redirect(url.toString());
  });

const requireAuthenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false })((req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'not authenticated' });
    }
    // next(null, req);
  });
};

/**
 * API endpoints
 */
 app.get('/api/entries', passport.authenticate('jwt', { session: false }), (req, res) => {
// app.get('/api/entries', (req, res) => {
  sequelize.sync()
    .then(() =>
      Entry.findAll({
        order: 'score DESC',
        limit: 10,
      })
    )
    .then(entries =>
      res.json({ data: entries })
    )
    .catch(error =>
      res.status(500).json({ error })
    );
});

app.post('/api/entries', passport.authenticate('jwt', { session: false }), (req, res) => {
  sequelize.sync()
    .then(() =>
      Entry.create(Object.assign({}, req.body))
    )
    .then(entry =>
      res.json({ data: entry })
    )
    .catch(error =>
      res.status(500).json({ error })
    );
});

app.get('/api/users/me', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ data: req.user });
});


/**
 * Let the client app handle all other request...
 *
 */
if (env === 'production') {
  app.get('*', (req, res) => {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf-8', (err, data) => {
      if (err) throw err;
      res.send(data);
    });
  });
}

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
