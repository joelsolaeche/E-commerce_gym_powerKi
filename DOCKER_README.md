# 🐳 PowerKi E-Commerce - Docker Setup

This guide will help you run the complete PowerKi Gym E-Commerce application using Docker containers.

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- At least 4GB of available RAM
- Ports 3000, 8080, and 3306 available on your machine

## 🚀 Quick Start

1. **Clone and navigate to the project directory:**
   ```bash
   cd "apps gym"
   ```

2. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:8080
   - **MySQL Database:** localhost:3306

## 📦 Services

### 🖥️ Frontend (React + Vite)
- **Container:** `powerki_frontend`
- **Port:** 3000
- **Technology:** React 18 + Vite + Nginx
- **URL:** http://localhost:3000

### ⚙️ Backend (Spring Boot)
- **Container:** `powerki_backend`
- **Port:** 8080
- **Technology:** Spring Boot 3.3.1 + Java 17
- **URL:** http://localhost:8080

### 🗄️ Database (MySQL)
- **Container:** `powerki_mysql`
- **Port:** 3306
- **Technology:** MySQL 8.0
- **Database:** `shopdb`

## 🛠️ Docker Commands

### Start the application
```bash
# Build and start all services
docker-compose up --build

# Start in background (detached)
docker-compose up -d --build

# Start without rebuilding
docker-compose up
```

### Stop the application
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ This will delete database data)
docker-compose down -v
```

### View logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs frontend
docker-compose logs backend
docker-compose logs mysql

# Follow logs in real-time
docker-compose logs -f backend
```

### Rebuild specific service
```bash
# Rebuild backend only
docker-compose build backend

# Rebuild frontend only
docker-compose build frontend
```

## 🔧 Environment Variables

The application uses these environment variables in Docker:

### Backend Container
- `SPRING_DATASOURCE_URL`: Database connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `SPRING_JPA_HIBERNATE_DDL_AUTO`: Database schema handling

### MySQL Container
- `MYSQL_ROOT_PASSWORD`: Root password (joelito)
- `MYSQL_DATABASE`: Database name (shopdb)
- `MYSQL_USER`: Application user (powerki_user)
- `MYSQL_PASSWORD`: Application password (powerki_pass)

## 📊 Health Checks

All services include health checks:

- **MySQL:** Checks if database is responding
- **Backend:** Checks Spring Boot actuator health endpoint
- **Frontend:** Nginx service availability

## 🗃️ Data Persistence

- **Database data** is persisted in Docker volume `mysql_data`
- **Static files** are rebuilt on each container start
- **Logs** are available through Docker Compose

## 🚨 Troubleshooting

### Port Conflicts
If ports are already in use, modify `docker-compose.yml`:
```yaml
ports:
  - "3001:80"    # Change frontend port
  - "8081:8080"  # Change backend port
  - "3307:3306"  # Change MySQL port
```

### Database Connection Issues
```bash
# Check MySQL container logs
docker-compose logs mysql

# Verify MySQL is healthy
docker-compose ps

# Connect to MySQL directly
docker exec -it powerki_mysql mysql -u root -p
```

### Backend Not Starting
```bash
# Check backend logs
docker-compose logs backend

# Verify backend health
curl http://localhost:8080/actuator/health
```

### Frontend Build Issues
```bash
# Rebuild frontend container
docker-compose build frontend --no-cache

# Check build logs
docker-compose logs frontend
```

## 🔄 Development Workflow

1. **Make code changes**
2. **Rebuild affected service:**
   ```bash
   docker-compose build backend  # or frontend
   ```
3. **Restart the service:**
   ```bash
   docker-compose up -d backend  # or frontend
   ```

## 📈 Production Considerations

For production deployment:

1. **Use environment-specific configurations**
2. **Set up proper secrets management**
3. **Configure reverse proxy (nginx/traefik)**
4. **Set up SSL certificates**
5. **Configure database backups**
6. **Set up monitoring and logging**

## 🆘 Support Commands

```bash
# Remove all containers and start fresh
docker-compose down && docker-compose up --build

# View container resource usage
docker stats

# Access container shell
docker exec -it powerki_backend bash
docker exec -it powerki_frontend sh
docker exec -it powerki_mysql bash

# Clean up Docker system
docker system prune -f
```

## 🎯 Features Available

Once running, you can:
- ✅ Browse products catalog
- ✅ User registration and login
- ✅ Add products to cart
- ✅ Create orders
- ✅ View purchase history ("Mis Compras")
- ✅ Seller dashboard ("Mis Ventas")
- ✅ Product management for sellers

## 📞 Need Help?

If you encounter issues:
1. Check the logs: `docker-compose logs`
2. Verify all services are healthy: `docker-compose ps`
3. Restart the application: `docker-compose restart`

**Your PowerKi Gym E-Commerce is now fully containerized! 🏋️‍♂️💪** 