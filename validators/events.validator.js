const { query } = require('express-validator')
const Validator = require('./validator')
const entities = require('./modules/entities')

class EventsValidator extends Validator {
    #id = entities.id

    #page = entities.page

    #completed = query('completed', 'Invalid completed')
        .optional()
        .isBoolean()

    /* Methods */
    list = this.validate([
        this.#page,
        this.#completed
    ])

    byId = this.validate([
        this.#id
    ])
}

module.exports = new EventsValidator()

