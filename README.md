# 🐉💪 Power Ki Gym - Plataforma de E-commerce

## 📌 Descripción del Proyecto

Power Ki Gym E-commerce es una plataforma digital que ha evolucionado de un concepto simple a una experiencia de compra interactiva completamente tematizada. Construida con una estética inspirada en Dragon Ball Z, la plataforma permite a los usuarios comprar suplementos para el gimnasio, equipamiento de entrenamiento y accesorios, todo con una interfaz inmersiva que captura la energía y el poder del universo de Dragon Ball.

## 👥 Integrantes del Equipo

- Solaeche Joel  
- Kraus Gabriel  

## 🚀 Estado Actual del Proyecto

El proyecto ha implementado exitosamente:

### ✅ Backend (Java Spring Boot)
- Endpoints RESTful para productos, usuarios, carrito y órdenes  
- Autenticación y autorización basada en JWT  
- Persistencia de datos con MySQL conectada y funcional
- Funcionalidades de seguridad para rutas protegidas  
- DataSeeder para poblado automático de datos iniciales
- Gestión completa de vendedores y compradores
- API endpoints optimizados para operaciones CRUD

### ✅ Frontend (React + Vite)
- Interfaz completa con temática de Dragon Ball Z en todas las páginas  
- Integración con Redux Toolkit + RTK Query para manejo de estados  
- Diseño responsive para todos los tamaños de dispositivo  
- Catálogo de productos con filtros y buscador funcional
- Autenticación de usuario (inicio de sesión/registro)  
- Funcionalidad de carrito de compras completamente operativa
- Gestión de productos para vendedores con CRUD completo
- Página "Mis Compras" con contador de artículos corregido
- Página "Mis Ventas" con información detallada del cliente
- Configuración API actualizada para conexión con backend

### ✅ Base de Datos y Conectividad
- Conexión exitosa a MySQL (base de datos `shopdb`)
- 14 productos pre-cargados en 8 categorías diferentes
- Estructura de tablas optimizada con relaciones correctas
- Integración completa Frontend ↔ Backend ↔ Base de Datos

### ✅ Dockerización Completa
- Contenedores Docker para todos los servicios
- Docker Compose para orquestación de servicios
- Scripts de inicio automatizados (Windows/Linux/macOS)
- Configuración de producción con Nginx
- Persistencia de datos y health checks
- Documentación completa de Docker

### ✅ Implementación de la Temática
Toda la aplicación ha sido tematizada con elementos inspirados en Dragon Ball Z:
- Paleta de colores personalizada (fondos azul oscuro, acentos naranjas/dorados)  
- Terminología tematizada (Productos → "Arsenal de Entrenamiento")  
- Animaciones interactivas (carga de ki, brillo de super saiyajin)  
- Diseño responsive en todas las páginas  

## 🛠️ Tecnologías Utilizadas

### Backend
- Java 17 / Java 21 (compatible)
- Spring Boot 3.3.1 (actualizado)
- Spring Security con JWT  
- Spring Data JPA con MySQL
- Maven con wrapper incluido
- H2 Database para desarrollo opcional

### Frontend
- React 19.1  
- Redux Toolkit + RTK Query  
- Tailwind CSS 4.1  
- Vite 6.3  
- Axios para llamadas a la API
- React Toastify para notificaciones

### DevOps y Contenedores
- Docker & Docker Compose
- Multi-stage builds optimizados
- Nginx para frontend en producción
- Health checks automáticos
- Persistent volumes para datos

### Base de Datos
- MySQL 8.0 (producción)
- Estructura optimizada con relaciones
- DataSeeder automático
- Soporte para múltiples entornos

## 📁 Estructura del Proyecto

