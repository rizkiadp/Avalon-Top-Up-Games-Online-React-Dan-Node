const db = require("../models");
const Transaction = db.transactions;
const Op = db.Sequelize.Op;
const PaymentService = require('../services/payment.service');
const ProviderService = require('../services/provider.service');

// Create and Save a new Transaction
exports.create = async (req, res) => {
    if (!req.body.gameId || !req.body.userId) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    try {
        // 1. Create a Transaction in DB
        const transactionData = {
            id: `TXN-${Math.floor(Math.random() * 1000000)}`,
            gameId: req.body.gameId,
            gameName: req.body.gameName,
            item: req.body.item,
            amount: req.body.amount,
            price: req.body.price,
            status: "Pending",
            userId: req.body.userId,
            userGameId: req.body.userGameId
        };

        const transaction = await Transaction.create(transactionData);

        // 2. Request Midtrans Snap Token
        const paymentInfo = await PaymentService.createPayment(transaction);

        // 3. For Demo/Dev: Polling simulation (in prod use Webhooks)
        // We start a polling loop to check if user paid
        pollPaymentStatus(transaction.id);

        res.send({
            ...transaction.toJSON(),
            payment: paymentInfo
        });

    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Transaction."
        });
    }
};

// Internal function to poll payment status
const pollPaymentStatus = async (transactionId) => {
    let attempts = 0;
    const maxAttempts = 30; // 30 * 2s = 60s polling

    const interval = setInterval(async () => {
        attempts++;
        if (attempts > maxAttempts) {
            clearInterval(interval);
            return;
        }

        try {
            const transaction = await Transaction.findByPk(transactionId);
            if (!transaction || transaction.status !== 'Pending') {
                clearInterval(interval);
                return;
            }

            const paymentStatus = await PaymentService.checkStatus(transactionId);
            if (paymentStatus === 'PAID') {
                clearInterval(interval);

                // Update to Processing
                transaction.status = 'Processing';
                await transaction.save();
                console.log(`[System] Payment RECEIVED for ${transactionId}.`);

                // Trigger Provider (Apigames)
                try {
                    const providerResult = await ProviderService.processTopUp(transaction);
                    if (providerResult.success) {
                        transaction.status = 'Success';
                        await transaction.save();
                        console.log(`[System] Transaction ${transactionId} SUCCESS.`);
                    }
                } catch (provErr) {
                    transaction.status = 'Failed';
                    await transaction.save();
                    console.error(`[System] Provider Failed:`, provErr);
                }
            }
        } catch (error) {
            console.error("Polling Error:", error.message);
        }
    }, 2000);
};

exports.findAllByUser = (req, res) => {
    const userId = req.params.userId;
    Transaction.findAll({
        where: { userId: userId },
        order: [['createdAt', 'DESC']],
        include: ["game"]
    })
        .then(data => {
            // Map to include gameIcon flatly
            const results = data.map(t => {
                const json = t.toJSON();
                return {
                    ...json,
                    gameIcon: t.game ? t.game.image : null,
                    date: t.timestamp // Map timestamp to date for frontend compatibility
                };
            });
            res.send(results);
        })
        .catch(err => res.status(500).send({ message: err.message }));
};

// Retrieve all Transactions (Admin)
exports.findAll = (req, res) => {
    Transaction.findAll({
        order: [['createdAt', 'DESC']],
        include: ["game"]
    })
        .then(data => {
            const results = data.map(t => {
                const json = t.toJSON();
                return {
                    ...json,
                    gameIcon: t.game ? t.game.image : null,
                    date: t.timestamp
                };
            });
            res.send(results);
        })
        .catch(err => res.status(500).send({ message: err.message }));
};

// Get System Stats (Admin) - unchanged
exports.getStats = async (req, res) => {
    try {
        const totalRevenue = await Transaction.sum('price', { where: { status: 'Success' } });
        const totalOrders = await Transaction.count();
        const successOrders = await Transaction.count({ where: { status: 'Success' } });
        const successRate = totalOrders ? ((successOrders / totalOrders) * 100).toFixed(1) : 0;

        // Count active games
        const activeGames = await db.games.count();

        res.send({
            totalRevenue: totalRevenue || 0,
            totalOrders: totalOrders,
            successRate: successRate,
            activeGames: activeGames
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    Transaction.findByPk(id, { include: ["game"] })
        .then(data => {
            if (data) {
                const json = data.toJSON();
                res.send({
                    ...json,
                    gameIcon: data.game ? data.game.image : null,
                    date: data.timestamp
                });
            }
            else res.status(404).send({ message: `Cannot find Transaction with id=${id}.` });
        })
        .catch(err => res.status(500).send({ message: "Error retrieving Transaction with id=" + id }));
};
