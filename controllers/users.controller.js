const bcrypt = require('bcryptjs')
const knex = require('../db')
const { url_constructor } = require('./entities')

class UsersController {
    /* Methods */
    list = async (req, res) => {
        const page = req.query.page ?? 1;
        const role = req.query.role ?? false;

        const users = await knex('users')
            .select('id', 'name', 'surname', 'patronymic', 'role', url_constructor('small_photo'))
            .offset((page - 1) * process.env.PER_PAGE)
            .limit(process.env.PER_PAGE)
            .where((builder) => {
                role && builder.where({role})
            })

        res.json({
            users,
            pagination: {
                current_page: +page,
                current_entries: users.length,
                per_page: +process.env.PER_PAGE
            }
        })
    }

    byId = async (req, res) => {
        const { id } = req.params;

        const user = await knex('users')
            .where({ id })
            .select('id', 'role', 'name', 'surname', 'patronymic', url_constructor('small_photo'))
            .first()

        if (!user)
            return res.status(404).json({error: {msg: 'User not found', value: id}})

        let extra = {};

        // Additional information
        switch (user.role) {
            case 'student':
                extra = await knex('students')
                    .leftJoin('groups', 'group_id', 'groups.id')
                    .leftJoin('faculties', 'faculty_id', 'faculties.id')
                    .leftJoin('universities', 'university_id', 'universities.id')
                    .select('course', 'group_name', 'faculty_name', 'university_name', 'university_briefly')
                    .where({user_id: id})
                    .first()

                break;
            case 'curator':
                extra = await knex('curators')
                    .select('position')
                    .where({user_id: id})
                    .first()

                break;
            case 'guest':
            case 'moderator':
                // In developing
                break;
            }

        res.json({
            ...user,
            ...extra
        })
    }

    create = async (req, res) => {
        const { jwt } = req;

        if (jwt.role !== 'moderator')
            return res.status(403).json({ error: {msg: 'No access rights to the method'}})

        const { username, password, role, name, surname, patronymic, photo_id} = req.body

        let small_photo = 'default.jpg'

        if (photo_id) {
            const [ photo ] = await knex('upload_queue').select().where('id', photo_id)

            if (!photo)
                return res.status(422).json({error : {msg: 'Photo not found in db', value: photo_id}})

            await knex('upload_queue')
                .where('id', photo.id)
                .del()

            small_photo = photo.file_name
        }

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
    }
}

module.exports = new UsersController()
