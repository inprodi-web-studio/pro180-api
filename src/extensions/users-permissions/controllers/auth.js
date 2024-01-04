const {
    validateLogin,
    validateRegister,
    validateValidateCode,
    validateForgotPassword,
    validateResetPassword,
} = require("../validation");

const {
    USER,
} = require("../../../constants/models");

const {
    findOneByAny,
    generateToken,
    findOneByUuid,
    generateRandomCode,
} = require("../../../helpers");
const { BadRequestError } = require("../../../helpers/errors");

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

        const TOKEN = generateToken({
            id : user.id,
        });

        return {
            token : TOKEN,
            user  : {
                uuid     : user.uuid,
                name     : user.name,
                lastName : user.lastName,
                email    : user.email,
                phone    : user.phone,
            },
        };
    };

    plugin.controllers.auth["register_Customer"] = async (ctx) => {
        const data = ctx.request.body;

        await validateRegister(data);

        const {
            email,
        } = data;

        await plugin.services.checkForDuplicates(email);

        const { id : CUSTOMER_ROLE } = await strapi.query("plugin::users-permissions.role").findOne({
            where : {
                name : "customer",
            },
        });

        const code = generateRandomCode(4);

        const newUser = await strapi.entityService.create( USER, {
            data : {
                ...data,
                username          : email,
                role              : CUSTOMER_ROLE,
                confirmed         : false,
                blocked           : false,
                provider          : "local",
                confirmationToken : code,
            },
        });

        await plugin.services.sendCodeEmail(email, code, "register");

        return {
            uuid     : newUser.uuid,
            name     : newUser.name,
            lastName : newUser.lastName,
        };
    };

    plugin.controllers.auth["validateCode_Customer"] = async (ctx) => {
        const data = ctx.request.body;

        const { uuid } = ctx.params || {};

        await validateValidateCode( data );

        const { event } = data;

        const customer = await findOneByUuid( uuid, USER );

        await plugin.services.validateCode( data, customer );

        await strapi.entityService.update( USER, customer.id, {
            data : {
                confirmationToken  : null,
                resetPasswordToken : null,
                ...( event === "register" && {
                    confirmed : true
                }),
            }
        });

        return {
            token : generateToken( { id : customer.id } ),
        };
    };

    plugin.controllers.auth["forgotPassword_Customer"] = async (ctx) => {
        const data = ctx.request.body;

        await validateForgotPassword( data );

        const { email } = data;

        const customer = await findOneByAny( email, USER, "email" );

        const code = generateRandomCode(4);

        await strapi.entityService.update( USER, customer.id, {
            data : {
                resetPasswordToken : code,
            },
        });

        await plugin.services.sendCodeEmail( email, code, "reset" );

        return {
            message : "ok",
        };
    };

    plugin.controllers.auth["resetPassword_Customer"] = async (ctx) => {
        const data     = ctx.request.body;
        const customer = ctx.state.user;

        await validateResetPassword( data );

        const { password } = data;

        const updatedCustomer = await strapi.entityService.update( USER, customer.id, {
            data : {
                password           : password,
                resetPasswordToken : null,
            },
        });

        return {
            message : "ok",
        };
    }
};