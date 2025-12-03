const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
const { isValidPhone, sanitizeInput } = require('../utils/validation');

// Mock verification codes storage (in memory for demo)
// In production, use Redis
const verificationCodes = new Map();

// Send verification code endpoint
router.post('/send-code', async (req, res) => {
    try {
        const { phone } = req.body;

        // Validate phone
        if (!phone || !isValidPhone(phone)) {
            return res.status(400).json({
                success: false,
                message: '请输入有效的手机号'
            });
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Store code with expiration (5 minutes)
        verificationCodes.set(phone, {
            code,
            expires: Date.now() + 5 * 60 * 1000
        });

        // In a real app, send SMS here
        console.log(`[MOCK SMS] Code for ${phone}: ${code}`);

        res.json({
            success: true,
            message: '验证码已发送',
            // For dev convenience, return code in response (remove in production!)
            debugCode: code
        });

    } catch (error) {
        console.error('Send code error:', error);
        res.status(500).json({
            success: false,
            message: '发送验证码失败'
        });
    }
});

// Verify login endpoint
router.post('/verify-login', async (req, res) => {
    try {
        const { phone, code } = req.body;

        if (!phone || !code) {
            return res.status(400).json({
                success: false,
                message: '请输入手机号和验证码'
            });
        }

        // Verify code
        const storedData = verificationCodes.get(phone);
        if (!storedData) {
            return res.status(400).json({
                success: false,
                message: '验证码已失效，请重新获取'
            });
        }

        if (Date.now() > storedData.expires) {
            verificationCodes.delete(phone);
            return res.status(400).json({
                success: false,
                message: '验证码已过期'
            });
        }

        if (storedData.code !== code) {
            return res.status(400).json({
                success: false,
                message: '验证码错误'
            });
        }

        // Clear used code
        verificationCodes.delete(phone);

        // Check if user exists
        const [users] = await db.query(
            'SELECT id, username, pen_type FROM users WHERE phone = ?',
            [phone]
        );

        let user;
        let isNewUser = false;

        if (users.length === 0) {
            // Register new user
            const username = `User_${phone.slice(-4)}`; // Generate default username
            const [result] = await db.query(
                'INSERT INTO users (phone, username) VALUES (?, ?)',
                [phone, username]
            );
            user = {
                id: result.insertId,
                username: username,
                pen_type: null
            };
            isNewUser = true;
        } else {
            user = users[0];
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, phone: user.phone },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            userId: user.id,
            username: user.username,
            penType: user.pen_type,
            isNewUser
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: '登录失败'
        });
    }
});

module.exports = router;
