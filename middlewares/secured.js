// lib/middleware/secured.js

module.exports = () =>
  function secured(req, res, next) {
    console.log('USER?', req.user);
    if (req.user) {
      return next();
    }
    req.session.returnTo = req.originalUrl;
    return res.redirect('/login');
  };
