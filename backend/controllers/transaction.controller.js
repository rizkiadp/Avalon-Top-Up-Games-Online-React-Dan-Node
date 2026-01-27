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
    Transaction.findAll({ where: { userId: userId }, order: [['createdAt', 'DESC']] })
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message }));
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    Transaction.findByPk(id)
        .then(data => {
            if (data) res.send(data);
            else res.status(404).send({ message: `Cannot find Transaction with id=${id}.` });
        })
        .catch(err => res.status(500).send({ message: "Error retrieving Transaction with id=" + id }));
};
