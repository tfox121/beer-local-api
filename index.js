/* eslint consistent-return:0 import/order:0 */
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const argv = require('./argv');
const port = require('./port');
const app = express();

const UserStore = require('./stores/userStore');
const UserRoute = require('./routes/userRoute');
const PublicRoute = require('./routes/publicRoute');
const ProducerRoute = require('./routes/producerRoute');
const RetailerRoute = require('./routes/retailerRoute');


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

app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type',
    'Authorization'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  res.setHeader('Access-Control-Allow-Origin', '*');

  // Pass to next layer of middleware
  next();
});

const whitelist = ['http://localhost:3000', 'https://beer-local.herokuapp.com'];
const corsOptions = {
  optionsSuccessStatus: 200,
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

// console.log(path.join(__dirname, 'public'))

// app.use(express.static('public')); << seems to prevent console logs.
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(logger('dev'));

const attachUser = async (req, res, next) => {
  if (req.user && req.user.sub) {
    try {
      const user = await UserStore.findUser(req.user.sub)
      if (user) {
        req.role = user.role
      }
    } catch(err) {
      next(err)
    }
  }
  next()
}


// Routes
app.use('/api/private/user', checkJwt, attachUser, UserRoute);
app.use('/api/private/producer', checkJwt, attachUser, ProducerRoute);
app.use('/api/private/retailer', checkJwt, attachUser, RetailerRoute);
app.use('/api', PublicRoute);



// In production we need to pass these values in instead of relying on webpack
// setup(app, {
//   outputPath: resolve(process.cwd(), 'build'),
//   publicPath: '/',
// });

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host

app.listen(port, host, async err => {
  if (err) {
    return logger.error(err.message);
  }
  console.log(`beerLocal API listening on port ${port}!`);
});
