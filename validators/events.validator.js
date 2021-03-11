const { query } = require('express-validator');
const Validator = require('./validator')
const { _id, _page } = require('./entities')

class EventsValidator extends Validator {
    constructor () {
        super();

        this._id = _id

        this._page = _page;

        this._completed = (req) => query('completed', 'Invalid completed')
            .optional()
            .isBoolean()
            .run(req)
    }

    /* Methods */
    list = async (req, res, next) => {
        await this.validationQueue(req, res, next, [this._page, this._completed])
    }

    byId = async (req, res, next) => {
        await this.validationQueue(req, res, next, [this._id])
    }
}

module.exports = new EventsValidator()

