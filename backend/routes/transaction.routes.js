module.exports = app => {
    const transactions = require("../controllers/transaction.controller.js");

    var router = require("express").Router();

    // Create a new Transaction
    router.post("/", transactions.create);

    // Retrieve all Transactions for a user
    router.get("/user/:userId", transactions.findAllByUser);

    // Retrieve a single Transaction with id
    router.get("/:id", transactions.findOne);

    app.use('/api/transactions', router);
};
