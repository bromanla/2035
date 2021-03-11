const knex = require('knex')({
    client: 'pg',
    connection: {
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
        port: process.env.PG_PORT,
        host: 'localhost'
    }
});

knex('users').count('id')
    .then(([row]) => {
        logger.info(`Postgres connected to ${process.env.PG_DATABASE} (users: ${row.count})`)
    })
    .catch(err => {
        logger.fatal(`Test query error: ${err}`)
        process.exit(1)
    })

module.exports = knex;
