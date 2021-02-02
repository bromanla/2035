const knex = require('../db');

class ProfileController {
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
            .select(
                'users.id',
                'name',
                'surname',
                'patronymic',
                'role',
                knex.ref(knex.raw(`'${process.env.DOMAIN}/uploads/'||small_photo`)).as('small_photo'),
                'position'
            )
            .where('user_id', id)

        this.getProfileStudent = async (id) => knex('users')
            .leftJoin('students', 'students.user_id', 'users.id')
            .leftJoin('groups', 'group_id', 'groups.id')
            .leftJoin('faculties', 'faculty_id', 'faculties.id')
            .leftJoin('universities', 'university_id', 'universities.id')
            .select(
                'users.id',
                'name',
                'surname',
                'patronymic',
                'role',
                knex.ref(knex.raw(`'${process.env.DOMAIN}/uploads/small_photo/'||small_photo`)).as('small_photo'),
                'course',
                'group_name',
                'faculty_name',
                'university_name',
                'university_briefly'
            )
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
}

module.exports = new ProfileController()
