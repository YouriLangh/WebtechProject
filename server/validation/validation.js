const Joi = require('joi');
//Register Validation
const registerValidation = data => {
    const schema = Joi.object({
        username: Joi.string()
        .min(4)
        .alphanum()
        .required()
        .max(20)
        .label("username"),
        email: Joi.string()
        .label("email")
        .required()
        .email(),
        password: Joi.string()
        .label("password")
        .required()
        .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,24}$/))

    })
    return schema.validate(data);
}

const loginValidation = data => {
    const schema = Joi.object({
        username: Joi.string()
        .min(4)
        .alphanum()
        .required()
        .label("username"),
        password: Joi.string()
        .label("password")
        .required()
        .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,24}$/))
    })
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;

module.exports.loginValidation = loginValidation;