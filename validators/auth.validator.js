const { body } = require('express-validator')
const Validator = require('./validator')

class AuthValidator extends Validator {
    #username = body('username')
        .exists().withMessage('Username is required').bail()
        .isAlphanumeric('en-US').withMessage('Unacceptable symbols').bail()
        .isLength({min: 4, max: 16}).withMessage('Invalid length')

    #password = body('password')
        .exists().withMessage('Password is required').bail()
        .isString().withMessage('Unacceptable symbols').bail()
        .isLength({min: 4, max: 32}).withMessage('Invalid length')

    #token = body('token')
        .exists().withMessage('Token is required').bail()
        .isUUID(4).withMessage('Invalid token')

    /* Methods */
    login = this.validate([
        this.#username,
        this.#password
    ])

    refresh = this.validate([
        this.#token
    ])

    logout = this.refresh

    logoutAll = this.refresh
}

module.exports = new AuthValidator();
