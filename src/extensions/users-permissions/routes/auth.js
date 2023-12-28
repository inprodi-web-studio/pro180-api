module.exports = ( plugin ) => {
    plugin.routes["content-api"].routes.push({
        method  : "POST",
        path    : "/customer/auth/login",
        handler : "auth.login_Customer",
        config  : {
            prefix : "",
        },
    });
}