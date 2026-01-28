module.exports = app => {
    const auth = require("../controllers/auth.controller.js");

    var router = require("express").Router();

    router.post("/signin", auth.signin);
    router.post("/signup", auth.signup);
    router.post("/verify", auth.verify);
    router.post("/resend-otp", auth.resendOTP);
    router.post("/change-password", auth.changePassword);
    router.post("/change-email", auth.changeEmail);

    app.use('/api/auth', router);
};
