const  { body } = require('express-validator');

const knex = require('../db');
const Validator = require('./validator')
const { _id } = require('./entities');

class UsersValidator extends Validator {
    constructor () {
        super();

        this._id = _id;

        this._username = (req) => body('username')
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
                const [ { count }  ] = await knex('users')
                    .count()
                    .where('username', username)

                if (count != 0)
                    throw 'User already exists'
            })
            .run(req)

        this._password = (req) => body('password')
            .exists()
            .withMessage('Password is required')
            .bail()
            .isString()
            .withMessage('Unacceptable symbols')
            .bail()
            .isLength({min: 4, max: 32})
            .withMessage('Invalid length')
            .run(req)


        this._role = (req) => body('role')
            .exists()
            .withMessage('Role is required')
            .bail()
            .custom(async role => {
                if (!['student', 'curator', 'guest', 'moderator'].includes(role))
                    throw 'Incorrect value'
            })
            .run(req)

        this._FIO = (field) => (req) => body(field)
            .exists().withMessage(`${field} is required`).bail()
            .isAlpha('ru-RU').withMessage('Unacceptable symbols').bail()
            .isLength({max: 32}).withMessage('Invalid length')
            .run(req)

        this._small_photo = (req) => body('small_photo_id')
            .optional()
            .isNumeric({
                no_symbols: true
            })
            .isInt({
                min: 1,
                allow_leading_zeroes: false
            })
            .custom(async (small_photo_id) => {
                const [ small_photo ] = await knex('upload_queue').select().where('id', small_photo_id)

                if (!small_photo)
                    throw 'small_photo not found in db'

                req.body.small_photo = small_photo.file_name
            })
            .run(req)
    }

    /* Methods */
    byId = async (req, res, next) => {
        await this.validationQueue(req, res, next, [this._id])
    }

    create = async (req, res, next) => {
        await this.validationQueue(req, res, next, [
            this._username,
            this._password,
            this._role,
            this._FIO('name'),
            this._FIO('surname'),
            this._FIO('patronymic'),
            this._small_photo
        ])
    }
}

module.exports = new UsersValidator()