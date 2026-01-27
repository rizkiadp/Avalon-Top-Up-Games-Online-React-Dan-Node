const Sequelize = require('sequelize');
const pg = require('pg');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.games = require("./game.model.js")(sequelize, Sequelize);
db.items = require("./item.model.js")(sequelize, Sequelize); // New
db.transactions = require("./transaction.model.js")(sequelize, Sequelize);

// Relations
db.games.hasMany(db.items, { as: "items" });
db.items.belongsTo(db.games, {
    foreignKey: "gameId",
    as: "game",
});

db.transactions.belongsTo(db.games, {
    foreignKey: "gameId",
    as: "game",
});
db.games.hasMany(db.transactions, {
    as: "transactions"
});

module.exports = db;
