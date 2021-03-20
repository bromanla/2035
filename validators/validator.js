const { validationResult } = require('express-validator')

class Validator {
    /**
    * Validation queue
    * @param {Array} handlers - Array of validation functions
    **/
    validate = validations => {
        return async (req, res, next) => {
            await Promise.all(validations.map(validation => validation.run(req)));

            const errors = validationResult(req);

            if (errors.isEmpty()) {
                return next();
            }

            logger.trace(errors.array())
            res.status(422).json({ errors: errors.array() })
        };
      };
}

module.exports = Validator
