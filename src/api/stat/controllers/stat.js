const { STAT } = require("../../../constants/models");
const { validatePassword } = require("../../../helpers");
const { BadRequestError } = require("../../../helpers/errors");

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController( STAT, ({ strapi }) => ({
    async find(ctx) {
        const { user } = ctx.state;
        const knex     = strapi.db.connection;

        const rawStats = await knex('stats')
            .join('stats_user_links', 'stats.id', 'stats_user_links.stat_id')
            .select(
                knex.raw('SUM(calls_made) as calls_made'),
                knex.raw('SUM(calls_answered) as calls_answered'),
                knex.raw('SUM(letters_made) as letters_made'),
                knex.raw('SUM(letters_answered) as letters_answered'),
                knex.raw('SUM(mls_offers_made) as mls_offers_made'),
                knex.raw('SUM(letters_offers_made) as letters_offers_made'),
                knex.raw('SUM(calls_offers_made) as calls_offers_made'),
                knex.raw('SUM(mls_offers_approved) as mls_offers_approved'),
                knex.raw('SUM(letters_offers_approved) as letters_offers_approved'),
                knex.raw('SUM(calls_offers_approved) as calls_offers_approved'),
                knex.raw('SUM(mls_offers_made + letters_offers_made + calls_offers_made) as offers_made'),
                knex.raw('SUM(mls_offers_approved + letters_offers_approved + calls_offers_approved) as offers_approved'),
                knex.raw('SUM(deals) as deals'),
                knex.raw('SUM(calls_investment + letters_investment) as investment'),
                knex.raw('SUM(mls_properties) as mls_properties'),
                knex.raw('SUM(calls_properties) as calls_properties'),
                knex.raw('SUM(letters_properties) as letters_properties'),
                knex.raw('SUM(calls_investment) as calls_investment'),
                knex.raw('SUM(letters_investment) as letters_investment'),
            )
            .where( 'stats_user_links.user_id', user.id );

        const stats = rawStats[0];

        return stats;
    },

    async create(ctx) {
        const data = ctx.request.body;
        const { user } = ctx.state;

        const newStat = await strapi.entityService.create( STAT, {
            data : {
                ...data,
                user : user.id,
            }
        });

        return newStat;
    },

    async reset(ctx) {
        const { user } = ctx.state;

        const userStats = await strapi.query(STAT).findMany({
            where : {
                user : user.id
            },
        });

        for (const stat of userStats) {
            await strapi.entityService.delete( STAT, stat.id );
        }

        return {
            status : "success",
            message : "All stats have been deleted"
        };
    },

    async changePassword(ctx) {
        const { user } = ctx.state;
        const data = ctx.request.body;

        const currentUser = await strapi.entityService.findOne( "plugin::users-permissions.user", user.id );

         if ( !validatePassword( data.newPassword, currentUser.password ) ) {
             throw new BadRequestError("Wrong password", {
                 key : "auth.wrongPassword",
                 path : ctx.request.path,
            });
         }

        const updatedUser = await strapi.entityService.update( "plugin::users-permissions.user", user.id, {
            data : {
                password : data.newPassword
            }
        });

        return updatedUser;
    },
}));
