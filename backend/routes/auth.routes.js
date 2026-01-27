module.exports = app => {
    const auth = require("../controllers/auth.controller.js");

    var router = require("express").Router();

    router.post("/signin", auth.signin);
    router.post("/signup", auth.signup);

    app.use('/api/auth', router);
};
