/* eslint consistent-return:0 import/order:0 */
require('dotenv').config();
const mongoose = require('mongoose');
const chalk = require('chalk');
const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const logger = require('morgan');
const cors = require('cors');
const port = require('./port');
// const formidable = require('formidable');

const app = express();

const UserStore = require('./stores/userStore');
const UserRoute = require('./routes/userRoute');
const OrderRoute = require('./routes/orderRoute');
const PublicRoute = require('./routes/publicRoute');
const ProducerRoute = require('./routes/producerRoute');
const RetailerRoute = require('./routes/retailerRoute');
const ImageRoute = require('./routes/imageRoute');

const morganMiddleware = logger((tokens, req, res) => [
  '\n',
  chalk.hex('#ff4757').bold('🍄'),
  chalk.hex('#34ace0').bold(tokens.method(req, res)),
  chalk.hex('#ffb142').bold(tokens.status(req, res)),
  chalk.hex('#ff5252').bold(tokens.url(req, res)),
  chalk.hex('#2ed573').bold(`${tokens['response-time'](req, res)} ms`),
  chalk.hex('#f78fb3').bold(`@ ${tokens.date(req, res)}`),
  chalk.yellow(tokens['remote-addr'](req, res)),
  chalk.hex('#cfca4c').bold(`from ${tokens.referrer(req, res)}`),
  chalk.hex('#1e90ff')(tokens['user-agent'](req, res)),
  '\n',
].join(' '));

app.use(morganMiddleware);
// app.use(logger('dev'));
// app.use(logger('combined'));

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
    jwksUri: 'https://tfox121.eu.auth0.com/.well-known/jwks.json',
  }),
  audience: 'https://beerlocal/api',
  issuer: 'https://tfox121.eu.auth0.com/',
  algorithms: ['RS256'],
});

app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type',
    'Authorization',
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  res.setHeader('Access-Control-Allow-Origin', '*');

  // Pass to next layer of middleware
  next();
});

const whitelist = ['http://localhost:3000', 'http://localhost:3000/', 'https://beerlocal.herokuapp.com', 'https://beerlocal.herokuapp.com/', 'https://tfox121.github.io/beer-local-client/', 'https://tfox121.github.io/beer-local-client'];
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

// const formParse = async (req, res, next) => {
//   const form = new formidable.IncomingForm();
//   form.keepExtensions = true;
//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       next(err);
//       return;
//     }
//     req.fields = fields;
//     req.files = files;
//   });
//   next();
// };

// app.use(formParse);

app.use(express.json()); app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

const attachUser = async (req, res, next) => {
  if (req.user && req.user.sub) {
    try {
      const user = await UserStore.findBySub(req.user.sub);
      if (user) {
        req.role = user.role;
      }
    } catch (err) {
      next(err);
    }
  }
  next();
};

// Routes

// // will redirect all the non-api routes to react frontend
// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, '../client', 'build', 'index.html'));
// });

app.use('/api', PublicRoute);
app.use(checkJwt, attachUser);
app.use('/api/private/user', UserRoute);
app.use('/api/private/orders', OrderRoute);
app.use('/api/private/producer', ProducerRoute);
app.use('/api/private/retailer', RetailerRoute);
app.use('/api/private/image', ImageRoute);

// In production we need to pass these values in instead of relying on webpack
// setup(app, {
//   outputPath: resolve(process.cwd(), 'build'),
//   publicPath: '/',
// });

app.listen(port, (err) => {
  if (err) {
    return logger.error(err.message);
  }
  console.log(`beerLocal API listening on port ${port}!`);
});
