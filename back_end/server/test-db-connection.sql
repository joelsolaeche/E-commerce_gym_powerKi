-- MySQL Database Setup Script for PowerKi Application
-- Run this script in MySQL Workbench to prepare your database

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS shopdb;
USE shopdb;

-- Step 2: Verify the database was created
SHOW DATABASES;

-- Step 3: Check if tables exist (should be empty initially)
SHOW TABLES;

-- Step 4: After running Spring Boot application, you can check if data was seeded
-- SELECT * FROM categories;
-- SELECT * FROM products;
-- SELECT * FROM users;

-- Note: Spring Boot will automatically create tables when the application starts
-- due to the setting: spring.jpa.hibernate.ddl-auto=update 