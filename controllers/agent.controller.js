const knex = require('../db');

class AgentController {
    /* Methods */
    root = async (req, res) => {
        const { jwt } = req;

        const rows = await knex('tokens')
            .where('user_id', jwt.id)
            .select('id', 'agent')

        res.json(rows);
    }
}

module.exports = new AgentController()
