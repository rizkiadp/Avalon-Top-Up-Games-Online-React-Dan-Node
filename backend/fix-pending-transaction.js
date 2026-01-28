const db = require('./models');
const Transaction = db.transactions;
const PaymentService = require('./services/payment.service');
const ProviderService = require('./services/provider.service');
const { logAction } = require('./services/logger');
require('dotenv').config();

const transactionId = 'TXN-941681';

async function fixTransaction() {
    try {
        console.log('Connecting to database...');
        await db.sequelize.authenticate();
        console.log('Database connected.');

        const transaction = await Transaction.findByPk(transactionId);

        if (!transaction) {
            console.log(`Transaction ${transactionId} not found!`);
            return;
        }

        console.log(`Checking status for ${transactionId} (Current: ${transaction.status})...`);
        const paymentStatus = await PaymentService.checkStatus(transactionId);
        console.log(`Payment Status from Midtrans: ${paymentStatus}`);

        if (paymentStatus === 'PAID') {
            console.log('Updating transaction status in DB...');

            // Update to Processing
            transaction.status = 'Processing';
            await transaction.save();
            console.log(`[System] Payment RECEIVED for ${transactionId}.`);
            await logAction(transaction.userId, "system", "PAYMENT_RECEIVED_FIX", `Payment received for ${transactionId}`);

            // Trigger Provider (Apigames)
            try {
                console.log('Triggering Provider Service...');
                // Note: ProviderService might fail if API credentials are invalid or balance is low, 
                // but we should at least try to mark it pending/success based on logic.
                const providerResult = await ProviderService.processTopUp(transaction);
                console.log('Provider Result:', providerResult);

                if (providerResult.success) {
                    transaction.status = 'Success';
                    await transaction.save();
                    console.log(`[System] Transaction ${transactionId} SUCCESS.`);
                    await logAction(transaction.userId, "system", "TRANSACTION_SUCCESS_FIX", `Topup success for ${transactionId}`);
                } else {
                    console.log('Provider returned success=false');
                }
            } catch (provErr) {
                transaction.status = 'Failed';
                await transaction.save();
                console.error(`[System] Provider Failed:`, provErr.message);
            }
        } else {
            console.log(`Payment status is ${paymentStatus}, not PAID. No action taken.`);
        }

    } catch (error) {
        console.error('Script Error:', error);
    } finally {
        console.log('Closing database connection...');
        await db.sequelize.close();
        console.log('Done.');
    }
}

fixTransaction();