```
📦 power-ki-gym-ecommerce/
 ┣ 📂 back_end/
 ┃ ┗ 📂 server/
 ┃   ┣ 📂 src/                    (Código backend en Java)
 ┃   ┣ 📂 target/                 (Salida compilada)
 ┃   ┣ 📂 data/                   (Archivos de base de datos)
 ┃   ┣ 📜 Dockerfile              (Configuración Docker backend)
 ┃   ┣ 📜 .dockerignore           (Exclusiones Docker)
 ┃   ┗ 📜 pom.xml                 (Dependencias Maven)
 ┣ 📂 front_end/
 ┃ ┣ 📂 src/
 ┃ ┃ ┣ 📂 assets/                 (Imágenes y recursos estáticos)
 ┃ ┃ ┣ 📂 components/             (Componentes de React)
 ┃ ┃ ┣ 📂 context/                (Proveedores de contexto de React)
 ┃ ┃ ┣ 📂 hooks/                  (Hooks personalizados de React)
 ┃ ┃ ┣ 📂 pages/                  (Componentes de páginas)
 ┃ ┃ ┣ 📂 store/                  (Configuración de Redux)
 ┃ ┃ ┗ 📜 main.jsx                (Punto de entrada de la app)
 ┃ ┣ 📂 public/                   (Archivos estáticos)
 ┃ ┣ 📜 Dockerfile                (Configuración Docker frontend)
 ┃ ┣ 📜 nginx.conf                (Configuración Nginx)
 ┃ ┣ 📜 .dockerignore             (Exclusiones Docker)
 ┃ ┗ 📜 package.json              (Dependencias NPM)
 ┣ 📂 init-db/                    (Scripts inicialización DB)
 ┣ 📜 docker-compose.yml          (Orquestación de servicios)
 ┣ 📜 DOCKER_README.md            (Guía completa de Docker)
 ┣ 📜 start-docker.bat            (Script inicio Windows)
 ┣ 📜 start-docker.sh             (Script inicio Linux/macOS)
 ┣ 📜 env.example                 (Variables de entorno ejemplo)
 ┗ 📜 README.md                   (Este archivo)
```

## ⚙️ Funcionalidades Clave Implementadas

### Gestión de Usuarios
- Registro e inicio de sesión de usuarios  
- Acceso basado en roles (compradores y vendedores)  
- Gestión de perfil con información completa
- Autenticación JWT segura

### Gestión de Productos
- Listado y detalles de productos con imágenes
- Búsqueda y filtrado de productos por categoría
- Gestión de inventario para vendedores  
- CRUD completo para productos
- Sistema de descuentos y precios originales
- Control de stock en tiempo real

### Experiencia de Compra
- Funcionalidad de carrito de compras completamente operativa
- Proceso de checkout con múltiples métodos de pago
- Gestión de descuentos y validación de stock
- Historial de compras ("Mis Compras") con contador preciso
- Página de ventas para vendedores ("Mis Ventas") con datos del cliente

### Gestión de Órdenes
- Creación de órdenes desde el carrito
- Estados de órdenes (Pendiente, Confirmado, Enviado, Entregado)
- Seguimiento completo de órdenes
- Relación productos-órdenes optimizada

### Temática Personalizada
- Interfaz completamente tematizada con Dragon Ball Z  
- Animaciones y efectos visuales personalizados  
- Terminología tematizada en toda la aplicación  
- Diseño responsive en todos los dispositivos

## 🚀 Primeros Pasos

### Opción 1: Ejecución con Docker (Recomendado)

#### Requisitos Previos
- Docker Desktop instalado y ejecutándose
- Docker Compose disponible
- Al menos 4GB de RAM disponible

#### Inicio Rápido
```bash
# Windows
./start-docker.bat

# Linux/macOS  
./start-docker.sh

# O manualmente
docker-compose up --build
```

#### Acceso a la Aplicación
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080  
- **Base de Datos**: localhost:3306

### Opción 2: Ejecución Manual

#### Requisitos Previos
- Java JDK 17 o superior  
- Node.js y npm  
- MySQL 8.0

#### Configuración de la Base de Datos
```sql
CREATE DATABASE shopdb;
-- Las tablas se crean automáticamente
```

#### Configuración del Backend
```bash
cd back_end/server
./mvnw.cmd spring-boot:run  # Windows
./mvnw spring-boot:run      # Linux/macOS
```

