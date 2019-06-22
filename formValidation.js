const Joi = require('@hapi/joi');

//Validate user registration data
const registerValidate = (data) => {
    const schema = {
        firstName: Joi.string()
            .required(),
        lastName: Joi.string()
            .required(),
        email: Joi.string()
            .max(255)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .regex(/^(?=.*\d).{6,30}$/)
            .required()
    };
    return Joi.validate(data, schema);
}

//Validate user login data
const loginValidate = (data) => {
    const schema = {
        email: Joi.string()
            .max(255)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .regex(/^(?=.*\d).{6,30}$/)
            .required()
    };
    return Joi.validate(data, schema);
}

module.exports.registerValidate = registerValidate;
module.exports.loginValidate = loginValidate;