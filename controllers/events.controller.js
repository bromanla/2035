const knex = require('../db')
const { url_constructor } = require('./entities')

class EventsController {
    /* Methods */
    list = async (req, res) => {
        const events = await knex('events')
            .select(
                'id',
                'event_name',
                'event_description',
                'event_start'
            )
            .where('completed', false)

        res.json(events);
    }

    byId = async (req, res) => {
        const { id } = req.params;

        const event = await knex('events')
            .select('id', 'event_name', 'event_description', 'event_start', 'event_end', 'completed')
            .where({'events.id': id})
            .first()

        if (!event)
            return res.status(404).json({error: {msg: 'Event not found', value: id}})

        const teams = await knex('events_teams')
            .leftJoin('teams', 'teams.id', 'team_id')
            .select('teams.id', 'team_name', 'team_description', url_constructor('team_icon'))
            .where('event_id', id)

        const guest = await knex('events_guests')
            .leftJoin('users', 'users.id', 'user_id')
            .select('users.id', 'role', 'name', 'surname', 'patronymic', url_constructor('small_photo'))
            .where('event_id', id)

        res.json({ event, teams, guest })
    }
}

module.exports = new EventsController()
