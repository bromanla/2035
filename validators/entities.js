const { param, query } = require('express-validator')

module.exports.id = param('id', 'Invalid id')
    .exists()
    .isNumeric({ no_symbols: true }).bail()
    .isInt({
        min: 1,
        allow_leading_zeroes: false
    });

module.exports.page = query('page')
    .optional()
    .isNumeric({ no_symbols: true }).bail()
    .isInt({
        min: 1,
        allow_leading_zeroes: false
    });
