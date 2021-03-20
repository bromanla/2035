const { query } = require('express-validator');
const Validator = require('./validator')
const { id, page } = require('./entities')

class EventsValidator extends Validator {
    id = id
    page = page

    completed = query('completed', 'Invalid completed')
        .optional()
        .isBoolean()

    /* Methods */
    list = this.validate([
        this.page,
        this.completed
    ])

    byId = this.validate([
        this.id
    ])
}

module.exports = new EventsValidator()

