const { query } = require('express-validator');
const Validator = require('./validator')
const { _id } = require('./entities')

class TeamsValidator extends Validator {
    constructor () {
        super();

        this._id = _id;

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