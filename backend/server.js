require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();

const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:3000'] // Allow both default and custom ports
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to Avalon Games Backend." });
});

// Routes
require('./routes/transaction.routes')(app);
require('./routes/game.routes')(app);
require('./routes/auth.routes')(app);

const seed = require('./seeders/init');

const PORT = process.env.PORT || 5000;

// Sync Database
db.sequelize.sync({ alter: true })
    .then(() => {
        console.log("Synced db.");
        seed();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });
