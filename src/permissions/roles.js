const { USER } = require("../constants/models");

const roles = {
    public : {
        permissions : {
            [USER] : {
                auth : ["login_Customer"],
            },
        },
        meta : {
            type        : "public",
            description : "public",
        },
    },
    customer : {
        permissions : {
            [USER] : [],
        },
        meta : {
            type        : "customer",
            description : "customer",
        },
    },
    "super-admin" : {
        permissions : {
            [USER] : [],
        },
        meta : {
            type        : "super-admin",
            description : "super-admin",
        },
    },
};

module.exports = roles;
