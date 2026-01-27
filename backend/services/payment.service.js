const midtransClient = require('midtrans-client');

// Initialize Snap
const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY
});

// Initialize Core API (for checking status)
const coreApi = new midtransClient.CoreApi({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

exports.createPayment = async (transaction) => {
    console.log(`[Midtrans] Creating Snap Token for ${transaction.id}`);

    const parameter = {
        "transaction_details": {
            "order_id": transaction.id,
            "gross_amount": transaction.price
        },
        "credit_card": {
            "secure": true
        },
        "customer_details": {
            "first_name": transaction.userId,
            "email": "user@avalon.com", // Should be dynamic from user profile
        },
        "item_details": [{
            "id": transaction.item,
            "price": transaction.price,
            "quantity": 1,
            "name": `${transaction.gameName} - ${transaction.item}`
        }]
    };

    try {
        const transactionToken = await snap.createTransaction(parameter);
        console.log(`[Midtrans] Token created: ${transactionToken.token}`);

        return {
            token: transactionToken.token,
            redirect_url: transactionToken.redirect_url
        };
    } catch (e) {
        console.error(`[Midtrans] Error creating transaction:`, e.message);
        throw new Error("Payment Gateway Error");
    }
};

exports.checkStatus = async (transactionId) => {
    try {
        console.log(`[Midtrans] Checking status for ${transactionId}`);
        const statusResponse = await coreApi.transaction.status(transactionId);

        console.log(`[Midtrans] Status Payload:`, statusResponse.transaction_status);

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

        return orderStatus;

    } catch (e) {
        if (e.message.includes('404') || (e.response && e.response.data && e.response.data.status_code == '404')) {
            // Transaction not found in Core API yet implies Pending/New
            return 'PENDING';
        }
        console.error(`[Midtrans] Check Status Error:`, e.message);
        return 'PENDING';
    }
};
