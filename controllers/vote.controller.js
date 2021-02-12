const knex = require('../db');

class VoteController {
    /* Methods */
    guest = async (req, res) => {
        const { jwt } = req;

        if (jwt.role !== 'guest')
            return res.status(403).json({ error: {msg: 'No access rights to the method'}})

        // const guest = await knex('events_guests')
        //     .select()
        //     .where({
        //         event_id: id,
        //         user_id: jwt.id
        //     })

        res.json('Гость');
    }

    audience = async (req, res) => {
        const { jwt } = req;
        const { id } = req.params;

        if (jwt.role === 'guest')
            return res.status(403).json({ error: {msg: 'No access rights to the method'}})

        const [ event ] = await knex('events').select('completed').where({id});

        if (!event)
            return res.status(404).json({error: {msg: 'Event not found', value: id}})

        if (event.completed)
            return res.status(400).json({error: {msg: 'Event ended', value: id}})

        //TODO: check voice

        res.json('Зрительское голосование');
    }
}

module.exports = new VoteController()
