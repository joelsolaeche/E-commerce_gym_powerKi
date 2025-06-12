-- Create Categories Table (if it doesn't exist already)
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(100) NOT NULL
);

-- Create Products Table (if it doesn't exist already)
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    original_price DECIMAL(10, 2) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2) DEFAULT 0.00,
    image VARCHAR(255),
    category_id BIGINT NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Sample operations for categories

-- Insert categories if they don't exist
INSERT INTO categories (description) 
VALUES 
    ('Suplementos'),
    ('Proteínas'),
    ('Accesorios'),
    ('Vitaminas'),
    ('Ropa'),
    ('Equipamiento'),
    ('Pre-entreno'),
    ('Post-entreno')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Sample operations for products

-- Query to get all products
SELECT p.*, c.description as category_name 
FROM products p
JOIN categories c ON p.category_id = c.id;

-- Query to get products by category
SELECT p.*, c.description as category_name 
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.description = ?;

-- Query to get products by price range
SELECT p.*, c.description as category_name 
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.price BETWEEN ? AND ?;

-- Query to get products by name (search)
SELECT p.*, c.description as category_name 
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.name LIKE CONCAT('%', ?, '%') OR p.description LIKE CONCAT('%', ?, '%');

-- Insert a new product
INSERT INTO products (name, description, original_price, price, discount_percentage, image, category_id, stock_quantity) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?);

-- Update a product
UPDATE products 
SET name = ?, 
    description = ?, 
    original_price = ?, 
    price = ?, 
    discount_percentage = ?, 
    image = ?,
    category_id = ?, 
    stock_quantity = ? 
WHERE id = ?;

-- Delete a product
DELETE FROM products WHERE id = ?;

-- Procedure to apply discount to a product
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS apply_discount(IN product_id BIGINT, IN discount DECIMAL(5, 2))
BEGIN
    DECLARE original DECIMAL(10, 2);
    
    -- Get original price
    SELECT original_price INTO original FROM products WHERE id = product_id;
    
    -- Update product with discount
    UPDATE products 
    SET discount_percentage = discount,
        price = original - (original * discount / 100)
    WHERE id = product_id;
END //
DELIMITER ;

-- Procedure to update stock
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS update_stock(IN product_id BIGINT, IN quantity INT)
BEGIN
    UPDATE products 
    SET stock_quantity = stock_quantity + quantity
    WHERE id = product_id;
END //
DELIMITER ; 