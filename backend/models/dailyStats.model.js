const { DataTypes } = require('sequelize');
// const { sequelize } = require('./index'); // Circular dependency fix

module.exports = (sequelize, DataTypes) => {
    const DailyStats = sequelize.define('DailyStats', {
        date: {
            type: DataTypes.DATEONLY,
            primaryKey: true,
            allowNull: false
        },
        visits: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        orders: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        revenue: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        }
    });

    return DailyStats;
};
