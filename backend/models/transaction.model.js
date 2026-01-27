module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define("transaction", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        gameId: {
            type: Sequelize.STRING
        },
        gameName: {
            type: Sequelize.STRING
        },
        item: {
            type: Sequelize.STRING // e.g., "60 Gems"
        },
        amount: {
            type: Sequelize.STRING // e.g., "Rp 15.000"
        },
        price: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.STRING, // Pending, Success, Failed
            defaultValue: 'Pending'
        },
        userId: {
            type: Sequelize.STRING
        },
        userGameId: {
            type: Sequelize.STRING // The ID of the user inside the game
        },
        timestamp: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    });

    return Transaction;
};
