const db = require("../models");
const Transaction = db.transactions;
const Op = db.Sequelize.Op;
const PaymentService = require('../services/payment.service');
const ProviderService = require('../services/provider.service');
const { logAction } = require('../services/logger');

// Create and Save a new Transaction
exports.create = async (req, res) => {
    if (!req.body.gameId || !req.body.userId) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    try {
        let finalPrice = req.body.price;
        let finalAmount = req.body.amount;
        let appliedVoucher = null;

        // 1. Check Voucher if provided
        if (req.body.voucherCode) {
            const voucher = await db.vouchers.findOne({ where: { code: req.body.voucherCode } });
            if (voucher) {
                // Verify Validity
                const isValid = (!voucher.gameId || voucher.gameId == req.body.gameId) &&
                    (voucher.currentUsage < voucher.maxUsage) &&
                    (!voucher.expiresAt || new Date(voucher.expiresAt) > new Date());

                if (isValid) {
                    const discount = Math.floor(finalPrice * (voucher.discountPercent / 100));
                    finalPrice = finalPrice - discount;
                    finalAmount = `Rp ${finalPrice.toLocaleString()}`;
                    appliedVoucher = voucher;
                }
            }
        }

        // 2. Create a Transaction in DB
        const transactionData = {
            id: `TXN-${Math.floor(Math.random() * 1000000)}`,
            gameId: req.body.gameId,
            gameName: req.body.gameName,
            item: req.body.item,
            amount: finalAmount, // Updated amount string
            price: finalPrice,   // Updated price number
            status: "Pending",
            userId: req.body.userId,
            userGameId: req.body.userGameId,
            voucherCode: req.body.voucherCode // Optional: Store code in transaction if desired, current schema might not have it, but useful for logs
        };

        const transaction = await Transaction.create(transactionData);

        // 3. Increment Voucher Usage
        if (appliedVoucher) {
            await appliedVoucher.increment('currentUsage');
        }

        // 4. Request Midtrans Snap Token
        const paymentInfo = await PaymentService.createPayment(transaction);

        // 5. For Demo/Dev: Polling simulation (in prod use Webhooks)
        // We start a polling loop to check if user paid
        pollPaymentStatus(transaction.id);

        res.send({
            ...transaction.toJSON(),
            payment: paymentInfo
        });

        await logAction(req.body.userId, "user" + req.body.userId, "CREATE_TRANSACTION", `Created transaction ${transaction.id} for ${transaction.item} (Price: ${finalPrice})`, req);

    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Transaction."
        });
    }
};

// Internal function to poll payment status
const pollPaymentStatus = async (transactionId) => {
    let attempts = 0;
    const maxAttempts = 150; // 150 * 2s = 300s (5 minutes) polling

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
                await logAction(transaction.userId, "system", "PAYMENT_RECEIVED", `Payment received for ${transactionId}`);

                // Trigger Provider (Apigames)
                try {
                    const providerResult = await ProviderService.processTopUp(transaction);
                    if (providerResult.success) {
                        transaction.status = 'Success';
                        await transaction.save();
                        console.log(`[System] Transaction ${transactionId} SUCCESS.`);
                        await logAction(transaction.userId, "system", "TRANSACTION_SUCCESS", `Topup success for ${transactionId}`);
                    }
                } catch (provErr) {
                    transaction.status = 'Failed';
                    await transaction.save();
                    console.error(`[System] Provider Failed:`, provErr);
                    await logAction(transaction.userId, "system", "TRANSACTION_FAILED", `Provider failed for ${transactionId}: ${provErr.message}`);
                }
            }
        } catch (error) {
            console.error("Polling Error:", error.message);
        }
    }, 2000);
};

// Handle Midtrans Notification (Webhook)
exports.notification = async (req, res) => {
    try {
        const statusResponse = req.body;
        console.log(`[Midtrans] Notification received for ${statusResponse.order_id}`);
        console.log(`[Midtrans] Status: ${statusResponse.transaction_status}, Fraud: ${statusResponse.fraud_status}`);

        const transactionId = statusResponse.order_id;
        const transaction = await Transaction.findByPk(transactionId);

        if (!transaction) {
            return res.status(404).send({ message: "Transaction not found" });
        }

        // If already success/failed, ignore
        if (transaction.status === 'Success' || transaction.status === 'Failed') {
            return res.status(200).send({ message: "Transaction already processed" });
        }

        let orderStatus = 'PENDING';
        if (statusResponse.transaction_status == 'capture') {
            if (statusResponse.fraud_status == 'challenge') {
                orderStatus = 'CHALLENGE';
            } else if (statusResponse.fraud_status == 'accept') {
                orderStatus = 'PAID';
            }
        } else if (statusResponse.transaction_status == 'settlement') {
            orderStatus = 'PAID';
        } else if (statusResponse.transaction_status == 'cancel' ||
            statusResponse.transaction_status == 'deny' ||
            statusResponse.transaction_status == 'expire') {
            orderStatus = 'FAILED';
        } else if (statusResponse.transaction_status == 'pending') {
            orderStatus = 'PENDING';
        }

        if (orderStatus === 'PAID') {
            // Update to Processing
            transaction.status = 'Processing';
            await transaction.save();
            console.log(`[Webhook] Payment CONFIRMED for ${transactionId}.`);
            await logAction(transaction.userId, "system", "PAYMENT_RECEIVED_WEBHOOK", `Payment received for ${transactionId}`);

            // Trigger Provider (Apigames)
            try {
                const providerResult = await ProviderService.processTopUp(transaction);
                if (providerResult.success) {
                    transaction.status = 'Success';
                    await transaction.save();
                    console.log(`[Webhook] Transaction ${transactionId} SUCCESS.`);
                    await logAction(transaction.userId, "system", "TRANSACTION_SUCCESS", `Topup success for ${transactionId}`);
                }
            } catch (provErr) {
                transaction.status = 'Failed';
                await transaction.save();
                console.error(`[Webhook] Provider Failed:`, provErr);
                await logAction(transaction.userId, "system", "TRANSACTION_FAILED", `Provider failed for ${transactionId}: ${provErr.message}`);
            }
        } else if (orderStatus === 'FAILED') {
            transaction.status = 'Failed';
            await transaction.save();
            await logAction(transaction.userId, "system", "TRANSACTION_FAILED", `Payment failed for ${transactionId}`);
        }

        res.status(200).send({ message: "OK" });

    } catch (error) {
        console.error("[Midtrans] Notification Error:", error.message);
        res.status(500).send({ message: error.message });
    }
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

// Delete a Transaction with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Transaction.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Transaction was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Transaction with id=${id}. Maybe Transaction was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Transaction with id=" + id
            });
        });
};
