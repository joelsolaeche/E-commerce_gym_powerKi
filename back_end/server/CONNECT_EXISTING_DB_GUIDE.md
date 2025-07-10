# Connect to Existing MySQL Database Guide

## 🎯 Goal
Connect your Spring Boot application to your existing MySQL database and tables.

## ⚙️ Configuration Options

### Option 1: Connect to Existing Database (Recommended)
**Use this if you want to keep your existing data exactly as it is.**

Update your `application.properties`:
```properties
# Your existing database name (change if different)
spring.datasource.url=jdbc:mysql://localhost:3306/YOUR_DATABASE_NAME?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true

# Your MySQL credentials (change if different)
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

# Important: Use 'validate' to connect without changing existing tables
spring.jpa.hibernate.ddl-auto=validate
```

### Option 2: Allow Schema Updates (Careful!)
**Use this if you want Spring Boot to add missing columns/tables.**

```properties
# Same database connection as above
spring.datasource.url=jdbc:mysql://localhost:3306/YOUR_DATABASE_NAME?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true

# Use 'update' to allow adding new columns/tables (won't delete existing data)
spring.jpa.hibernate.ddl-auto=update
```

### Option 3: Custom Database Name
**If your database has a different name than 'shopdb':**

```properties
# Change 'shopdb' to your actual database name
spring.datasource.url=jdbc:mysql://localhost:3306/your_actual_database_name?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
```

## 🔧 Steps to Connect

### Step 1: Update Database Configuration

1. **Find your database details in MySQL Workbench:**
   - Database name
   - Username (usually 'root')
   - Password
   - Port (usually 3306)

2. **Update `application.properties`:**
   - Replace `YOUR_DATABASE_NAME` with your actual database name
   - Replace `YOUR_USERNAME` with your MySQL username
   - Replace `YOUR_PASSWORD` with your MySQL password

### Step 2: Check Table Structure Compatibility

Your existing tables should match these expected names:
- `products`
- `categories`
- `users` (if you have user authentication)
- `carts`
- `orders`
- `bills`

**If your table names are different**, you have two options:

**Option A: Rename your tables** (in MySQL Workbench):
```sql
RENAME TABLE your_product_table TO products;
RENAME TABLE your_category_table TO categories;
```

**Option B: Use custom table names** (modify your entities):
```java
@Entity
@Table(name = "your_custom_table_name")
public class Product {
    // ... existing code
}
```

### Step 3: Test Connection

1. **Start your Spring Boot application:**
   ```bash
   cd back_end/server
   ./mvnw.cmd spring-boot:run
   ```

2. **Check the console output:**
   - Look for "DataSeeder: Found X categories and Y products"
   - Look for successful database connection messages
   - Check for any table validation errors

3. **Test API endpoints:**
   - `http://localhost:8080/products` - Should return your existing products
   - `http://localhost:8080/categories` - Should return your existing categories

### Step 4: Verify in MySQL Workbench

Run these queries to verify the connection:
```sql
USE your_database_name;

-- Check products
SELECT COUNT(*) as product_count FROM products;
SELECT * FROM products LIMIT 5;

-- Check categories
SELECT COUNT(*) as category_count FROM categories;
SELECT * FROM categories LIMIT 5;
```

## 🚨 Important Notes

1. **DataSeeder is DISABLED** - I've disabled it to prevent duplicate data
2. **Using 'validate' mode** - This ensures no existing data is modified
3. **Backup first** - Always backup your existing database before connecting!

## 🔍 Common Issues & Solutions

### Issue 1: Table doesn't exist
**Error:** `Table 'database.products' doesn't exist`
**Solution:** Check your table names match exactly (case-sensitive on Linux/Mac)

### Issue 2: Column mapping errors
**Error:** `Column 'column_name' not found`
**Solution:** Either add missing columns or update entity mappings

### Issue 3: Connection refused
**Error:** `Connection refused`
**Solution:** Check MySQL service is running and credentials are correct

### Issue 4: Database not found
**Error:** `Unknown database 'database_name'`
**Solution:** Verify the database name in your connection string

## 🎯 Quick Start Template

Replace these values in `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/[YOUR_DB_NAME]?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=[YOUR_USERNAME]
spring.datasource.password=[YOUR_PASSWORD]
spring.jpa.hibernate.ddl-auto=validate
```

## 📞 Next Steps

1. **Tell me your database details** (name, username, password)
2. **Share your table names** if they're different from the expected ones
3. **Run the application** and check the console output
4. **Test the API endpoints** to verify data is being fetched

Would you like me to help you configure the specific connection details? 