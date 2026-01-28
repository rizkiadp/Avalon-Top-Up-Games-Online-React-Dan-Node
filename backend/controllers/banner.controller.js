const db = require("../models");
console.log("DB Keys:", Object.keys(db));
const Banner = db.Banner;
console.log("Banner Model:", Banner);
const Op = db.Sequelize.Op;

// Create and Save a new Banner
exports.create = async (req, res) => {
    if (!req.body.imageUrl) {
        res.status(400).send({ message: "Image URL cannot be empty!" });
        return;
    }

    const banner = {
        title: req.body.title || "Untitled Banner",
        imageUrl: req.body.imageUrl,
        isActive: req.body.isActive ? req.body.isActive : false,
        actionUrl: req.body.actionUrl
    };

    try {
        const data = await Banner.create(banner);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Banner."
        });
    }
};

// Retrieve all Banners (Admin) or Active Banners (Public)
exports.findAll = async (req, res) => {
    const activeOnly = req.query.active === 'true';
    const condition = activeOnly ? { isActive: true } : null;

    try {
        const data = await Banner.findAll({
            where: condition,
            order: [['createdAt', 'DESC']] // Latest first
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving banners."
        });
    }
};

// Update a Banner by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id;

    try {
        // If setting to active, optionally deactivate others if we only want 1 active at a time
        // For now, let's keep it simple, or user can manually manage.
        // Actually, for a single "Announce Image", it makes sense to only have one active.
        if (req.body.isActive) {
            await Banner.update({ isActive: false }, { where: { isActive: true } });
        }

        const [num] = await Banner.update(req.body, {
            where: { id: id }
        });

        if (num == 1) {
            res.send({ message: "Banner was updated successfully." });
        } else {
            res.send({ message: `Cannot update Banner with id=${id}. Maybe Banner was not found or req.body is empty!` });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating Banner with id=" + id
        });
    }
};

// Delete a Banner with the specified id
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await Banner.destroy({
            where: { id: id }
        });

        if (num == 1) {
            res.send({ message: "Banner was deleted successfully!" });
        } else {
            res.send({ message: `Cannot delete Banner with id=${id}. Maybe Banner was not found!` });
        }
    } catch (err) {
        res.status(500).send({
            message: "Could not delete Banner with id=" + id
        });
    }
};
