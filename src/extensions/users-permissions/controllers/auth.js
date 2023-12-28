const { USER } = require("../../../constants/models");
const { findOneByAny } = require("../../../helpers");
const { validateLogin } = require("../validation");

module.exports = (plugin) => {
    plugin.controllers.auth["login_Customer"] = async (ctx) => {
        const data = ctx.request.body;

        await validateLogin(data);
        
        const {
            email,
            password,
        } = data;

        const user = await findOneByAny(email, USER, "email");

        await plugin.services.validateUserContext(password, user);

        return user;
    }
};