module.exports = (sequelize, Sequelize) => {
    const Voucher = sequelize.define("voucher", {
        code: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        gameId: {
            type: Sequelize.STRING,
            allowNull: true // If null, applies to all games (Global Voucher)
        },
        discountPercent: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        maxUsage: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 100
        },
        currentUsage: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        expiresAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    });

    return Voucher;
};
