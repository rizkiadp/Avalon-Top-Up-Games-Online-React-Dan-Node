const db = require("../models");
const { logAction } = require("../services/logger");
const User = db.users;
// Config removed as we are using mock tokens for now
// For this specific request "username admin password admin", we will do a simple check.
// In a real app we'd use bcrypt and JWT.

const { sendOTP } = require("../services/email.service");

exports.signin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send({ message: "Username and password are required." });
        }

        // Check DB for user (including Admin)
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
            await logAction(user.id, user.username, "LOGIN_FAILED", "Invalid password attempt", req);
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        // Check if verified
        if (user.role !== 'Admin' && !user.isVerified) {
            return res.status(401).send({
                message: "Email not verified. Please verify your email first.",
                needsVerification: true,
                email: user.email
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

        await logAction(user.id, user.username, "LOGIN", "User logged in successfully", req);

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
            if (!existingUser.isVerified) {
                // User exists but not verified. Treat as a retry.
                // Update password (in case they forgot what they typed)
                existingUser.password = password;

                // Generate new OTP
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

                existingUser.otp = otp;
                existingUser.otpExpires = otpExpires;

                await existingUser.save();
                await sendOTP(email, otp);

                return res.send({
                    message: "Registration successful! Please verify your email.",
                    email: email,
                    needsVerification: true
                });
            }
            return res.status(400).send({ message: "Username already in use!" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Create User
        await User.create({
            username: username,
            email: email,
            password: password, // Plain text for now
            role: "User",
            credits: 0,
            rank: 1,
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + username,
            vipLevel: "Bronze",
            otp: otp,
            otpExpires: otpExpires,
            isVerified: false
        });

        // Send OTP
        const emailSent = await sendOTP(email, otp);

        await logAction(null, username, "REGISTER_INIT", `New user registered, waiting verification: ${email}`, req);

        res.send({
            message: "Registration successful! Please verify your email.",
            email: email,
            needsVerification: true
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.verify = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        if (user.isVerified) {
            return res.status(400).send({ message: "User already verified." });
        }

        if (user.otp !== otp || user.otpExpires < new Date()) {
            return res.status(400).send({ message: "Invalid or expired OTP." });
        }

        // Update user
        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        await logAction(user.id, user.username, "VERIFIED", "Email verified successfully", req);

        // Auto login after verify? Or just return success
        // Returning success so frontend can redirect to login or auto-login
        var token = "mock-token-" + user.id;

        res.send({
            message: "Email verified successfully!",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                credits: user.credits,
                avatar: user.avatar,
                vipLevel: user.vipLevel,
                accessToken: token
            }
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        if (user.isVerified) {
            return res.status(400).send({ message: "User already verified." });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        await sendOTP(email, otp);

        res.send({ message: "OTP resent successfully." });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
exports.changePassword = async (req, res) => {
    try {
        const { userId, oldPassword, newPassword } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        // Verify old password (simple check as per current impl, normally bcrypt)
        if (user.password !== oldPassword) {
            await logAction(userId, user.username, "PASSWORD_CHANGE_FAILED", "Invalid old password", req);
            return res.status(400).send({ message: "Invalid old password." });
        }

        user.password = newPassword;
        await user.save();

        await logAction(userId, user.username, "PASSWORD_CHANGED", "Password updated successfully", req);

        res.send({ message: "Password updated successfully!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.changeEmail = async (req, res) => {
    try {
        const { userId, password, newEmail } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        // Verify password
        if (user.password !== password) {
            await logAction(userId, user.username, "EMAIL_CHANGE_FAILED", "Invalid password", req);
            return res.status(400).send({ message: "Invalid password." });
        }

        // Check if new email is taken
        const existingUser = await User.findOne({ where: { email: newEmail } });
        if (existingUser) {
            return res.status(400).send({ message: "Email already in use." });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        // Update user: temp set email but unverified? 
        // Standard flow: 
        // 1. Update email
        // 2. Set isVerified = false
        // 3. Send OTP

        const oldEmail = user.email;
        user.email = newEmail;
        user.isVerified = false;
        user.otp = otp;
        user.otpExpires = otpExpires;

        await user.save();
        await sendOTP(newEmail, otp);

        await logAction(userId, user.username, "EMAIL_CHANGED", `Email changed from ${oldEmail} to ${newEmail}. Verification required.`, req);

        res.send({
            message: "Email updated! Verification OTP sent.",
            email: newEmail,
            needsVerification: true
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
