const knex = require('../db');

module.exports.knex_small_photo = knex.ref(knex.raw(`'${process.env.DOMAIN}/uploads/small_photo/'||small_photo`)).as('small_photo')
module.exports.knex_team_icon = knex.ref(knex.raw(`'${process.env.DOMAIN}/uploads/team_icon/'||team_icon`)).as('team_icon')
module.exports.knex_small_photo_uploads = knex.ref(knex.raw(`'${process.env.DOMAIN}/uploads/small_photo/'||file_name`)).as('small_photo')