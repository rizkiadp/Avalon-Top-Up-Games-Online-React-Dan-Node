module.exports = (sequelize, Sequelize) => {
    const Banner = sequelize.define("banner", {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        imageUrl: {
            type: Sequelize.TEXT, // Using TEXT to support long URLs
            allowNull: false
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        actionUrl: {
            type: Sequelize.STRING,
            allowNull: true
        }
    });

    return Banner;
};
