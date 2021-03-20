const knex = require('../db')

class VoteController {
    /* Methods */
    // guest = async (req, res) => {
    //     const { jwt } = req;

    //     if (jwt.role !== 'guest')
    //         return res.status(403).json({ error: {msg: 'No access rights to the method'}})

    //     res.json('Гость');
    // }

    audience = async (req, res) => {
        const { jwt } = req
        const { id } = req.params
        const { vote } = req.body

        const alreadyVoted = await knex('vote_audience')
            .where({
                user_id: jwt.id,
                team_id: id
            })
            .first()

        if (alreadyVoted)
            return res.status(409).json({
                errors: [{
                    msg: 'Already voted',
                    value: id
                }]
            })

        const team = await knex('teams')
            .where({ id })
            .first()

        if (!team)
            return res.status(404).json({
                errors: [{
                    msg: 'Team not found',
                    value: id
                }]
            })

        await knex('vote_audience')
            .insert({
                user_id: jwt.id,
                team_id: id,
                vote
            })

        res.json({ msg: 'Ok' });
    }
}

module.exports = new VoteController()
