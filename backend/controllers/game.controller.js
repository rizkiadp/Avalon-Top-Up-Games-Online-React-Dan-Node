const db = require("../models");
const Game = db.games;
const Op = db.Sequelize.Op;
const ProviderService = require('../services/provider.service');

// Retrieve all Games from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

    Game.findAll({ where: condition })
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

    Game.findByPk(id)
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
