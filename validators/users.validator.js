const  { body, query, param } = require('express-validator')
const Validator = require('./validator')
const { id, page } = require('./entities')

class UsersValidator extends Validator {
    id = id
    page = page

    role = query('role')
        .optional()
        .custom(async role => {
            if (!['student', 'curator', 'guest', 'moderator'].includes(role))
                throw 'Role doesn\'t exist'
        })

    // Create user
    create_username = body('username')
        .exists().withMessage('Username is required').bail()
        .isAlphanumeric('en-US').withMessage('Unacceptable symbols').bail()
        .isLength({ min: 4, max: 16 }).withMessage('Invalid length').bail()

    create_password = body('password')
        .exists().withMessage('Password is required').bail()
        .isString().withMessage('Unacceptable symbols').bail()
        .isLength({ min: 4, max: 32 }).withMessage('Invalid length')

    create_role = body('role')
        .exists().withMessage('Role is required').bail()
        .custom(async role => {
            if (!['student', 'curator', 'guest', 'moderator'].includes(role))
                throw 'Role doesn\'t exist'
        })

    create_full_name = (field) => body(field)
        .exists().withMessage(`${field[0].toUpperCase() + field.substring(1)} is required`).bail()
        .isAlpha('ru-RU').withMessage('Unacceptable symbols').bail()
        .isLength({ max: 32 }).withMessage('Invalid length')

    create_description = body('description')
        .optional()
        .isString().withMessage('Unacceptable symbols').bail()
        .isLength({ max: 128 }).withMessage('Invalid length')

    create_archive = body('archive')
        .optional()
        .isBoolean()

    create_photo_id = body('photo_id')
        .optional()
        .isNumeric({ no_symbols: true }).bail()
        .isInt({
            min: 1,
            allow_leading_zeroes: false
        })

    /* Methods */
    list = this.validate([
       this.page,
       this.role
    ])

    byId = this.validate([
        this.id
    ])

    create = this.validate([
        this.create_username,
        this.create_password,
        this.create_role,
        this.create_full_name('name'),
        this.create_full_name('surname'),
        this.create_full_name('patronymic'),
        this.create_description,
        this.create_archive,
        this.create_photo_id
    ])
}

module.exports = new UsersValidator()
