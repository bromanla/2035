const knex = require('../db');
const { knex_small_photo, knex_team_icon } = require('./entities');

class TeamsController {
    /* Methods */
    list = async (req, res) => {
        const page = req.query.page ?? 1;
        const archive = req.query.archive ?? false;

        const teams = await knex('teams')
            .select('id', 'team_name', knex_team_icon)
            .orderBy('id', 'desc')
            .offset((page - 1) * process.env.TEAMS_PER_PAGE)
            .limit(process.env.TEAMS_PER_PAGE)
            .where('archive', archive)

        res.send({
            teams,
            pagination: {
                current_page: +page,
                current_entries: teams.length,
                per_page: +process.env.TEAMS_PER_PAGE,
                archive
            }
        })
    }

    byId = async (req, res) => {
        const { id } = req.params;

        const [ team ] = await knex('teams')
            .select('id', 'team_name', 'team_description', knex_team_icon, 'customer')
            .where('id', id)

        if (!team)
            return res.status(404).json({error: {msg: 'Team not found', value: id}})

        const members = await knex('teams')
            .leftJoin('teams_members', 'team_id', 'teams.id')
            .leftJoin('users', 'users.id', 'user_id')
            .select('users.id', 'name', 'surname', 'patronymic', knex_small_photo, 'team_role')
            .where('teams.id', id)

        res.json({ team, members })
    }
}

module.exports = new TeamsController()
