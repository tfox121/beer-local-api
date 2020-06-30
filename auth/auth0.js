// const passport = require('passport');
// const Auth0Strategy = require('passport-auth0');

// const init = require('./init');

// // Configure Passport to use Auth0
// passport.use(
//   new Auth0Strategy(
//     {
//       domain: process.env.AUTH0_DOMAIN,
//       clientID: process.env.AUTH0_CLIENT_ID,
//       clientSecret: process.env.AUTH0_CLIENT_SECRET,
//       callbackURL:
//         process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
//     },
//     (accessToken, refreshToken, extraParams, profile, done) => {
//       // accessToken is the token to call Auth0 API (not needed in the most cases)
//       // extraParams.id_token has the JSON Web Token
//       // profile has all the information from the user
//       try {
//         // const user = await AuthStore.auth0FindUpdateCreate(profile);
//         return done(null, profile, { message: 'Logged in.' });
//       } catch (err) {
//         return done(err, null, { message: 'Login failed.' });
//       }
//     },
//   ),
// );

// init();

// module.exports = passport;
