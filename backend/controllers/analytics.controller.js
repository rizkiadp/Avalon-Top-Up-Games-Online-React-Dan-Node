const db = require('../models');
const DailyStats = db.DailyStats;
const { Op } = require('sequelize');

exports.trackVisit = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Find or create stats for today
        const [stats, created] = await DailyStats.findOrCreate({
            where: { date: today },
            defaults: { visits: 1 }
        });

        if (!created) {
            await stats.increment('visits');
        }

        res.json({ message: 'Visit tracked', stats });
    } catch (error) {
        console.error("Error tracking visit:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getTrafficData = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const stats = await DailyStats.findAll({
            where: {
                date: {
                    [Op.gte]: sevenDaysAgo.toISOString().split('T')[0]
                }
            },
            order: [['date', 'ASC']]
        });

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
