module.exports = {
    routes: [
        {
            method: "DELETE",
            path: "/stats",
            handler: "stat.reset",
        },
        {
            method: "PATCH",
            path: "/password",
            handler: "stat.changePassword",
        },
    ],
};