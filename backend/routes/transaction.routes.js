module.exports = app => {
    const transactions = require("../controllers/transaction.controller.js");

    var router = require("express").Router();

    // Create a new Transaction
    router.post("/", transactions.create);

    // Retrieve Stats (Admin) - Must be before /:id
    router.get("/stats", transactions.getStats);

    // Retrieve all Transactions (Admin)
    router.get("/", transactions.findAll);

    // Retrieve all Transactions for a user
    router.get("/user/:userId", transactions.findAllByUser);

    // Retrieve a single Transaction with id
    router.get("/:id", transactions.findOne);

    // Delete a Transaction with id
    router.delete("/:id", transactions.delete);

    app.use('/api/transactions', router);
};
