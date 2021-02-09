const knex = require('../db');
const { knex_small_photo } = require('./entities')
const sharp = require('sharp');
const { v4: uuid } = require('uuid');
const path = require('path');

const multer = require('multer')({
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: (req, file, callback) => {
        const extension = path.extname(file.originalname)

        if (['.jpg', 'jpeg', '.png', '.HEIC'].includes(extension))
            return callback(null, true)

        callback(new Error('Only images are allowed'))
    }
}).single('photo');

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
            .select(
                'users.id',
                'name',
                'surname',
                'patronymic',
                'role',
                knex_small_photo,
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

    uploadPhoto = async (req, res) => {
        const { id, role } = req.jwt;

        if (role !== 'moderator')
            return res.status(403).json({ error: {msg: 'No access rights to the method'}})

        /* Uploading a photo */
        multer(req, res, async (err) => {
            if (err) {
                return res.status(400).send({error: {msg: err.message}})
            }

            const image = req.file;

            try {
                /* Cropping and compressing */
                const { width, height } = await sharp(image.buffer).metadata()

                const fileName = uuid() + '.jpg'

                // Crop definition
                const size = (width < 512) || (height < 512)
                    ? width < height
                    ? width
                    : height
                    : 512

                await sharp(image.buffer)
                    .resize({
                        width: size,
                        height: size,
                        fit: sharp.fit.cover,
                        position: sharp.strategy.attention
                    })
                    .jpeg({
                        quality: 80
                    })
                    .toFile(`uploads/small_photo/${fileName}`)

                logger.debug(`Moderator #${id} uploaded an image (${fileName})`)

                res.json({
                    details: {
                        url: `${process.env.DOMAIN}/uploads/small_photo/${fileName}`
                    }
                })
            } catch (err) {
                res.status(400).json({error: {msg: err.message}})
            }
        })
    }
}

module.exports = new UsersController()
