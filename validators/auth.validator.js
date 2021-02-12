const { body } = require('express-validator');
const Validator = require('./validator');

class AuthValidator extends Validator {
    constructor () {
        super();

        this._username = async (req) => body('username')
            .exists().withMessage('Username is required').bail()
            .isAlphanumeric('en-US').withMessage('Unacceptable symbols').bail()
            .isLength({min: 4, max: 16}).withMessage('Invalid length').bail()
            .run(req)

        this._password = async (req) => body('password')
            .exists().withMessage('Password is required').bail()
            .isString().withMessage('Unacceptable symbols').bail()
            .isLength({min: 4, max: 32}).withMessage('Invalid length').bail()
            .run(req)

        this._token = async (req) => body('token')
            .exists().withMessage('Token is required').bail()
            .isUUID(4).withMessage('Invalid token').bail()
            .run(req)
    }

    /* Methods */
    login = async (req, res, next) => {
        this.validationQueue(req, res, next, [this._username, this._password])
    }

    refresh = async (req, res, next) => {
        this.validationQueue(req, res, next, [this._token])
    }

    logout = this.refresh

    logoutAll = this.refresh
}

module.exports = new AuthValidator();
