const knex = require('../db')
const { url_constructor } = require('./entities')

class TeamsController {
    /* Methods */
    list = async (req, res) => {
        const page = req.query.page ?? 1
        const archive = req.query.archive ?? false
        const vote = req.query.vote === 'null' ? null : req.query.vote

        const teams = await knex('teams')
            .select('teams.id', 'team_name', url_constructor('team_icon'), 'vote')
            .leftJoin('vote_audience', 'vote_audience.team_id', 'teams.id')
            .offset((page - 1) * process.env.PER_PAGE)
            .limit(process.env.PER_PAGE)
            .where((builder) => {
                builder.where({archive})
                typeof vote !== 'undefined' && builder.where({vote})
            })

        const [{ total_entries }] = await knex('teams')
            .leftJoin('vote_audience', 'vote_audience.team_id', 'teams.id')
            .count('* as total_entries')
            .where((builder) => {
                builder.where({archive})
                typeof vote !== 'undefined' && builder.where({vote})
            })

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
            .select('teams.id', 'team_name', 'team_description', url_constructor('team_icon'), 'customer', 'vote')
            .leftJoin('vote_audience', 'vote_audience.team_id', 'teams.id')
            .where({ 'teams.id': id })
            .first()

        if (!team)
            return res.status(404).json({
                errors: [{
                    msg: 'Team not found',
                    value: id
                }]
            })

        const members = await knex('teams')
            .leftJoin('teams_members', 'team_id', 'teams.id')
            .leftJoin('users', 'users.id', 'user_id')
            .select('users.id', 'name', 'surname', 'patronymic', url_constructor('small_photo'), 'team_role')
            .where({'teams.id': id})

        res.json({ team, members })
    }
}

module.exports = new TeamsController()
