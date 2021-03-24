const  { body, query } = require('express-validator')
const Validator = require('./validator')
const entities = require('./modules/entities')

class UsersValidator extends Validator {
    #id = entities.id

    #page = entities.page

    #list_role = query('role')
        .isIn(['student', 'curator', 'guest', 'moderator']).withMessage('Role doesn\'t exist')

    #username = body('username')
        .exists().withMessage('Username is required').bail()
        .isAlphanumeric('en-US').withMessage('Unacceptable symbols').bail()
        .isLength({ min: 4, max: 16 }).withMessage('Invalid length').bail()

    #password = body('password')
        .exists().withMessage('Password is required').bail()
        .isString().withMessage('Unacceptable symbols').bail()
        .isLength({ min: 4, max: 32 }).withMessage('Invalid length')

    #role = body('role')
        .exists().withMessage('Role is required').bail()
        .isIn(['student', 'curator', 'guest', 'moderator']).withMessage('Role doesn\'t exist')

    #full_name = (field) => body(field)
        .exists().withMessage(`${field[0].toUpperCase() + field.substring(1)} is required`).bail()
        .isAlpha('ru-RU').withMessage('Unacceptable symbols').bail()
        .isLength({ max: 32 }).withMessage('Invalid length')

    #description = body('description')
        .optional()
        .isString().withMessage('Unacceptable symbols').bail()
        .isLength({ max: 128 }).withMessage('Invalid length')

    #archive = body('archive')
        .optional()
        .isBoolean()

    #photo_id = body('photo_id')
        .optional()
        .isNumeric({ no_symbols: true }).bail()
        .isInt({
            min: 1,
            allow_leading_zeroes: false
        })

    /* Methods */
    list = this.validate([
       this.#page,
       this.#list_role
    ])

    byId = this.validate([
        this.#id
    ])

    create = this.validate([
        this.#username,
        this.#password,
        this.#role,
        this.#full_name('name'),
        this.#full_name('surname'),
        this.#full_name('patronymic'),
        this.#description,
        this.#archive,
        this.#photo_id
    ])

    patch = this.validate([
        this.#password.optional(),
        this.#role.optional(),
        this.#full_name('name').optional(),
        this.#full_name('surname').optional(),
        this.#full_name('patronymic').optional(),
        this.#description.optional(),
        this.#archive.optional(),
        this.#photo_id.optional()
    ])

    delete = this.validate([
        this.#id
    ])
}

module.exports = new UsersValidator()
