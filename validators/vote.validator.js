const Validator = require('./validator')
const { _id } = require('./entities')

class VoteValidator extends Validator {
    constructor () {
        super();

        this._id = _id
    }

    /* Methods */
    audience = async (req, res, next) => {
        await this.validationQueue(req, res, next, [this._id])
    }

    guest = async (req, res, next) => {
        await this.validationQueue(req, res, next, [this._id])
    }
}

module.exports = new VoteValidator()
