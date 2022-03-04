const {Sequelize} = require('sequelize');
module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        retry: {
            match: [/Deadlock/i],
            max: 3, // Maximum retry 3 times
            backoffBase: 1000, // Initial backoff duration in ms. Default: 100,
            backoffExponent: 1.5, // Exponent to increase backoff each try. Default: 1.1
        },
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    }
);