const db = require("../models");
const User = db.users;
// Config removed as we are using mock tokens for now
// For this specific request "username admin password admin", we will do a simple check.
// In a real app we'd use bcrypt and JWT.

exports.signin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send({ message: "Username and password are required." });
        }

        // Check for specific admin credentials as requested
        if (username === "admin" && password === "admin") {
            return res.status(200).send({
                id: 1, // continuous id
                username: "admin",
                email: "admin@avalon.com",
                role: "Admin",
                credits: 999999999,
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
                vipLevel: "God Mode",
                accessToken: "mock-token-admin-12345" // Mock token
            });
        }

        // For other users, we would check DB
        const user = await User.findOne({
            where: {
                username: username
            }
        });

        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        // Simple password check (plaintext for now as we don't know if they want hashing yet, default to simple)
        // CAUTION: In production, use bcrypt.compareSync
        var passwordIsValid = (user.password === password);

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        var token = "mock-token-" + user.id; // Mock token

        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            credits: user.credits,
            avatar: user.avatar,
            vipLevel: user.vipLevel,
            accessToken: token
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).send({ message: "All fields are required!" });
        }

        // Check if user exists
        const existingUser = await User.findOne({
            where: {
                username: username
            }
        });

        if (existingUser) {
            return res.status(400).send({ message: "Username already in use!" });
        }

        // Create User
        await User.create({
            username: username,
            email: email,
            password: password, // Plain text for now as per current setup
            role: "User",
            credits: 0,
            rank: 1,
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + username,
            vipLevel: "Bronze"
        });

        res.send({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
