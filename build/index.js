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

const sequelize = new Sequelize('d4qg7aomb0qsif', 'cdfsfgjpobagtn', 'e7e18e45cef4a1853cec904344f232d6844bdfa88aa43767ab3696254a5a9342', {
  host: 'ec2-54-75-248-193.eu-west-1.compute.amazonaws.com',
  dialect: 'postgres',
  dialectOptions: { ssl: true }
});

// const sequelize = new Sequelize('pullups', 'scrodde', '', {
//   dialect: 'postgres',
//   logging: console.log
// });

const Entry = sequelize.define('entry', {
  email: Sequelize.STRING,
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  score: Sequelize.INTEGER,
  type: Sequelize.STRING,
});

passport.use(new GoogleStrategy({
  clientID: '606977829814-o8v2p0qhmd46smebhten5p09uiojsjon.apps.googleusercontent.com',
  clientSecret: 'cazdmbrhCs8E6Ttu3rJgGK_O',
  callbackURL: 'http://localhost:3000/auth/google/callback',
  passReqToCallback: true
},
(req, accessToken, refreshToken, profile, next) => {
  next(null, {
    email: profile.email,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
  })
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

const port = process.env.PORT || 3000;
const app = express();

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('cors')());
app.use(require('morgan')('combined'));
app.use(require('body-parser').json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// Authentication
app.get('/auth/google', (req, res) => {
  const state = _.isEmpty(req.query.redirect) ? null : req.query.redirect;
  passport.authenticate('google', { scope: ['email', 'profile'], prompt: 'consent select_account', state })(req, res);
});

app.get('/auth/google/callback',
  passport.authenticate('google', {
    // successRedirect: '/',
    failureRedirect: '/',
    session: false
  }),
  (req, res) => {
    const token = jwt.sign(req.user, jwtOptions.secretOrKey, {
      audience: jwtOptions.audience,
      issuer: jwtOptions.issuer,
    });
    const url = new URL(_.isEmpty(req.query.state) ? '/' : req.query.state);
    url.searchParams.set('token', token);

    res.redirect(url.href);
  });

// const requireAuthenticated = (req, res, next) => {
//   if (!req.user) {
//     return res.status(401).json({ error: 'not authenticated' });
//   }
//   return next(null, req);
// };

app.get('/api/entries', passport.authenticate('jwt', { session: false }), (req, res) => {
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

app.get('*', (req, res) => {
  fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf-8', (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
