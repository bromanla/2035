const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    headers: false,
    message: {
        error: {
            msg: 'Too many requests'
        }
    }
})