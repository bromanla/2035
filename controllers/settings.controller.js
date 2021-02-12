const knex = require('../db');

class SettingsController {
    /* Methods */
    agents = async (req, res) => {
        const { jwt } = req;

        const rows = await knex('tokens')
            .where('user_id', jwt.id)
            .select('id', 'agent', 'ip')

        res.json(rows);
    }
}

module.exports = new SettingsController()
