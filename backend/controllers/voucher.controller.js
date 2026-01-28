const db = require("../models");
const Voucher = db.Voucher;
const Game = db.games;

exports.create = async (req, res) => {
    try {
        const { code, gameId, discountPercent, maxUsage, expiresAt } = req.body;

        const voucher = await Voucher.create({
            code: code.toUpperCase(),
            gameId: gameId || null,
            discountPercent,
            maxUsage,
            expiresAt
        });

        res.send(voucher);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.findAll = async (req, res) => {
    try {
        const vouchers = await Voucher.findAll();
        // Enrich with game names if needed, or frontend handles it
        // Ideally we include the Game model
        // For now simple return
        res.send(vouchers);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Voucher.destroy({ where: { id: id } });
        res.send({ message: "Voucher deleted successfully!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.verify = async (req, res) => {
    try {
        const { code, gameId } = req.body;

        const voucher = await Voucher.findOne({ where: { code: code.toUpperCase() } });

        if (!voucher) {
            return res.status(404).send({ valid: false, message: "Voucher not found." });
        }

        if (voucher.currentUsage >= voucher.maxUsage) {
            return res.status(400).send({ valid: false, message: "Voucher usage limit reached." });
        }

        if (voucher.expiresAt && new Date() > new Date(voucher.expiresAt)) {
            return res.status(400).send({ valid: false, message: "Voucher expired." });
        }

        // Check Game restriction (if voucher has gameId, it must match)
        if (voucher.gameId && voucher.gameId != gameId) {
            // Fetch game name for better error message
            const game = await Game.findByPk(voucher.gameId);
            return res.status(400).send({ valid: false, message: `Voucher only valid for ${game ? game.name : 'specific game'}.` });
        }

        res.send({
            valid: true,
            voucher: {
                code: voucher.code,
                discountPercent: voucher.discountPercent,
                gameId: voucher.gameId,
                maxUsage: voucher.maxUsage,
                currentUsage: voucher.currentUsage
            },
            message: "Voucher Applied!"
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
