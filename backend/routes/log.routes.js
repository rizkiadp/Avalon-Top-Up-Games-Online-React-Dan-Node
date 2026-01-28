module.exports = app => {
    const logs = require("../controllers/log.controller.js");

    var router = require("express").Router();

    // Retrieve all Logs
    router.get("/", logs.findAll);

    // Delete all Logs
    router.delete("/", logs.deleteAll);

    app.use('/api/logs', router);
};
