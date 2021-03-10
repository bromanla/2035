const Validator = require('./validator')
const { _id } = require('./entities')

class EventsValidator extends Validator {
    constructor () {
        super();

        this._id = _id
    }

    /* Methods */
    byId = async (req, res, next) => {
        await this.validationQueue(req, res, next, [this._id])
    }
}

module.exports = new EventsValidator()
