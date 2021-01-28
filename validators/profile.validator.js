const
    { param } = require('express-validator'),
    Validator = require('./validator'),
    knex = require('../db');

class ProfileValidator extends Validator {
    constructor () {
        super();

        this._id = (req) => param('id', 'Invalid id')
            .exists()
            .isNumeric({
                no_symbols: true
            })
            .isInt({
                min: 1,
                allow_leading_zeroes: false
            })
            .run(req)
    }

    /* Methods */
    byId = async (req, res, next) => {
        await this.validationQueue(req, res, next, [this._id])
    }
}

module.exports = new ProfileValidator()