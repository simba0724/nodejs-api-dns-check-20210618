const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
const jwt = require('express-jwt');
const cors = require('cors');
const jwksRsa = require('jwks-rsa');
const jwtScope = require('express-jwt-scope');
const bodyParser = require("body-parser");
const formData = require("express-form-data")
// var Rollbar = require('rollbar');

const DNSRoute = require('./Routes/DNS.route')

const app = express()

// var rollbar = new Rollbar({
//   accessToken: '0fcf3aebf8354af79d98cf0cb1138abe',
//   captureUncaught: true,
//   captureUnhandledRejections: true
// });

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://auth-av.eu.auth0.com/.well-known/jwks.json`
  }),

  audience: 'api.laconfection-digitale.fr/dns',
  issuer: `https://auth.pluggyz.fr/`,
  algorithms: ['RS256']
});

const corsOptions = {
  origin: '*',
  methods: ["OPTIONS", "POST", "GET"],
  preflightContinue: true,
  credentials: true,
  optionsSuccessStatus: 201
};

app.use(morgan('dev'))

app.use(express.json())

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: process.env.DNS_SIZE_LIMIT
  })
);
app.use(bodyParser.json({limit: process.env.DNS_SIZE_LIMIT}));
app.use(formData.parse());

app.use(cors(corsOptions), function (req, res, next) { //http://expressjs.com/en/resources/middleware/cors.html
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  next();
});

app.get('/', async (req, res, next) => {
  res.send('Hello from express.')
})

// 'dns:mail', 'dns:url'
app.use('/dns', jwtScope(['dns:mail', 'dns:url'], {requireAll: true}), DNSRoute)

app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})

const SERVER_PORT = process.env.SERVER_PORT || 3000

app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`)
})
