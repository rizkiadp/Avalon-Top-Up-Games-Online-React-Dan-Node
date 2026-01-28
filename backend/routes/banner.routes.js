module.exports = app => {
    const banners = require("../controllers/banner.controller.js");
    var router = require("express").Router();

    // Create a new Banner
    router.post("/", banners.create);

    // Retrieve all Banners
    router.get("/", banners.findAll);

    // Update a Banner with id
    router.put("/:id", banners.update);

    // Delete a Banner with id
    router.delete("/:id", banners.delete);

    app.use('/api/banners', router);
};
