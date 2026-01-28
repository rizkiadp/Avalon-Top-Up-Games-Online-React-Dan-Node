const db = require("../models");
const Log = db.logs;

/**
 * Creates a new system log entry.
 * @param {number|null} userId - The ID of the user performing the action (null if anonymous/system).
 * @param {string} username - The username or identifier.
 * @param {string} action - Short code for the action (e.g., 'LOGIN', 'BUY_ITEM').
 * @param {string|object} details - Description or details object.
 * @param {object} req - Express request object to extract IP (optional).
 */
exports.logAction = async (userId, username, action, details, req = null) => {
    try {
        let ip = null;
        if (req) {
            ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        }

        let detailsStr = details;
        if (typeof details === 'object') {
            detailsStr = JSON.stringify(details);
        }

        await Log.create({
            userId,
            username,
            action,
            details: detailsStr,
            ip
        });
        console.log(`[LOG] ${action} by ${username}`);
    } catch (error) {
        console.error("Failed to create system log:", error);
        // Don't throw error to prevent interrupting the main flow
    }
};
