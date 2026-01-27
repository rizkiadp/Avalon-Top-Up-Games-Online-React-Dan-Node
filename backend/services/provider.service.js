const axios = require('axios');
const crypto = require('crypto');

// APIGAMES Configuration
const APIGAMES_ENDPOINT = 'https://v1.apigames.id/v2/transaksi';
// Check Username URL Base - Dynamic parts will be added in function
const APIGAMES_BASE_URL = 'https://v1.apigames.id/merchant';

const MERCHANT_ID = process.env.APIGAMES_MERCHANT_ID;
const SECRET_KEY = process.env.APIGAMES_SECRET_KEY;

const db = require("../models");
const Game = db.games;
const GameItem = db.items;

exports.processTopUp = async (transaction) => {
    // ... (Keep existing logic)
    console.log(`[APIGAMES] Processing Top Up for ${transaction.gameName} (${transaction.item})`);

    if (!MERCHANT_ID || !SECRET_KEY) {
        throw new Error("APIGAMES credentials not configured in .env");
    }

    // Fetch Game and Item details for Codes
    const game = await Game.findByPk(transaction.gameId);
    if (!game || !game.brand) throw new Error(`Game Brand not configured for ${transaction.gameId}`);

    // Try to find item by name and gameId - This assumes transaction.item matches GameItem.name
    // A better approach would be to store itemId in transaction, but for now we match by name
    const gameItem = await GameItem.findOne({
        where: {
            gameId: transaction.gameId,
            name: transaction.item
        }
    });

    if (!gameItem || !gameItem.code) throw new Error(`Item Code not configured for ${transaction.item}`);

    // 1. Prepare Payload for Apigames
    const refId = transaction.id;
    const productCode = gameItem.code; // Use DB Code

    // Extract ID and ZoneID from format "12345 (6789)"
    let tujuan = transaction.userGameId || transaction.userId;
    let serverId = '';

    // Simple parse assuming format "ID (Zone)"
    if (tujuan.includes('(')) {
        const parts = tujuan.split('(');
        tujuan = parts[0].trim();
        serverId = parts[1].replace(')', '').trim();
    }

    // Sanitize just in case
    tujuan = tujuan.replace(/[^0-9]/g, '');
    serverId = serverId.replace(/[^0-9]/g, '');

    console.log(`[APIGAMES] Order Details: Ref=${refId}, Product=${productCode}, Tujuan=${tujuan}, Server=${serverId}`);

    // Signature pattern (Verified via Search): md5(merchant_id:secret_key:ref_id)
    const signatureSource = `${MERCHANT_ID}:${SECRET_KEY}:${refId}`;
    const signature = crypto.createHash('md5').update(signatureSource).digest('hex');

    const params = {
        ref_id: refId,
        merchant_id: MERCHANT_ID,
        produk: productCode,
        tujuan: tujuan,
        signature: signature
    };

    if (serverId) {
        params.server_id = serverId;
    }

    console.log(`[APIGAMES] Sending GET Request: ${APIGAMES_ENDPOINT}`, params);

    try {
        // User confirmed it is a GET method
        const response = await axios.get(APIGAMES_ENDPOINT, { params });
        console.log(`[APIGAMES] TopUp Response:`, JSON.stringify(response.data));

        if (response.data.status === 1 || response.data.status === 'Sukses') {
            return {
                success: true,
                data: {
                    status: 'Success',
                    sn: response.data.data.sn
                }
            };
        } else {
            console.error(`[APIGAMES] Failed. Msg: ${response.data.message}, Data:`, response.data);
            throw new Error(response.data.message || "Provider Error");
        }
    } catch (error) {
        if (error.response) console.error(`[APIGAMES] Response Data:`, error.response.data);
        console.error(`[APIGAMES] Request Error:`, error.message);

        throw {
            success: false,
            message: error.response?.data?.message || error.message
        };
    }
};

exports.checkUsername = async (gameCode, userId, zoneId = '') => {
    if (!MERCHANT_ID || !SECRET_KEY) throw new Error("Credentials missing");

    // Fetch Brand from DB
    const game = await Game.findByPk(gameCode);
    // If brand is not set in DB, fallback to gameCode itself (or hardcoded map if needed temporarily)
    const code = (game && game.brand) ? game.brand : gameCode;

    // Signature (Based on Search Result): md5(merchant_id + secret_key)
    const signatureSource = MERCHANT_ID + SECRET_KEY;
    console.log(`[APIGAMES] Signature Source: ${signatureSource}`);
    const signature = crypto.createHash('md5').update(signatureSource).digest('hex');

    // URL Format: /merchant/:merchant_id/cek-username/:game_code
    let url = `${APIGAMES_BASE_URL}/${MERCHANT_ID}/cek-username/${code}`;

    // Params
    const params = {
        user_id: userId,
        signature: signature
    };

    // MLBB needs zone_id concatenated normally, but if API asks for separate, we check.
    // Based on user provided curl: ...?user_id=[user_id]... 
    // If zone_id is needed locally (like MLBB), usually it's user_id|zone_id or just user_id for some providers.
    // Let's assume user_id param takes "123456(1234)" or we might need to append zone_id to user_id if zoneId exists.
    if (zoneId) {
        // Some providers want joined ID
        params.user_id = `${userId}${zoneId}`;
    }

    console.log(`[APIGAMES] Checking ID via GET: ${url}`);
    console.log(`[APIGAMES] Params:`, params);

    try {
        const response = await axios.get(url, { params });
        console.log(`[APIGAMES] Check Response:`, response.data);

        // Success usually status: 1
        if (response.data.status === 1) {
            // Data might be in data.username or data.data.username
            return response.data.data.username || response.data.data.name || "Valid User";
        } else {
            return null;
        }
    } catch (error) {
        console.error("Check ID Error:", error.message);
        if (error.response) console.error("Response Data:", error.response.data);
        return null;
    }
};

// Deprecated: getProductCode is now handled via DB lookup in processTopUp
