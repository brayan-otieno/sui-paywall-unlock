import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT 
        u.id, u.email, u.created_at,
        COUNT(DISTINCT p.id) as total_paywalls,
        COALESCE(SUM(CASE WHEN pay.status = 'completed' THEN pay.amount ELSE 0 END), 0) as total_earnings
       FROM users u
       LEFT JOIN paywalls p ON u.id = p.creator_id AND p.deleted_at IS NULL
       LEFT JOIN payments pay ON p.id = pay.paywall_id
       WHERE u.id = ?
       GROUP BY u.id, u.email, u.created_at`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Get user's purchased content
router.get('/purchases', authenticateToken, async (req, res) => {
  try {
    const [purchases] = await pool.execute(
      `SELECT 
        p.id as payment_id, p.amount, p.currency, p.created_at as purchased_at,
        pw.id as paywall_id, pw.title, pw.description
       FROM payments p
       JOIN paywalls pw ON p.paywall_id = pw.id
       WHERE p.user_id = ? AND p.status = 'completed'
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );

    res.json({ purchases });
  } catch (error) {
    console.error('Get user purchases error:', error);
    res.status(500).json({ error: 'Failed to get purchases' });
  }
});

export default router;