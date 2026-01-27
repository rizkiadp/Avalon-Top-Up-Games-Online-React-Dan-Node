const db = require("../models");
const Game = db.games;

const initialGames = [
    { id: 'genshin', name: 'Genshin Impact', category: 'RPG', image: 'https://images.unsplash.com/photo-1614680376573-df3483f0c6ff?auto=format&fit=crop&q=80&w=400', isHot: true, description: 'Explore the vast world of Teyvat and gather the elements.' },
    { id: 'valorant', name: 'Valorant', category: 'Shooter', image: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&q=80&w=400', discount: '-10%', description: 'Character-based tactical shooter from Riot Games.' },
    { id: 'mlbb', name: 'Mobile Legends', category: 'MOBA', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400', isHot: true, description: 'Join your friends in a brand new 5v5 MOBA showdown.' },
    { id: 'pubgm', name: 'PUBG Mobile', category: 'Battle Royale', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=400', description: 'The original battle royale, now on mobile.' },
    { id: 'freefire', name: 'Free Fire', category: 'Battle Royale', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=400', discount: '-15%', description: 'Fast-paced survival shooter on mobile.' },
];

const seed = async () => {
    try {
        await Game.bulkCreate(initialGames, { ignoreDuplicates: true });
        console.log("Variations seeded successfully.");
    } catch (error) {
        console.log("Error seeding:", error);
    }
};

module.exports = seed;
