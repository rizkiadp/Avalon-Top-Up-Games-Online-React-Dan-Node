const midtransClient = require('midtrans-client');
const fs = require('fs');
require('dotenv').config();

const coreApi = new midtransClient.CoreApi({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

const transactionId = 'TXN-941681';

async function checkStatus() {
    console.log(`Checking status for ${transactionId}...`);

    try {
        const response = await coreApi.transaction.status(transactionId);
        const output = `
--- Full Midtrans Response ---
${JSON.stringify(response, null, 2)}
------------------------------
Transaction Status: ${response.transaction_status}
Fraud Status: ${response.fraud_status}
Payment Type: ${response.payment_type}
`;
        console.log(output);
        fs.writeFileSync('debug_result.txt', output);
        console.log('Result saved to debug_result.txt');

    } catch (error) {
        console.error('Error fetching status:', error.message);
        if (error.response) {
            const errOutput = `API Error: ${JSON.stringify(error.response.data, null, 2)}`;
            console.error(errOutput);
            fs.writeFileSync('debug_result.txt', errOutput);
        }
    }
}

checkStatus();
