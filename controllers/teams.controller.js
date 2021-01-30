const knex = require('../db');

class TeamsController {
    constructor () {
        this.getTeam = async (id) => knex('teams')
            .leftJoin('teams_members', 'teams_members.team_id', 'teams.id')
            .leftJoin('users', 'users.id', 'teams_members.user_id')
            .where('teams.id', id)
            .select([
                knex.ref('teams.id').as('team_id'),
                'team_name',
                'team_description',
                'customer',
                'team_role',
                'role',
                knex.ref('users.id').as('user_id'),
                'name',
                'surname',
                'patronymic',
                'small_photo'
            ])
    }

    /* Methods */
    root = async (req, res) => {
        const page = req.query.page ?? 1;
        const archive = req.query.archive ?? false;

        const teams = await knex('teams')
            .select('id', 'team_name',)
            .orderBy('team_name', 'asc')
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
        const rows = await this.getTeam(id)

        if (!rows.length)
            return res.status(404).json({error: {msg: 'Team not found', value: id}})

        const [ { team_id, team_name, team_description, customer } ] = rows;

        const members = rows.map(({user_id, name, surname, patronymic, team_role, small_photo}) => ({id: user_id, name, surname, patronymic, team_role, small_photo}))

        res.json({
            team: {
                team_id,
                team_name,
                team_description,
                customer
            },
            members
        })
    }
}

module.exports = new TeamsController()
