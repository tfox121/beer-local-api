/* eslint consistent-return:0 import/order:0 */
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const logger = require('morgan');
// const cors = require('cors');
const path = require('path');
const argv = require('./argv');
const port = require('./port');
const app = express();

const userRoute = require('./routes/userRoute');
const publicRoute = require('./routes/publicRoute');
const producerRoute = require('./routes/producerRoute');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://tfox121.eu.auth0.com/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: 'https://beerlocal/api',
  issuer: `https://tfox121.eu.auth0.com/`,
  algorithms: ['RS256'],
});

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

// const whitelist = ['http://localhost:3000/'];
// const corsOptions = {
//   origin(origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true, // allow session cookie from browser to pass through
// };

// app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));

// Routes
app.use('/api/private/user', checkJwt, userRoute);
app.use('/api/private/producer', checkJwt, producerRoute);
app.use('/api', publicRoute);

// In production we need to pass these values in instead of relying on webpack
// setup(app, {
//   outputPath: resolve(process.cwd(), 'build'),
//   publicPath: '/',
// });

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host

// use the gzipped bundle
// app.get('*.js', (req, res, next) => {
//   req.url = req.url + '.gz'; // eslint-disable-line
//   res.set('Content-Encoding', 'gzip');
//   next();
// });

// Start your app.
app.listen(port, host, async err => {
  if (err) {
    return logger.error(err.message);
  }
  console.log(`beerLocal API listening on port ${port}!`);
});
