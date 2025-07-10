@echo off
echo "PowerKi Database Setup Verification"
echo "=================================="
echo.

REM Check if MySQL service is running
echo "Checking MySQL service status..."
sc query "MySQL" 2>nul | find "RUNNING" >nul
if %errorlevel% == 0 (
    echo "✓ MySQL service is running"
) else (
    echo "✗ MySQL service is not running"
    echo "Please start MySQL service from Windows Services or run:"
    echo "net start MySQL"
    echo.
)

REM Check if MySQL command line is available
echo "Checking MySQL command line access..."
mysql --version 2>nul
if %errorlevel% == 0 (
    echo "✓ MySQL command line is available"
) else (
    echo "✗ MySQL command line not found in PATH"
    echo "Please add MySQL bin directory to your PATH environment variable"
    echo.
)

REM Try to connect to MySQL (you'll need to enter password)
echo "Testing MySQL connection..."
echo "Please enter your MySQL root password when prompted:"
mysql -u root -p -e "SELECT 'Connection successful!' as Status;"

echo.
echo "Next steps:"
echo "1. Run the SQL script 'test-db-connection.sql' in MySQL Workbench"
echo "2. Start your Spring Boot application"
echo "3. Check if tables are created: SHOW TABLES;"
echo "4. Check if data is seeded: SELECT * FROM products;"
pause 