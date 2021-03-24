const { query, oneOf } = require('express-validator')
const Validator = require('./validator')
const entities = require('./modules/entities')

class TeamsValidator extends Validator {
    #id = entities.id

    #page = entities.page

    #archive = query('archive')
        .optional()
        .isBoolean().withMessage('Invalid archive')

    #vote = oneOf([
        query('vote')
            .optional()
            .isBoolean().withMessage('Vote not boolean'),
        query('vote')
            .optional()
            .custom(async vote => {
                if(vote !== 'null')
                    throw('Vote not null')
            })
    ], 'Invalid vote')

    /* Methods */
    list = this.validate([
        this.#page,
        this.#archive,
        this.#vote
    ])

    byId = this.validate([
        this.#id
    ])
}

module.exports = new TeamsValidator()
