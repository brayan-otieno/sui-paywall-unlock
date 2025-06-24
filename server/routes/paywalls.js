import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateRequest, schemas } from '../middleware/validation.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Create paywall
router.post('/', authenticateToken, validateRequest(schemas.createPaywall), async (req, res) => {
  try {
    const { title, description, price, currency, content } = req.body;
    const paywallId = uuidv4();

    const [result] = await pool.execute(
      `INSERT INTO paywalls (id, creator_id, title, description, price, currency, content) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [paywallId, req.user.id, title, description || null, price, currency || 'SUI', content]
    );

    res.status(201).json({
      message: 'Paywall created successfully',
      paywall: {
        id: paywallId,
        title,
        description,
        price,
        currency: currency || 'SUI',
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Create paywall error:', error);
    res.status(500).json({ error: 'Failed to create paywall' });
  }
});

// Get user's paywalls
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const [paywalls] = await pool.execute(
      `SELECT 
        p.id, p.title, p.description, p.price, p.currency, p.created_at,
        COALESCE(SUM(CASE WHEN pay.status = 'completed' THEN pay.amount ELSE 0 END), 0) as total_earnings,
        COUNT(DISTINCT pv.id) as total_views,
        COUNT(DISTINCT CASE WHEN pay.status = 'completed' THEN pay.id END) as total_conversions
       FROM paywalls p
       LEFT JOIN payments pay ON p.id = pay.paywall_id
       LEFT JOIN paywall_views pv ON p.id = pv.paywall_id
       WHERE p.creator_id = ? AND p.deleted_at IS NULL
       GROUP BY p.id, p.title, p.description, p.price, p.currency, p.created_at
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );

    res.json({ paywalls });
  } catch (error) {
    console.error('Get paywalls error:', error);
    res.status(500).json({ error: 'Failed to fetch paywalls' });
  }
});

// Get single paywall (public)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Record view
    if (req.user) {
      await pool.execute(
        'INSERT IGNORE INTO paywall_views (paywall_id, user_id) VALUES (?, ?)',
        [id, req.user.id]
      );
    }

    const [paywalls] = await pool.execute(
      `SELECT p.id, p.title, p.description, p.price, p.currency, p.created_at,
              u.email as creator_email,
              CASE WHEN ? IS NOT NULL THEN 
                (SELECT COUNT(*) FROM payments WHERE paywall_id = ? AND user_id = ? AND status = 'completed') > 0
              ELSE FALSE END as has_access
       FROM paywalls p
       JOIN users u ON p.creator_id = u.id
       WHERE p.id = ? AND p.deleted_at IS NULL`,
      [req.user?.id || null, id, req.user?.id || null, id]
    );

    if (paywalls.length === 0) {
      return res.status(404).json({ error: 'Paywall not found' });
    }

    const paywall = paywalls[0];

    // If user has access, include content
    if (paywall.has_access) {
      const [contentResult] = await pool.execute(
        'SELECT content FROM paywalls WHERE id = ?',
        [id]
      );
      paywall.content = contentResult[0]?.content;
    }

    res.json({ paywall });
  } catch (error) {
    console.error('Get paywall error:', error);
    res.status(500).json({ error: 'Failed to fetch paywall' });
  }
});

// Update paywall
router.put('/:id', authenticateToken, validateRequest(schemas.updatePaywall), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check ownership
    const [paywalls] = await pool.execute(
      'SELECT creator_id FROM paywalls WHERE id = ? AND deleted_at IS NULL',
      [id]
    );

    if (paywalls.length === 0) {
      return res.status(404).json({ error: 'Paywall not found' });
    }

    if (paywalls[0].creator_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Build update query
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    values.push(id);

    await pool.execute(
      `UPDATE paywalls SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    res.json({ message: 'Paywall updated successfully' });
  } catch (error) {
    console.error('Update paywall error:', error);
    res.status(500).json({ error: 'Failed to update paywall' });
  }
});

// Delete paywall
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check ownership
    const [paywalls] = await pool.execute(
      'SELECT creator_id FROM paywalls WHERE id = ? AND deleted_at IS NULL',
      [id]
    );

    if (paywalls.length === 0) {
      return res.status(404).json({ error: 'Paywall not found' });
    }

    if (paywalls[0].creator_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Soft delete
    await pool.execute(
      'UPDATE paywalls SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    res.json({ message: 'Paywall deleted successfully' });
  } catch (error) {
    console.error('Delete paywall error:', error);
    res.status(500).json({ error: 'Failed to delete paywall' });
  }
});

export default router;