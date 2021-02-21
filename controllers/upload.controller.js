const knex = require('../db')
const { url_constructor } = require('./entities')
const sharp = require('sharp')
const { v4: uuid } = require('uuid')
const path = require('path')

const multer = require('multer')({
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: (req, file, callback) => {
        const extension = path.extname(file.originalname)

        if (['.jpg', 'jpeg', '.png', '.HEIC'].includes(extension))
            return callback(null, true)

        callback(new Error('Only images are allowed'))
    }
}).single('photo');

class UploadController {
    /* Methods */
    usersList = async (req, res) => {
        const photos = await knex('upload_queue')
            .select('id', 'file_name', url_constructor('file_name', 'small_photo'))
            .where({type: 'small_photo'})

        res.json(photos)
    }

    usersPhoto = async (req, res) => {
        const { id } = req.jwt;

        /* Uploading a photo */
        multer(req, res, async (err) => {
            if (err)
                return res.status(400).send({error: {msg: err.message}})

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

                // List of files
                const [ photo_id ] = await knex('upload_queue')
                    .insert({
                        type: 'small_photo',
                        file_name: fileName,
                        uploaded_by: id
                    })
                    .returning('id')

                logger.debug(`Moderator #${id} uploaded an image (${fileName})`)

                res.json({
                    details: {
                        url: `${process.env.DOMAIN}/uploads/small_photo/${fileName}`,
                        photo_id
                    }
                })
            } catch (err) {
                res.status(400).json({error: {msg: err.message}})
            }
        })
    }
}

module.exports = new UploadController()
