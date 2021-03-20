const bcrypt = require('bcryptjs')
const knex = require('../db')
const { url_constructor } = require('./entities')

class UsersController {
    /* Methods */
    list = async (req, res) => {
        const page = req.query.page ?? 1
        const role = req.query.role ?? false

        const users = await knex('users')
            .select('id', 'name', 'surname', 'patronymic', 'role', url_constructor('small_photo'))
            .offset((page - 1) * process.env.PER_PAGE)
            .limit(process.env.PER_PAGE)
            .where((builder) => {
                role && builder.where({role})
            })

        const [{ total_entries }] = await knex('users')
            .count('* as total_entries')
            .where((builder) => {
                role && builder.where({role})
            })

        const total_pages = Math.ceil(total_entries / process.env.PER_PAGE);

        res.json({
            users,
            pagination: {
                current_page: +page,
                current_entries: users.length,
                total_entries: +total_entries,
                total_pages,
                per_page: +process.env.PER_PAGE
            }
        })
    }

    byId = async (req, res) => {
        const { id } = req.params

        const user = await knex('users')
            .where({ id })
            .select('id', 'role', 'name', 'surname', 'patronymic', url_constructor('small_photo'), 'description')
            .first()

        if (!user)
            return res.status(404).json({
                errors: [{
                    msg: 'User not found',
                    value: id
                }]
            })

        res.json(user)
    }

    create = async (req, res) => {
        return res.send('okes')
        const { jwt } = req;
        const { username, password, role, name, surname, patronymic, photo_id} = req.body

        let small_photo = 'default.jpg'

        if (photo_id) {
            const photo = await knex('upload_queue')
                .select()
                .where('id', photo_id)
                .first()

            if (!photo)
                return res.status(422).json({error : {msg: 'Photo not found in db', value: photo_id}})

            await knex('upload_queue')
                .where('id', photo.id)
                .del()

            small_photo = photo.file_name
        }

        try {
            const [ id ] = await knex('users')
                .insert({
                    username,
                    password: bcrypt.hashSync(password, 10),
                    role,
                    name,
                    surname,
                    patronymic,
                    small_photo
                })
                .returning('id')

            logger.debug(`Moderator #${jwt.id} created user (${id})`)

            res.json({details: {id}})
        } catch (err) {
            let code = 500,
                msg = 'The server cannot handle the error';

            switch (err.code) {
                case '23505':
                    code = 422
                    msg = 'Duplicate username'
                default:
                    break;
            }

            return res.status(code).json({error : {msg, value: username}})
        }
    }

    change = async (req, res) => {
        const { jwt } = req;
        const { id } = req.params;
        const { name, surname, patronymic, password, role } = req.body

        const obj = { name, surname, patronymic, password, role }

        Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])

        res.send(id)
    }
}

module.exports = new UsersController()
