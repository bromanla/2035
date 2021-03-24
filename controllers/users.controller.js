const bcrypt = require('bcryptjs')
const knex = require('../db')
const { url_constructor } = require('./modules/knex_constructor')

class UsersController {
    /* Functions */
    #removeUndefined = (obj) => {
        Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
        return obj
    }

    #getImage = async (id) => {
        const photo = await knex('upload_queue')
            .where({ id })
            .first()

        if (!photo)
            throw {
                errors: [{
                    msg: 'Photo not found in db', value: id
                }]
            }

        await knex('upload_queue')
            .where({ id })
            .del()

        return photo.file_name
    }

    /* Methods */
    list = async (req, res) => {
        const page = req.query.page ?? 1
        const role = req.query.role ?? false

        const builder = (builder) => {
            role && builder.where({role})
        }

        const users = await knex('users')
            .select('id', 'name', 'surname', 'patronymic', 'role', url_constructor('small_photo'))
            .offset((page - 1) * process.env.PER_PAGE)
            .limit(process.env.PER_PAGE)
            .where(builder)

        const [{ total_entries }] = await knex('users')
            .count('* as total_entries')
            .where(builder)

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
            .select('id', 'role', 'name', 'surname', 'patronymic', url_constructor('small_photo'), 'description', 'archive')
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
        const { jwt } = req;

        /**
        * Optional parameters: description, archive, photo_id
        **/
        const { username, password, role, name, surname, patronymic, photo_id, description, archive } = req.body

        // Getting and checking the image
        let small_photo = 'default.jpg'

        if (photo_id) {
            const photo = await knex('upload_queue')
                .where('id', photo_id)
                .first()

            if (!photo)
                return res.status(422).json({error : {msg: 'Photo not found in db', value: photo_id}})

            await knex('upload_queue')
                .where('id', photo.id)
                .del()

            small_photo = photo.file_name
        }

        // Adding to the database
        try {
            const [ id ] = await knex('users')
                .insert({
                    username,
                    password: bcrypt.hashSync(password, 10),
                    role,
                    name,
                    surname,
                    patronymic,
                    small_photo,
                    description,
                    archive
                })
                .returning('id')

            logger.debug(`Moderator #${jwt.id} created user (${id})`)

            res.json({
                msg: 'Ok',
                details: { id }
            })
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

            res.status(code).json({ errors: [{msg, value: username}] })
            logger.error(`User creation error: ${err}`)
        }
    }

    change = async (req, res) => {
        const { jwt } = req
        const { id } = req.params
        const { username, password, role, name, surname, patronymic, photo_id, description, archive } = req.body

        const data = this.#removeUndefined({ username, password, role, name, surname, patronymic, photo_id, description, archive })

        // Check image in database
        if (photo_id)
            try {
                delete data.photo_id
                data.small_photo = await this.#getImage(photo_id)
            } catch (err) {
                return res.status(422).json(err)
            }

        const count  = await knex('users')
            .update(data)
            .where({ id })

        if (!count)
            return res.status(404).json({
                errors: [{
                    msg: 'User not found',
                    value: id
                }]
            })

        res.json({ msg: 'Ok' })
        logger.debug(`Moderator #${jwt.id} changed user (${id})`)
    }

    delete = async (req, res) => {
        const { id } = req.params;

        const count = await knex('users')
            .del()
            .where({ id })

        if (!count)
            return res.status(404).json({
                errors: [{
                    msg: 'User not found',
                    value: id
                }]
            })

        res.json({ msg: 'Ok' })
        logger.debug(`Moderator #${jwt.id} delete user (${id})`)
    }
}

module.exports = new UsersController()
