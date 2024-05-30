module.exports = ( plugin ) => {
    plugin.routes["content-api"].routes.push({
        method  : "POST",
        path    : "/auth/login",
        handler : "auth.login",
        config  : {
            prefix : "",
        },
    });
}