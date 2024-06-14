module.exports = {
    routes: [
        {
            method: "PATCH",
            path: "/password",
            handler: "stat.changePassword",
        },
    ],
};