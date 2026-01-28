module.exports = (sequelize, Sequelize) => {
    const Log = sequelize.define("log", {
        userId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        action: {
            type: Sequelize.STRING,
            allowNull: false
        },
        details: {
            type: Sequelize.TEXT, // Using TEXT to store JSON string or long messages
            allowNull: true
        },
        ip: {
            type: Sequelize.STRING,
            allowNull: true
        }
    });

    return Log;
};
