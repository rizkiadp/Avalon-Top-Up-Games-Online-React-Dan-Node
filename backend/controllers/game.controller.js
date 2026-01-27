const db = require("../models");
const Game = db.games;
const Op = db.Sequelize.Op;
const ProviderService = require('../services/provider.service');

// Retrieve all Games from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

    Game.findAll({ where: condition, include: ["items"] }) // Include Items
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving games."
            });
        });
};

// Find a single Game with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Game.findByPk(id, { include: ["items"] }) // Include Items
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Game with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Game with id=" + id
            });
        });
};

// Create and Save a new Game
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name || !req.body.id) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Game
    const game = {
        id: req.body.id,
        name: req.body.name,
        category: req.body.category,
        image: req.body.image,
        brand: req.body.brand, // Add brand
        isHot: req.body.isHot,
        discount: req.body.discount,
        description: req.body.description
    };

    // Save Game in the database
    Game.create(game)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Game."
            });
        });
};

// Update a Game by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Game.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Game was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Game with id=${id}. Maybe Game was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Game with id=" + id
            });
        });
};

// Delete a Game with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Game.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Game was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Game with id=${id}. Maybe Game was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Game with id=" + id
            });
        });
};

exports.checkAccount = async (req, res) => {
    const { gameId, userId, zoneId } = req.body;
    try {
        const username = await ProviderService.checkUsername(gameId, userId, zoneId);
        if (username) {
            res.send({ isValid: true, username: username });
        } else {
            res.send({ isValid: false });
        }
    } catch (error) {
        console.error("Check Account Internal Error:", error);
        res.status(500).send({ message: error.message });
    }
};

// Add Item to a Game
exports.addItem = (req, res) => {
    const gameId = req.params.gameId;
    const item = {
        gameId: gameId,
        name: req.body.name,
        price: req.body.price,
        code: req.body.code,
        bonus: req.body.bonus
    };

    const Item = require("../models").items;

    Item.create(item)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creating Item."
            });
        });
};

exports.deleteItem = (req, res) => {
    const id = req.params.itemId;
    const Item = require("../models").items;

    Item.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) res.send({ message: "Item deleted." });
            else res.send({ message: "Cannot delete Item." });
        })
        .catch(err => res.status(500).send({ message: "Error deleting Item." }));
};
