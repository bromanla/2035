const { query } = require('express-validator');
const Validator = require('./validator')
const { id, page } = require('./entities')

class TeamsValidator extends Validator {
    id = id
    page = page

    archive = query('archive', 'Invalid archive')
        .optional()
        .isBoolean()

    /* Methods */
    list = this.validate([
        this.page,
        this.archive
    ])

    byId = this.validate([
        this.id
    ])
}

module.exports = new TeamsValidator()
