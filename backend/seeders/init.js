const db = require("../models");
const User = db.users;
const Game = db.games;

const initialGames = [];

const seed = async () => {
    try {
        // Seed Games
        const gameCount = await Game.count();
        if (gameCount === 0) {
            await Game.bulkCreate(initialGames, { ignoreDuplicates: true });
            console.log("Games seeded successfully.");
        }

        // Seed Admin User
        const userCount = await User.count({ where: { role: 'Admin' } });
        if (userCount === 0) {
            await User.create({
                username: "admin",
                email: "admin@avalon.com",
                password: "admin", // Plain text as per current config
                role: "Admin",
                credits: 999999999,
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
                vipLevel: "God Mode",
                isVerified: true
            });
            console.log("Admin user seeded successfully.");
        }
    } catch (error) {
        console.log("Error seeding:", error);
    }
};

module.exports = seed;
