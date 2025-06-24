import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Create Swypt payment session
router.post('/create-session', authenticateToken, async (req, res) => {
  try {
    const { paywallId, walletAddress } = req.body;

    if (!paywallId || !walletAddress) {
      return res.status(400).json({ error: 'Paywall ID and wallet address required' });
    }

    // Get paywall details
    const [paywalls] = await pool.execute(
      'SELECT id, title, price, currency, creator_id FROM paywalls WHERE id = ? AND deleted_at IS NULL',
      [paywallId]
    );

    if (paywalls.length === 0) {
      return res.status(404).json({ error: 'Paywall not found' });
    }

    const paywall = paywalls[0];

    // Check if user already has access
    const [existingPayments] = await pool.execute(
      'SELECT id FROM payments WHERE paywall_id = ? AND user_id = ? AND status = "completed"',
      [paywallId, req.user.id]
    );

    if (existingPayments.length > 0) {
      return res.status(409).json({ error: 'Already purchased' });
    }

    // Create payment record
    const paymentId = uuidv4();
    await pool.execute(
      `INSERT INTO payments (id, paywall_id, user_id, wallet_address, amount, currency, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [paymentId, paywallId, req.user.id, walletAddress, paywall.price, paywall.currency]
    );

    // Create Swypt checkout session
    const swyptSession = {
      sessionId: paymentId,
      amount: paywall.price,
      currency: paywall.currency,
      title: paywall.title,
      description: `Access to: ${paywall.title}`,
      successUrl: `${process.env.CLIENT_URL}/paywall/${paywallId}?payment=success`,
      cancelUrl: `${process.env.CLIENT_URL}/paywall/${paywallId}?payment=cancelled`,
      webhookUrl: `${process.env.SERVER_URL}/api/webhooks/swypt`,
      metadata: {
        paymentId,
        paywallId,
        userId: req.user.id
      }
    };

    res.json({
      sessionId: paymentId,
      swyptSession,
      message: 'Payment session created'
    });
  } catch (error) {
    console.error('Create payment session error:', error);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
});

// Check payment status
router.get('/status/:paymentId', authenticateToken, async (req, res) => {
  try {
    const { paymentId } = req.params;

    const [payments] = await pool.execute(
      `SELECT p.*, pw.title as paywall_title 
       FROM payments p
       JOIN paywalls pw ON p.paywall_id = pw.id
       WHERE p.id = ? AND p.user_id = ?`,
      [paymentId, req.user.id]
    );

    if (payments.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ payment: payments[0] });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ error: 'Failed to get payment status' });
  }
});

// Get user's payment history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const [payments] = await pool.execute(
      `SELECT p.id, p.amount, p.currency, p.status, p.created_at,
              pw.title as paywall_title, pw.id as paywall_id
       FROM payments p
       JOIN paywalls pw ON p.paywall_id = pw.id
       WHERE p.user_id = ?
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );

    res.json({ payments });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to get payment history' });
  }
});

// Get creator's earnings
router.get('/earnings', authenticateToken, async (req, res) => {
  try {
    const [earnings] = await pool.execute(
      `SELECT 
        DATE(p.created_at) as date,
        SUM(p.amount) as total_amount,
        COUNT(*) as transaction_count
       FROM payments p
       JOIN paywalls pw ON p.paywall_id = pw.id
       WHERE pw.creator_id = ? AND p.status = 'completed'
       GROUP BY DATE(p.created_at)
       ORDER BY date DESC
       LIMIT 30`,
      [req.user.id]
    );

    const [totalEarnings] = await pool.execute(
      `SELECT 
        COALESCE(SUM(p.amount), 0) as total,
        COUNT(*) as total_transactions
       FROM payments p
       JOIN paywalls pw ON p.paywall_id = pw.id
       WHERE pw.creator_id = ? AND p.status = 'completed'`,
      [req.user.id]
    );

    res.json({
      dailyEarnings: earnings,
      totalEarnings: totalEarnings[0]
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({ error: 'Failed to get earnings' });
  }
});

export default router;