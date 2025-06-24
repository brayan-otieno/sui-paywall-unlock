import express from 'express';
import crypto from 'crypto';
import { pool } from '../config/database.js';

const router = express.Router();

// Swypt webhook handler
router.post('/swypt', async (req, res) => {
  try {
    const signature = req.headers['x-swypt-signature'];
    const payload = req.body;

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.SWYPT_WEBHOOK_SECRET)
      .update(payload)
      .digest('hex');

    if (signature !== `sha256=${expectedSignature}`) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(payload.toString());
    console.log('Swypt webhook received:', event.type);

    switch (event.type) {
      case 'payment.completed':
        await handlePaymentCompleted(event.data);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event.data);
        break;
      default:
        console.log('Unhandled webhook event:', event.type);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

async function handlePaymentCompleted(paymentData) {
  try {
    const { sessionId, transactionHash, amount, currency } = paymentData;

    // Update payment status
    const [result] = await pool.execute(
      `UPDATE payments 
       SET status = 'completed', transaction_hash = ?, completed_at = CURRENT_TIMESTAMP
       WHERE id = ? AND status = 'pending'`,
      [transactionHash, sessionId]
    );

    if (result.affectedRows > 0) {
      console.log(`Payment ${sessionId} marked as completed`);
      
      // Get payment details for notification
      const [payments] = await pool.execute(
        `SELECT p.*, pw.title, u.email 
         FROM payments p
         JOIN paywalls pw ON p.paywall_id = pw.id
         JOIN users u ON p.user_id = u.id
         WHERE p.id = ?`,
        [sessionId]
      );

      if (payments.length > 0) {
        const payment = payments[0];
        console.log(`User ${payment.email} gained access to "${payment.title}"`);
        // Here you could send email notifications, etc.
      }
    }
  } catch (error) {
    console.error('Error handling payment completion:', error);
  }
}

async function handlePaymentFailed(paymentData) {
  try {
    const { sessionId, reason } = paymentData;

    // Update payment status
    await pool.execute(
      `UPDATE payments 
       SET status = 'failed', failure_reason = ?
       WHERE id = ? AND status = 'pending'`,
      [reason, sessionId]
    );

    console.log(`Payment ${sessionId} marked as failed: ${reason}`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

export default router;