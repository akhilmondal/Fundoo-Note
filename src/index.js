import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import routes from './routes';
import database from './config/database';
import {
  appErrorHandler,
  genericErrorHandler,
  notFound
} from './middlewares/error.middleware';
import logger, { logStream } from './config/logger';

import morgan from 'morgan';
const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./Swagger/Swagger.json');

const app = express();
const host = process.env.APP_HOST;
const port = process.env.APP_PORT;
const api_version = process.env.API_VERSION;


app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('combined', { stream: logStream }));
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

database();

app.use(`/api/${api_version}`, routes()); // To go for the requested routes './routes/index.js'
app.use(appErrorHandler);
app.use(genericErrorHandler);
app.use(notFound);

//to start the server and make it listen for incoming HTTP requests on a specified port.
app.listen(port, () => { 
  logger.info(`Server started at ${host}:${port}/api/${api_version}/`);
});

export default app;
