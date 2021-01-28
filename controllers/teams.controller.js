const knex = require('../db');

class TeamsController {
    constructor () {
        this.getTeam = async (id) => knex('teams')
            .leftJoin(knex.ref('users').as('curators_tem'), 'teams.сurator_id', 'curators_tem.id')
            .leftJoin('curators', 'curators_tem.id', 'curators.user_id')
            .leftJoin(knex.ref('users').as('students_tem'), 'teams.leader_id', 'students_tem.id')
            .leftJoin('students', 'students_tem.id', 'students.user_id')
            .select({
                team_id: 'teams.id',
                team_name: 'teams.team_name',
                team_description: 'teams.team_description',
                leader_id: 'students.user_id',
                leader_name: 'students.name',
                leader_surname: 'students.surname',
                leader_patronymic: 'students.patronymic',
                curator_id: 'curators.user_id',
                curator_name: 'curators.name',
                curator_surname: 'curators.surname',
                curator_patronymic: 'curators.patronymic'
            })
            .where('teams.id', id)
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
        const [ team ] = await this.getTeam(id)

        if (!team)
            return res.status(404).json({error: {msg: 'Team not found', value: id}})

        res.json(team)
    }
}

module.exports = new TeamsController()
