@echo off
REM This batch file helps you run the Spring Boot application with Java 17
REM even if your system default is Java 24

echo "PowerKi Backend - Java Version Manager"
echo "======================================"

REM Check if Java 17 is installed
if exist "C:\Program Files\Java\jdk-17" (
    echo "Java 17 found! Using Java 17 for this project..."
    set JAVA_HOME=C:\Program Files\Java\jdk-17
    set PATH=%JAVA_HOME%\bin;%PATH%
    java -version
    echo "Building and running the project..."
    .\mvnw.cmd spring-boot:run
) else if exist "C:\Program Files\Eclipse Adoptium\jdk-17.*" (
    echo "Adoptium Java 17 found! Using Java 17 for this project..."
    for /d %%i in ("C:\Program Files\Eclipse Adoptium\jdk-17.*") do set JAVA_HOME=%%i
    set PATH=%JAVA_HOME%\bin;%PATH%
    java -version
    echo "Building and running the project..."
    .\mvnw.cmd spring-boot:run
) else (
    echo "Java 17 not found!"
    echo "Please install Java 17 from:"
    echo "1. Oracle JDK 17: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html"
    echo "2. Eclipse Adoptium: https://adoptium.net/temurin/releases/?version=17"
    echo ""
    echo "After installation, run this script again."
    pause
) 