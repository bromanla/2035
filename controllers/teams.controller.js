const knex = require('../db')
const { url_constructor } = require('./entities')

class TeamsController {
    /* Methods */
    list = async (req, res) => {
        const page = req.query.page ?? 1
        const archive = req.query.archive ?? false

        const teams = await knex('teams')
            .select('id', 'team_name', url_constructor('team_icon'))
            .orderBy('id', 'desc')
            .offset((page - 1) * process.env.PER_PAGE)
            .limit(process.env.PER_PAGE)
            .where({ archive })

        const [{ total_entries }] = await knex('teams')
            .count('* as total_entries')
            .where({ archive })

        const total_pages = Math.ceil(total_entries / process.env.PER_PAGE);

        res.send({
            teams,
            pagination: {
                current_page: +page,
                current_entries: teams.length,
                total_entries: +total_entries,
                total_pages,
                per_page: +process.env.PER_PAGE
            }
        })
    }

    byId = async (req, res) => {
        const { id } = req.params

        const team = await knex('teams')
            .select('id', 'team_name', 'team_description', url_constructor('team_icon'), 'customer')
            .where({ id })
            .first()

        if (!team)
            return res.status(404).json({error: {msg: 'Team not found', value: id}})

        const members = await knex('teams')
            .leftJoin('teams_members', 'team_id', 'teams.id')
            .leftJoin('users', 'users.id', 'user_id')
            .select('users.id', 'name', 'surname', 'patronymic', url_constructor('small_photo'), 'team_role')
            .where({'teams.id': id})

        res.json({ team, members })
    }
}

module.exports = new TeamsController()
