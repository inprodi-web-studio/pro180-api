const { yup, validateYupSchema } = require("../../helpers/validators");

const loginSchema = yup.object().shape({
    email    : yup.string().email("Email must be a valid email").required("Email is required"),
    password : yup.string().required("Password is required"), 
}).noUnknown().strict();

module.exports = {
    validateLogin : validateYupSchema( loginSchema ),
};