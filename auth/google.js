// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// const AuthStore = require('../stores/AuthStore');
// const init = require('./init');

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CLIENT_CALLBACK,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const user = await AuthStore.googleFindUpdateCreate(profile);
//         return done(null, user, { message: 'Logged in.' });
//       } catch (err) {
//         return done(err, null, { message: 'Login failed.' });
//       }
//     },
//   ),
// );

// init();

// module.exports = passport;
