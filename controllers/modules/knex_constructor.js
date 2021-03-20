const knex = require('../../db')

module.exports.url_constructor = (column, as = column, dir = as) => (
    knex.ref(knex.raw(`'${process.env.DOMAIN}/uploads/${dir}/' || ${column}`)).as(as)
)
