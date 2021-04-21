/**
 * Test initialization file containing required packages for most tests
 * @author Chinedu Ekene Okpala <allstack@gmail.com>
 */

// set environment to test
process.env.NODE_ENV = 'TEST'

require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const log4js = require('log4js')
const async = require('async')
const randomatic = require('randomatic')
const lodash = require('lodash')
const celebrate = require('celebrate')
const cors = require('cors')
const redis = require('redis')
const hbs = require('express-handlebars')
const fs = require('fs-extra')
const helmet = require('helmet')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const util = require('util')
const path = require('path')
const fetch = require('node-fetch')

// Env config
const getEnvs = require('../config/envs').factory()
// Logger config
const logger = require('../config/logger').factory(log4js)

// Helpers
const Database = require('../helpers/db').factory(getEnvs)
const miscHelper = require('../helpers/misc').factory(path, lodash, moment, fetch)
const hbsHelpers = require('../helpers/handlebars').factory()

// Counter Model
const CounterModel = require('../models/counter').factory(mongoose)

// Libs
const redisCluster = require('../libs/redisCluster').factory(redis, logger, getEnvs)
const generateKey = require('../libs/key.gen').factory(async, randomatic, CounterModel, logger)
const response = require('../libs/response').factory()

// Middlewares
const authenticate = require('../middlewares/authenticate').factory(
  jwt,
  redisCluster,
  getEnvs,
  response,
  logger,
  miscHelper
)
const access = require('../middlewares/access').factory(response, miscHelper)
const Cache = require('../middlewares/cache').factory(
  redisCluster,
  logger,
  miscHelper,
  response,
  util
)
const uploader = require('../middlewares/uploader').factory(
  path,
  aws,
  multer,
  multerS3,
  fs,
  getEnvs,
  miscHelper,
  logger,
  response
)

// Database config
const db = require('../config/db').factory(mongoose, Database, logger, log4js)

// #region Any
const AnyModel = require('../models/any_model').factory(mongoose)
const AnyRepository = require('../repositories/any_repo').factory
const AnyRepoInstance = new AnyRepository(AnyModel, logger)
const AnyController = require('../controllers/any_controller').factory
const AnyContInstance = new AnyController(AnyRepoInstance, miscHelper, logger, response, mongoose)
// #endregion

// #region Endpoints
const endpoints = require('../routers/endpoints').factory(
  AnyContInstance,
  AnyValidations,
  MiscValidations,
  Cache,
  uploader,
  access,
  miscHelper
)
// #endregion

// #region Routers
const routers = require('../routers/register').factory(
  express,
  swaggerUi,
  authenticate,
  response,
  endpoints,
  miscHelper
)
// #endregion

// #region Bootstrap module for end-to-end tests
const bootstrap = require('../bootstrap').factory(
  express,
  cors,
  helmet,
  morgan,
  bodyParser,
  hbs,
  celebrate,
  db,
  routers,
  logger,
  hbsHelpers,
  miscHelper,
  response
)
// #endregion

// #region Connect to Redis
const client = redisCluster()

// generate jwt token
const token = authenticate.generateToken('5ebdb1a134efdb3a1868d3c1', '1d')

// auth test user data
const authUser = {
  user: {
    _id: 1,
    firstName: 'first',
    lastName: 'last',
    email: 'test@gmail.com'
  },
  authToken: token
}

// cache auth user with token as key
client.set(String(authUser.authToken), JSON.stringify(authUser.user))

// delay by 4s to make sure cache completed
global.Atomics.wait(new global.Int32Array(new global.SharedArrayBuffer(4)), 0, 0, 4000)
// #endregion

// #region Export packages
module.exports = {
  express,
  mongoose,
  AnyModel,
  AnyRepoInstance,
  generateKey,
  bootstrap,
  authenticate,
  token,
  access,
  authUser
}
// #endregion
