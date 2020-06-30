// const router = require('express').Router();
// const querystring = require('querystring');
// const util = require('util');
// const url = require('url');

// const passport = require('../auth/auth0');

// // Perform the login, after login Auth0 will redirect to callback
// router.get(
//   '/login',
//   passport.authenticate('auth0', {
//     scope: 'openid email profile',
//   }),
//   (req, res) => {
//     res.redirect('/');
//   },
// );

// // Perform the final stage of authentication and redirect to previously requested URL or '/user'
// router.get('/callback', function(req, res, next) {
//   passport.authenticate('auth0', function(err, user, info) {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return res.redirect('/login');
//     }
//     req.logIn(user, function(err) {
//       if (err) {
//         return next(err);
//       }
//       const { returnTo } = req.session;
//       delete req.session.returnTo;
//       // res.redirect(returnTo || '/user');
//       return res.json({
//         success: true,
//         message: 'user has successfully authenticated',
//       });
//     });
//   })(req, res, next);
// });

// // Perform session logout and redirect to homepage
// router.get('/logout', (req, res) => {
//   req.logout();
//   console.log('LOGGING OUT');
//   let returnTo = `${req.protocol}://${req.hostname}`;
//   const port = req.connection.localPort;
//   if (port !== undefined && port !== 80 && port !== 443) {
//     returnTo += `:${port}`;
//   }
//   const logoutURL = new url.URL(
//     util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN),
//   );
//   const searchString = querystring.stringify({
//     client_id: process.env.AUTH0_CLIENT_ID,
//     returnTo,
//   });
//   logoutURL.search = searchString;
//   // console.log(logoutURL);

//   // return res.redirect(logoutURL);
//   return res.status(200).json({
//     success: true,
//     logoutURL,
//     message: 'user logged out.',
//   });
// });

// // // when login is successful, retrieve user info
// // router.get('/login/success', (req, res) => {
// //   if (req.user) {
// //     return res.json({
// //       success: true,
// //       message: 'user has successfully authenticated',
// //       user: req.user,
// //       cookies: req.cookies,
// //     });
// //   }
// //   return res.json({
// //     success: false,
// //   });
// // });

// // // when login failed, send failed msg
// // router.get('/login/failed', (req, res) => {
// //   res.status(401).json({
// //     success: false,
// //     message: 'user failed to authenticate.',
// //   });
// // });

// // // When logout, redirect to client
// // router.get('/logout', (req, res) => {
// //   req.logout();
// //   // res.redirect('/');
// //   res.status(200).json({
// //     success: true,
// //     message: 'user logged out.',
// //   });
// // });

// // router.get(
// //   '/google',
// //   passportGoogle.authenticate('google', {
// //     scope: [
// //       'https://www.googleapis.com/auth/userinfo.profile',
// //       'https://www.googleapis.com/auth/userinfo.email',
// //     ],
// //   }),
// // );

// // router.get(
// //   '/google/callback',
// //   passportGoogle.authenticate('google', {
// //     // successRedirect: '/',
// //     // failureRedirect: '/auth/login/failed',
// //   }),
// // );

// module.exports = router;
