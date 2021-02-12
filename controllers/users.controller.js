const bcrypt = require('bcryptjs');
const knex = require('../db');
const { knex_small_photo } = require('./entities');

class UsersController {
    constructor () {
        /**
        * Forming a response
        * @param {Express} res
        * @param {*} role - Role of the required user
        * @param {*} id - ID of the required user
        **/
        this.profileRouter = async (res, role, id) => {
            let row;

            switch (role) {
                case 'guest':
                    // Guest
                    break;
                case 'student':
                    [ row ] = await this.getProfileStudent(id)
                    break;
                case 'curator':
                    [ row ] = await this.getProfileCurator(id)
                    break;
                case 'moderator':
                    // Moderator
                    break;
            }

            res.json(row)
        }

        this.getProfileCurator = async (id) => knex('users')
            .leftJoin('curators', 'curators.user_id', 'users.id')
            .select('users.id', 'name', 'surname', 'patronymic', 'role', knex_small_photo, 'position')
            .where('user_id', id)

        this.getProfileStudent = async (id) => knex('users')
            .leftJoin('students', 'students.user_id', 'users.id')
            .leftJoin('groups', 'group_id', 'groups.id')
            .leftJoin('faculties', 'faculty_id', 'faculties.id')
            .leftJoin('universities', 'university_id', 'universities.id')
            .select('users.id', 'name', 'surname', 'patronymic', 'role', knex_small_photo, 'course', 'group_name', 'faculty_name', 'university_name', 'university_briefly')
            .where('users.id', id)
    }

    /* Methods */
    root = async (req, res) => {
        const { jwt } = req;

        await this.profileRouter(res, jwt.role, jwt.id);
    }

    byId = async (req, res) => {
        const { id } = req.params;

        const [ user ] = await knex('users')
            .where('id', id)
            .select('role')

        if (!user)
            return res.status(404).json({error: {msg: 'User not found', value: id}})

        await this.profileRouter(res, user.role, id);
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
