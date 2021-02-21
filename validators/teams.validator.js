const { query } = require('express-validator');
const Validator = require('./validator')
const { _id, _page } = require('./entities')

class TeamsValidator extends Validator {
    constructor () {
        super();

        this._id = _id;

        this._page = _page;

        this._archive = (req) => query('archive', 'Invalid archive')
            .optional()
            .isBoolean()
            .run(req)
    }

    /* Methods */
    list = async (req, res, next) => {
        await this.validationQueue(req, res, next, [this._page, this._archive])
    }

    byId = async (req, res, next) => {
        await this.validationQueue(req, res, next, [this._id])
    }
}

module.exports = new TeamsValidator()