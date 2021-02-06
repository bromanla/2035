const knex = require('../db');

class AgentsController {
    /* Methods */
    root = async (req, res) => {
        const { jwt } = req;

        const rows = await knex('tokens')
            .where('user_id', jwt.id)
            .select('id', 'agent', 'ip')

        res.json(rows);
    }
}

module.exports = new AgentsController()
