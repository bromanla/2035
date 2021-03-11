const knex = require('../db')
const { url_constructor } = require('./entities')

class EventsController {
    /* Methods */
    list = async (req, res) => {
        const page = req.query.page ?? 1
        const completed = req.query.completed ?? false

        const events = await knex('events')
            .select('id', 'event_name', 'event_description', 'event_start')
            .orderBy('id', 'desc')
            .offset((page - 1) * process.env.PER_PAGE)
            .limit(process.env.PER_PAGE)
            .where({ completed })

        const [{ total_entries }] = await knex('events')
            .count('* as total_entries')
            .where({ completed })

        const total_pages = Math.ceil(total_entries / process.env.PER_PAGE);

        res.send({
            events,
            pagination: {
                current_page: +page,
                current_entries: events.length,
                total_entries: +total_entries,
                total_pages,
                per_page: +process.env.PER_PAGE
            }
        })
    }

    byId = async (req, res) => {
        const { id } = req.params

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
