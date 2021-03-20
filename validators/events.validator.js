const { query } = require('express-validator')
const Validator = require('./validator')
const { id, page } = require('./modules/entities')

class EventsValidator extends Validator {
    completed = query('completed', 'Invalid completed')
        .optional()
        .isBoolean()

    /* Methods */
    list = this.validate([
        page,
        this.completed
    ])

    byId = this.validate([
        id
    ])
}

module.exports = new EventsValidator()

