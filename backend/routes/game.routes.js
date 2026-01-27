module.exports = app => {
    const games = require("../controllers/game.controller.js");

    var router = require("express").Router();

    // Retrieve all Games
    router.get("/", games.findAll);

    // Retrieve a single Game with id
    router.get("/:id", games.findOne);

    // Check Account Logic
    router.post("/check", games.checkAccount);

    app.use('/api/games', router);
};
