const
    { param } = require('express-validator'),
    Validator = require('./validator'),
    knex = require('../db');

class ProfileValidator extends Validator {
    constructor () {
        super();

        this._id = (req) => param('id')
            .exists()
            .isNumeric({
                no_symbols: true
            })
            .isInt({
                min: 0,
                allow_leading_zeroes: false
            })
            .run(req)
    }

    /* Methods */
    profile = async (req, res, next) => {
        await this.validationQueue(req, res, next, [this._id])
    }
}

module.exports = new ProfileValidator()