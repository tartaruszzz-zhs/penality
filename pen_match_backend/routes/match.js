const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Get matches for a user
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Get current user's pen type
        const [users] = await db.query(
            'SELECT pen_type FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        const userPenType = users[0].pen_type;

        if (!userPenType) {
            return res.status(400).json({
                success: false,
                message: '请先完成测试以获取您的钢笔类型'
            });
        }

        // Find other users with the same pen type
        const [matches] = await db.query(
            `SELECT id, username, pen_type, created_at 
       FROM users 
       WHERE pen_type = ? AND id != ? 
       ORDER BY created_at DESC 
       LIMIT 20`,
            [userPenType, userId]
        );

        res.json({
            success: true,
            penType: userPenType,
            matchCount: matches.length,
            matches: matches.map(match => ({
                userId: match.id,
                username: match.username,
                penType: match.pen_type,
                joinedAt: match.created_at
            }))
        });

    } catch (error) {
        console.error('Get matches error:', error);
        res.status(500).json({
            success: false,
            message: '获取匹配用户失败'
        });
    }
});

module.exports = router;
