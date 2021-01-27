const
    { body } = require('express-validator'),
    bcrypt = require('bcryptjs'),
    Validator = require('./validator'),
    knex = require('../db');

class AuthValidator extends Validator {
    constructor () {
        super();

        this._username = async (req) => body('username')
            .exists()
            .withMessage('Username is required')
            .bail()
            .isAlphanumeric('en-US')
            .withMessage('Unacceptable symbols')
            .bail()
            .isLength({min: 4, max: 16})
            .withMessage('Invalid length')
            .bail()
            .custom(async username => {
                const [ user ] = await knex('users')
                    .select('id', 'username', 'password', 'role')
                    .where('username', username)

                if (!user)
                    throw 'User is not found'

                req.user = user;
            })
            .run(req)

        this._password = async (req) => body('password')
            .exists()
            .withMessage('Password is required')
            .bail()
            .isString()
            .withMessage('Unacceptable symbols')
            .bail()
            .isLength({min: 4, max: 32})
            .withMessage('Invalid length')
            .bail()
            .custom(async password => {
                const isComparison = await bcrypt.compare(password, req.user.password);

                if (!isComparison)
                    throw 'Incorrect password'
            })
            .run(req)

        this._token = async (req) => body('token')
            .exists()
            .withMessage('Token is required')
            .bail()
            .isUUID(4)
            .withMessage('Invalid token')
            .bail()
            .custom(async token => {
                const [ user ] = await knex('tokens')
                    .select('users.id', 'username', 'expires_in', 'tokens.id AS token_id')
                    .leftJoin('users', 'user_id', 'users.id')
                    .where('token', token)

                if (!user)
                    throw 'Invalid token'

                if (user.expires_in < Date.now()) {
                    await knex('tokens')
                        .where('token', token)
                        .del()

                    throw 'Token expired'
                }

                req.user = user;
            })
            .run(req)
    }

    /* Methods */
    login = async (req, res, next) => {
        this.validationQueue(req, res, next, [this._username, this._password])
    }

    refresh = async (req, res, next) => {
        this.validationQueue(req, res, next, [this._token])
    }

    logout = this.refresh;
}

module.exports = new AuthValidator();
