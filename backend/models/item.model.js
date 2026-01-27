module.exports = (sequelize, Sequelize) => {
    const GameItem = sequelize.define("game_item", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        gameId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING, // e.g. "10 Diamonds"
            allowNull: false
        },
        price: {
            type: Sequelize.INTEGER, // Sell Price
            allowNull: false
        },
        code: {
            type: Sequelize.STRING, // Provider SKU e.g. "KCIDMBL10"
            allowNull: false
        },
        bonus: {
            type: Sequelize.STRING // e.g. "HOT"
        }
    });

    return GameItem;
};
