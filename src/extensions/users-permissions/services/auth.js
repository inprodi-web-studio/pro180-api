const { validatePassword } = require("../../../helpers");

module.exports = (plugin) => {
    plugin.services.validateUserContext = async (password, user) => {
        await validatePassword( password, user.password );

        if ( user.confirmed ) {

        }
    };
};