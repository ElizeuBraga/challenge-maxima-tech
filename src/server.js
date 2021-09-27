const express = require('express');
const app = express();
const router = express.Router();

if (process.env.NODE_ENV != 'production'){
  require('dotenv').config();
  app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // update to match the domain you will make the request from
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      next();
  });
}

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Rotas
const authRoute = require('../src/router/api/authRoutes');
const userRoute = require('../src/router/api/userRoutes');
const index = require('../src/router/api/index');
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api', index);

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

module.exports = app;