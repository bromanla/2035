const
    jwt = require('jsonwebtoken'),
    knex = require('../db'),
    { v4: uuid } = require('uuid');

class AuthController {
    // Authorization users
    login = async (req, res) => {
        const { user } = req;

        await this.issueToken(req, res, user)
    }

    // Get a new tokens
    refresh = async (req, res) => {
        const { user } = req;

        await knex('tokens')
            .where('id', user.token_id)
            .del()

        await this.issueToken(req, res, user)
    }

    // Logout all devices
    logout = async (req, res) => {
        const { user } = req;

        const delCount = await knex('tokens')
            .where('user_id', user.id)
            .del()

        res.json({
            msg: 'Ok',
            details: { delCount }
        })
    }

    issueToken = async (req, res, user) => {
        const agent = req.headers['user-agent'] || 'Undefined';
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress

        const user_id = user.id;
        const token = uuid();
        const expires_in = Date.now() + 1000 * 60 * 60 * 24 * 90; // 90 days in milliseconds

        await knex('tokens').insert({user_id, token, agent, ip, expires_in})

        const payload = {
            id: user.id,
            role: user.role
        }

        res.json({
            jwt: jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRES,
                    algorithm: process.env.JWT_ALGORITHM
                }),
            token: token
        })
    }
}

module.exports = new AuthController()
