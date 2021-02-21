const { param, query } = require('express-validator')

module.exports._id = (req) => param('id', 'Invalid id')
    .exists()
    .isNumeric({
        no_symbols: true
    })
    .isInt({
        min: 1,
        allow_leading_zeroes: false
    })
    .run(req)

module.exports._page = (req) => query('page')
    .optional()
    .isNumeric({
        no_symbols: true
    })
    .isInt({
        min: 1,
        allow_leading_zeroes: false
    })
    .run(req)