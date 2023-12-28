const bcrypt = require("bcryptjs");

const { BadRequestError } = require("./errors");

const validatePassword = (password, hash) => {
    const ctx = strapi.requestContext.get();

    if ( bcrypt.compare(password, hash) ) {
        throw new BadRequestError( "Email / Password dont match", {
            key  : "auth.wrongCredentials",
            path : ctx.request.path, 
        });
    }
};

module.exports = validatePassword;