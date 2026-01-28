const db = require("../models");
const Log = db.logs;

/**
 * Retrieve all logs from the database.
 */
exports.findAll = (req, res) => {
    // Basic pagination could be added here, but for now just getting all sorted by date
    Log.findAll({
        order: [['createdAt', 'DESC']]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving logs."
            });
        });
};

/**
 * Delete all logs (Admin clear function).
 */
exports.deleteAll = (req, res) => {
    Log.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Logs were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all logs."
            });
        });
};
