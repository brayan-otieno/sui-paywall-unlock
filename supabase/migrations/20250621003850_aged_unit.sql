-- SUI Paywall Database Schema
-- Run this script to set up your MySQL database

CREATE DATABASE IF NOT EXISTS sui_paywall;
USE sui_paywall;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- Paywalls table
CREATE TABLE paywalls (
    id VARCHAR(36) PRIMARY KEY,
    creator_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 4) NOT NULL,
    currency VARCHAR(10) DEFAULT 'SUI',
    content LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_creator_id (creator_id),
    INDEX idx_created_at (created_at),
    INDEX idx_price (price)
);

-- Payments table
CREATE TABLE payments (
    id VARCHAR(36) PRIMARY KEY,
    paywall_id VARCHAR(36) NOT NULL,
    user_id INT NOT NULL,
    wallet_address VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 4) NOT NULL,
    currency VARCHAR(10) DEFAULT 'SUI',
    status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    transaction_hash VARCHAR(255),
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (paywall_id) REFERENCES paywalls(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_paywall_id (paywall_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_wallet_address (wallet_address),
    UNIQUE KEY unique_user_paywall_completed (user_id, paywall_id, status)
);

-- Paywall views table (for analytics)
CREATE TABLE paywall_views (
    id INT PRIMARY KEY AUTO_INCREMENT,
    paywall_id VARCHAR(36) NOT NULL,
    user_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paywall_id) REFERENCES paywalls(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_paywall_id (paywall_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    UNIQUE KEY unique_user_paywall_view (user_id, paywall_id)
);

-- User sessions table (optional, for session management)
CREATE TABLE user_sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at),
    INDEX idx_token_hash (token_hash)
);

-- Insert sample data for testing
INSERT INTO users (email, password_hash) VALUES 
('creator@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS'), -- password: password123
('user@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS');   -- password: password123

-- Sample paywall
INSERT INTO paywalls (id, creator_id, title, description, price, currency, content) VALUES 
(
    'sample-paywall-uuid-1234',
    1,
    'Premium Tutorial Series',
    'Unlock access to our comprehensive blockchain development tutorial series. Learn SUI development from scratch with hands-on examples.',
    5.0000,
    'SUI',
    '🎉 Welcome to the Premium Tutorial Series!\n\n📚 What you''ll learn:\n- SUI blockchain fundamentals\n- Smart contract development\n- DApp creation\n- Advanced patterns\n\n💡 This exclusive content includes:\n✅ 10+ video tutorials\n✅ Source code examples\n✅ Live coding sessions\n✅ Q&A support\n\nThank you for your purchase! Enjoy learning! 🚀'
);

-- Create indexes for better performance
CREATE INDEX idx_payments_user_paywall ON payments(user_id, paywall_id);
CREATE INDEX idx_payments_status_created ON payments(status, created_at);
CREATE INDEX idx_paywalls_creator_deleted ON paywalls(creator_id, deleted_at);

-- Create views for common queries
CREATE VIEW paywall_stats AS
SELECT 
    p.id,
    p.title,
    p.price,
    p.currency,
    p.created_at,
    u.email as creator_email,
    COUNT(DISTINCT pv.id) as total_views,
    COUNT(DISTINCT CASE WHEN pay.status = 'completed' THEN pay.id END) as total_purchases,
    COALESCE(SUM(CASE WHEN pay.status = 'completed' THEN pay.amount ELSE 0 END), 0) as total_earnings
FROM paywalls p
JOIN users u ON p.creator_id = u.id
LEFT JOIN paywall_views pv ON p.id = pv.paywall_id
LEFT JOIN payments pay ON p.id = pay.paywall_id
WHERE p.deleted_at IS NULL
GROUP BY p.id, p.title, p.price, p.currency, p.created_at, u.email;

-- Create view for user purchase history
CREATE VIEW user_purchases AS
SELECT 
    u.id as user_id,
    u.email,
    p.id as payment_id,
    p.amount,
    p.currency,
    p.status,
    p.created_at as purchased_at,
    pw.id as paywall_id,
    pw.title as paywall_title,
    pw.description as paywall_description
FROM users u
JOIN payments p ON u.id = p.user_id
JOIN paywalls pw ON p.paywall_id = pw.id
WHERE p.status = 'completed' AND pw.deleted_at IS NULL;

-- Stored procedure to check user access
DELIMITER //
CREATE PROCEDURE CheckUserAccess(
    IN p_user_id INT,
    IN p_paywall_id VARCHAR(36),
    OUT p_has_access BOOLEAN
)
BEGIN
    DECLARE access_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO access_count
    FROM payments 
    WHERE user_id = p_user_id 
      AND paywall_id = p_paywall_id 
      AND status = 'completed';
    
    SET p_has_access = (access_count > 0);
END //
DELIMITER ;

-- Function to calculate conversion rate
DELIMITER //
CREATE FUNCTION GetConversionRate(p_paywall_id VARCHAR(36))
RETURNS DECIMAL(5,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE view_count INT DEFAULT 0;
    DECLARE purchase_count INT DEFAULT 0;
    DECLARE conversion_rate DECIMAL(5,2) DEFAULT 0.00;
    
    SELECT COUNT(DISTINCT id) INTO view_count
    FROM paywall_views 
    WHERE paywall_id = p_paywall_id;
    
    SELECT COUNT(*) INTO purchase_count
    FROM payments 
    WHERE paywall_id = p_paywall_id AND status = 'completed';
    
    IF view_count > 0 THEN
        SET conversion_rate = (purchase_count / view_count) * 100;
    END IF;
    
    RETURN conversion_rate;
END //
DELIMITER ;

-- Trigger to update paywall updated_at timestamp
DELIMITER //
CREATE TRIGGER update_paywall_timestamp
    BEFORE UPDATE ON paywalls
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Trigger to prevent duplicate completed payments
DELIMITER //
CREATE TRIGGER prevent_duplicate_payments
    BEFORE INSERT ON payments
    FOR EACH ROW
BEGIN
    DECLARE existing_payment_count INT DEFAULT 0;
    
    IF NEW.status = 'completed' THEN
        SELECT COUNT(*) INTO existing_payment_count
        FROM payments 
        WHERE user_id = NEW.user_id 
          AND paywall_id = NEW.paywall_id 
          AND status = 'completed';
        
        IF existing_payment_count > 0 THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'User already has completed payment for this paywall';
        END IF;
    END IF;
END //
DELIMITER ;