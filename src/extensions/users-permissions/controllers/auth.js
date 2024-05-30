const {
    validateLogin,
} = require("../validation");

const {
    USER,
} = require("../../../constants/models");

const {
    findOneByAny,
    generateToken,
} = require("../../../helpers");

module.exports = (plugin) => {
    plugin.controllers.auth["login"] = async (ctx) => {
        const data = ctx.request.body;

        await validateLogin(data);
        
        const {
            email,
            password,
        } = data;

        const user = await findOneByAny(email, USER, "email");

        await plugin.services.validateUserContext(password, user);

        const TOKEN = generateToken({
            id : user.id,
        });

        return {
            token : TOKEN,
            user  : {
                uuid      : user.uuid,
                name      : user.name,
                lastName  : user.lastName,
                email     : user.email,
            },
        };
    };
};