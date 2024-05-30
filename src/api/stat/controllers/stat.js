const { STAT } = require("../../../constants/models");

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
}));
