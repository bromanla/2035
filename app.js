'use strict'
require('dotenv').config();
require('./logger');

const app = require('express')();
const middleware = require('./middleware');
const routes = require('./routes');
const errorHandler = require('./error.handler');

/* Middleware */
middleware.forEach((h) => app.use(h));

/* Routes */
routes.forEach(({path, router}) => app.use(path, router));

/* Error handler */
app.use(errorHandler);

/* Run server */
app.listen(process.env.PORT, (err) => {
    if (err) {
        logger.fatal('Error start');
        process.exit(1);
    }

    logger.info(`Server is running on port ${process.env.PORT}`);
});
