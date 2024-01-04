const bcrypt = require("bcryptjs");

const { BadRequestError } = require("./errors");

const validatePassword = async (password, hash) => {
    const ctx = strapi.requestContext.get();

    const isValidPassword = await bcrypt.compareSync( password, hash );

    if ( !isValidPassword ) {
        throw new BadRequestError( "Email / Password dont match", {
            key  : "auth.wrongCredentials",
            path : ctx.request.path, 
        });
    }
};

module.exports = validatePassword;