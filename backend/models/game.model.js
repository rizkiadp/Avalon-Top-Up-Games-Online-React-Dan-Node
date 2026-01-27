module.exports = (sequelize, Sequelize) => {
    const Game = sequelize.define("game", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        category: {
            type: Sequelize.STRING
        },
        image: {
            type: Sequelize.TEXT
        },
        brand: {
            type: Sequelize.STRING, // Provider Game Code (e.g. 'mobilelegend')
            allowNull: true
        },
        isHot: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        discount: {
            type: Sequelize.STRING // e.g., "-10%"
        },
        description: {
            type: Sequelize.TEXT
        }
    });

    return Game;
};
