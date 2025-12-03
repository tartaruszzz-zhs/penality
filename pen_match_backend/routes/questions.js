const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Get all questions
router.get('/', async (req, res) => {
    try {
        const [questions] = await db.query(
            'SELECT id, question_text, option_a, option_b, option_c, option_d FROM questions ORDER BY id'
        );

        res.json({
            success: true,
            questions: questions
        });

    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({
            success: false,
            message: '获取题目失败'
        });
    }
});

// Batch post answers
router.post('/batch', async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { user_id, answers } = req.body;

        if (!user_id || !Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({
                success: false,
                message: '无效的提交数据'
            });
        }

        await connection.beginTransaction();

        for (const answer of answers) {
            const { question_id, selected_option } = answer;
            if (question_id && selected_option) {
                await connection.query(
                    `INSERT INTO answers (user_id, question_id, selected_option) 
                     VALUES (?, ?, ?) 
                     ON DUPLICATE KEY UPDATE selected_option = ?, answered_at = CURRENT_TIMESTAMP`,
                    [user_id, question_id, selected_option.toUpperCase(), selected_option.toUpperCase()]
                );
            }
        }

        await connection.commit();

        res.json({
            success: true,
            message: '所有答案已保存'
        });

    } catch (error) {
        await connection.rollback();
        console.error('Batch post answer error:', error);
        res.status(500).json({
            success: false,
            message: '保存答案失败'
        });
    } finally {
        connection.release();
    }
});

// Post answer
router.post('/', async (req, res) => {
    try {
        const { user_id, question_id, selected_option } = req.body;

        // Validate input
        if (!user_id || !question_id || !selected_option) {
            return res.status(400).json({
                success: false,
                message: '请提供完整的答题信息'
            });
        }

        // Validate selected_option
        if (!['A', 'B', 'C', 'D'].includes(selected_option.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: '选项必须是 A, B, C 或 D'
            });
        }

        // Check if user exists
        const [users] = await db.query('SELECT id FROM users WHERE id = ?', [user_id]);
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        // Check if question exists
        const [questions] = await db.query('SELECT id FROM questions WHERE id = ?', [question_id]);
        if (questions.length === 0) {
            return res.status(404).json({
                success: false,
                message: '题目不存在'
            });
        }

        // Insert or update answer
        await db.query(
            `INSERT INTO answers (user_id, question_id, selected_option) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE selected_option = ?, answered_at = CURRENT_TIMESTAMP`,
            [user_id, question_id, selected_option.toUpperCase(), selected_option.toUpperCase()]
        );

        res.json({
            success: true,
            message: '答案已保存'
        });

    } catch (error) {
        console.error('Post answer error:', error);
        res.status(500).json({
            success: false,
            message: '保存答案失败'
        });
    }
});

module.exports = router;
