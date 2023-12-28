const authRoutes      = require("./routes/auth");
const authServices    = require("./services/auth");
const authControllers = require("./controllers/auth");

module.exports = ( plugin ) => {
    authRoutes(plugin);

    authServices(plugin);

    authControllers(plugin);

    return plugin;
};