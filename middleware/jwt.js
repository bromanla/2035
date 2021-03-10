const jwt = require('express-jwt');

module.exports = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: [process.env.JWT_ALGORITHM],
    requestProperty: 'jwt'
}).unless({
    path: [RegExp('^/auth/')]
})
