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
            let row

            switch (role) {
                case 0:
                    // Guest
                    break;
                case 1:
                    [ row ] = await this.getProfileStudent(id)
                    break;
                case 2:
                    [ row ] = await this.getProfileCurator(id)
                    break;
                case 3:
                    // Moderator
                    break;
            }

            res.json(row)
        }

        this.getProfileCurator = async (id) => knex('users')
            .leftJoin('curators', 'users.id', 'user_id')
            .select('role', 'name', 'surname', 'patronymic', 'position')
            .where('users.id', id)

        this.getProfileStudent = async (id) => knex('users')
            .leftJoin('students', 'users.id', 'user_id')
            .leftJoin('groups', 'group_id', 'groups.id')
            .leftJoin('faculties', 'faculty_id', 'faculties.id')
            .leftJoin('universities', 'university_id', 'universities.id')
            .select('role', 'name', 'surname', 'patronymic', 'course', 'group_name', 'faculty_name', 'university_name', 'university_briefly')
            .where('users.id', id)
    }

    /* Methods */
    root = async (req, res) => {
        const { jwt } = req;

        await this.profileRouter(res, jwt.role, jwt.id);
    }

    profile = async (req, res) => {
        const { id } = req.params;

        const [ row ] = await knex('users')
            .where('id', id)
            .select('role')

        if (!row)
            return res.status(404).json({error: 'User is not found'})

        await this.profileRouter(res, row.role, id);
    }
}

module.exports = new ProfileController()
