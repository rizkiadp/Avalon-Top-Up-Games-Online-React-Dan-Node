module.exports = app => {
    const vouchers = require("../controllers/voucher.controller.js");
    var router = require("express").Router();

    router.post("/", vouchers.create);
    router.get("/", vouchers.findAll);
    router.delete("/:id", vouchers.delete);
    router.post("/verify", vouchers.verify);

    app.use('/api/vouchers', router);
};
