const jwt = require('jsonwebtoken')
const knex = require('../db')
const { v4: uuid } = require('uuid')
const bcrypt = require('bcryptjs')

class AuthController {
    // Authorization users
    login = async (req, res) => {
        const { username, password } = req.body;

        const user = await knex('users')
            .select('id', 'username', 'password', 'role', 'archive')
            .where({username})
            .first()

        if (!user)
            return res.status(422).json({
                errors: [{
                    msg: 'User is not found'
                }]
            })

        if (user.archive)
            return res.status(422).json({
                errors: [{
                    msg: 'User is archived'
                }]
            })

        const isComparison = await bcrypt.compare(password, user.password);

        if (!isComparison)
            return res.status(422).json({
                errors: [{
                    msg: 'Incorrect password',
                    value: password,
                    param: 'password',
                    location: 'body'
                }]
            })

        await this.issueToken(req, res, user)
    }

    // Get a new tokens
    refresh = async (req, res) => {
        const { token } = req.body;

        const user = await knex('tokens')
            .select('users.id', 'expires_in', 'archive', knex.ref('tokens.id').as('token_id'))
            .leftJoin('users', 'user_id', 'users.id')
            .where({ token })
            .first()

        if (!user)
            return res.status(422).json({
                errors: [{
                    msg: 'Token not found',
                    value: token
                }]
            })

        if (user.archive)
            return res.status(422).json({
                errors: [{
                    msg: 'User is archived'
                }]
            })

        if (user.expires_in < Date.now())
            return res.status(422).json({
                errors: [{
                    msg: 'Token expired',
                    value: token
                }]
            })

        await knex('tokens')
            .where('id', user.token_id)
            .del()

        await this.issueToken(req, res, user)
    }

    // Logout this client
    logout = async (req, res) => {
        const { token } = req.body;

        const count = await knex('tokens')
            .where({token})
            .del()

        if (count === 0)
            return res.status(422).json({
                errors: [{
                    msg: 'Token not found',
                    value: token
                }]
            })

        res.json({msg: 'Ok'})
    }

    logoutAll = async (req, res) => {
        const { token } = req.body;

        const user = await knex('tokens')
            .leftJoin('users', 'users.id', 'user_id')
            .where({token})
            .select('users.id')
            .first()

        if (!user)
            return res.status(422).json({
                errors: [{
                    msg: 'Token not found',
                    value: token
                }]
            })

        const count = await knex('tokens')
            .where('user_id', user.id)
            .del()

        res.json({
            msg: 'Ok',
            details: { count }
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