#### Configuración del Frontend
```bash
cd front_end
npm install
npm run dev
```

## 🐳 Docker y Contenedores

### Servicios Incluidos
- **MySQL 8.0**: Base de datos persistente
- **Spring Boot**: Backend API con Java 17
- **React + Nginx**: Frontend optimizado para producción

### Comandos Docker Útiles
```bash
# Ver logs
docker-compose logs -f backend

# Parar servicios
docker-compose down

# Reiniciar con datos frescos
docker-compose down -v && docker-compose up --build

# Ver estado de contenedores
docker-compose ps
```

### Características Docker
- ✅ Health checks automáticos
- ✅ Persistencia de datos
- ✅ Red interna segura
- ✅ Variables de entorno configurables
- ✅ Build optimizado multi-stage
- ✅ Scripts de inicio automatizados

## 🔧 Configuración Avanzada

### Variables de Entorno
Consulta `env.example` para configuraciones personalizadas:
- Puertos de aplicación
- Credenciales de base de datos  
- Configuración JWT
- URLs de CORS

### Desarrollo
Para desarrollo activo:
```bash
# Rebuild solo el servicio modificado
docker-compose build backend  # o frontend
docker-compose up -d backend
```

## 🔮 Roadmap Futuro

- ✅ ~~Dockerización para facilitar el despliegue~~ (Completado)
- 🔄 Desarrollo de aplicación móvil  
- 🔄 Panel de análisis avanzado  
- 🔄 Integración con pasarelas de pago reales
- 🔄 Sistema de notificaciones en tiempo real
- 🔄 Opciones de temas ampliadas  
- 🔄 API de terceros para tracking de envíos
- 🔄 Sistema de reviews y calificaciones

## 🐛 Correcciones Implementadas

Durante el desarrollo reciente se solucionaron:
- ✅ Problemas de compatibilidad con Java 24
- ✅ Conexión exitosa a base de datos MySQL existente
- ✅ Configuración correcta de puertos Frontend ↔ Backend
- ✅ Contador de artículos en "Mis Compras" (order.items → order.orderProducts)
- ✅ Visualización del nombre del cliente en "Mis Ventas"
- ✅ Optimización de configuración Maven y Spring Boot

## 📊 Datos de la Aplicación

### Base de Datos Poblada
- **8 Categorías**: Suplementos, Proteínas, Accesorios, Vitaminas, Ropa, Equipamiento, Pre-entreno, Post-entreno
- **14+ Productos**: Con precios, descripciones, imágenes y stock
- **Múltiples Vendedores**: Sistema de vendedores funcional
- **Datos de Prueba**: Listos para testing inmediato

---

## 💬 Conclusión

Power Ki Gym E-commerce ha evolucionado hasta convertirse en una plataforma de e-commerce completamente funcional, dockerizada y lista para producción. La integración exitosa de elementos visuales de Dragon Ball Z crea una experiencia única para el usuario, mientras que la arquitectura robusta con Spring Boot, React y MySQL garantiza un rendimiento profesional.

**🆕 Nuevas Capacidades:**
- **Dockerización completa** para deploy en cualquier entorno
- **Base de datos funcional** con productos reales
- **Frontend y Backend** completamente integrados
- **Gestión de usuarios** diferenciada (compradores/vendedores)
- **Sistema de órdenes** completo y funcional

Este proyecto demuestra la capacidad de nuestro equipo para entregar aplicaciones production-ready que combinan innovación visual, funcionalidad profesional y las mejores prácticas de desarrollo moderno. 🏋️‍♂️🐉⚡

### 🎯 Estado Final
✅ **Backend**: Spring Boot funcionando perfectamente  
✅ **Frontend**: React con Redux completamente operativo  
✅ **Base de Datos**: MySQL conectada con datos reales  
✅ **Docker**: Aplicación completamente containerizada  
✅ **Integración**: Stack completo funcionando end-to-end  

**¡La aplicación está 100% lista para usar y desplegar! 🚀**
