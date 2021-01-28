const
    { param, query } = require('express-validator'),
    Validator = require('./validator'),
    knex = require('../db');

class TeamsValidator extends Validator {
    constructor () {
        super();

        this._id = (req) => param('id')
            .exists()
            .isNumeric({
                no_symbols: true
            })
            .isInt({
                min: 1,
                allow_leading_zeroes: false
            })
            .run(req)

        this._page = (req) => query('page')
            .optional()
            .isNumeric({
                no_symbols: true
            })
            .isInt({
                min: 1,
                allow_leading_zeroes: false
            })
            .run(req)

        this._archive = (req) => query('archive', 'Invalid archive')
            .optional()
            .isBoolean()
            .run(req)
    }

    /* Methods */
    root = async (req, res, next) => {
        await this.validationQueue(req, res, next, [this._page, this._archive])
    }

    byId = async (req, res, next) => {
        await this.validationQueue(req, res, next, [this._id])
    }
}

module.exports = new TeamsValidator()