module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        credits: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        role: {
            type: Sequelize.STRING,
            defaultValue: 'user' // 'user', 'admin'
        },
        avatar: {
            type: Sequelize.STRING
        },
        vipLevel: {
            type: Sequelize.STRING,
            defaultValue: 'Bronze'
        },
        otp: {
            type: Sequelize.STRING
        },
        otpExpires: {
            type: Sequelize.DATE
        },
        isVerified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });

    return User;
};
