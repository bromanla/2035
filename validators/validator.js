class Validator {
    /**
    * Synchronous validation queue
    * @param {Express} req
    * @param {Express} res
    * @param {Express} next
    * @param {Array} handlers - Array of validation functions
    **/
    validationQueue = async (req, res, next, handlers) => {
        try {
            for (const validator of handlers) {
                const validateResult = await validator(req);

                if (!validateResult.isEmpty())
                    throw validateResult.errors
            }

            next()
        } catch (errors) {
            const [ error ] = errors;
            logger.debug(error)

            res.status(422).json({ error })
        }
    }
}

module.exports = Validator
