const { body } = require('express-validator')
const entities = require('./modules/entities')
const Validator = require('./validator')

class VoteValidator extends Validator {
    #id = entities.id

    #vote = body('vote')
        .exists().withMessage('Vote is required').bail()
        .isBoolean().withMessage('Invalid vote')

    /* Methods */
    audience = this.validate([
        this.#id,
        this.#vote
    ])

}

module.exports = new VoteValidator()
