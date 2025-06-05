# 🐉💪 Power Ki Gym - Plataforma de E-commerce

## 📌 Descripción del Proyecto

Power Ki Gym E-commerce es una plataforma digital que ha evolucionado de un concepto simple a una experiencia de compra interactiva completamente tematizada. Construida con una estética inspirada en Dragon Ball Z, la plataforma permite a los usuarios comprar suplementos para el gimnasio, equipamiento de entrenamiento y accesorios, todo con una interfaz inmersiva que captura la energía y el poder del universo de Dragon Ball.

## 👥 Integrantes del Equipo

- Solaeche Joel  
- Matías Gabriel  
- Hernández Facundo  
- Kraus Gabriel  

## 🚀 Estado Actual del Proyecto

El proyecto ha implementado exitosamente:

### ✅ Backend (Java Spring Boot)
- Endpoints RESTful para productos, usuarios, carrito y órdenes  
- Autenticación y autorización basada en JWT  
- Persistencia de datos con MySQL  
- Funcionalidades de seguridad para rutas protegidas  
- Soporte de base de datos H2 para desarrollo  

### ✅ Frontend (React + Vite)
- Interfaz completa con temática de Dragon Ball Z en todas las páginas  
- Integración con Redux para el manejo de estados  
- Diseño responsive para todos los tamaños de dispositivo  
- Catálogo de productos con filtros y buscador  
- Autenticación de usuario (inicio de sesión/registro)  
- Funcionalidad de carrito de compras  
- Gestión de productos para vendedores  

### ✅ Implementación de la Temática
Toda la aplicación ha sido tematizada con elementos inspirados en Dragon Ball Z:
- Paleta de colores personalizada (fondos azul oscuro, acentos naranjas/dorados)  
- Terminología tematizada (Productos → "Arsenal de Entrenamiento")  
- Animaciones interactivas (carga de ki, brillo de super saiyajin)  
- Diseño responsive en todas las páginas  

## 🛠️ Tecnologías Utilizadas

### Backend
- Java 17  
- Spring Boot 3.2.3  
- Spring Security con JWT  
- Spring Data JPA  
- Base de datos MySQL / H2  
- Maven  

### Frontend
- React 19.1  
- Redux Toolkit + RTK Query  
- Tailwind CSS 4.1  
- Vite 6.3  
- Axios para llamadas a la API  

## 📁 Estructura del Proyecto

```
📦 power-ki-gym-ecommerce/
 ┣ 📂 back_end/
 ┃ ┗ 📂 server/
 ┃   ┣ 📂 src/           (Código backend en Java)
 ┃   ┣ 📂 target/        (Salida compilada)
 ┃   ┣ 📂 data/          (Archivos de base de datos)
 ┃   ┗ 📜 pom.xml        (Dependencias Maven)
 ┣ 📂 front_end/
 ┃ ┣ 📂 src/
 ┃ ┃ ┣ 📂 assets/        (Imágenes y recursos estáticos)
 ┃ ┃ ┣ 📂 components/    (Componentes de React)
 ┃ ┃ ┣ 📂 context/       (Proveedores de contexto de React)
 ┃ ┃ ┣ 📂 hooks/         (Hooks personalizados de React)
 ┃ ┃ ┣ 📂 pages/         (Componentes de páginas)
 ┃ ┃ ┣ 📂 store/         (Configuración de Redux)
 ┃ ┃ ┗ 📜 main.jsx       (Punto de entrada de la app)
 ┃ ┣ 📂 public/          (Archivos estáticos)
 ┃ ┗ 📜 package.json     (Dependencias NPM)
```

## ⚙️ Funcionalidades Clave Implementadas

### Gestión de Usuarios
- Registro e inicio de sesión de usuarios  
- Acceso basado en roles (compradores y vendedores)  
- Gestión de perfil  

### Gestión de Productos
- Listado y detalles de productos  
- Búsqueda y filtrado de productos  
- Gestión de inventario para vendedores  

### Experiencia de Compra
- Funcionalidad de carrito de compras  
- Proceso de checkout  
- Gestión de descuentos  
- Validación de stock  

### Temática Personalizada
- Interfaz completamente tematizada con Dragon Ball Z  
- Animaciones y efectos visuales personalizados  
- Terminología tematizada en toda la aplicación  

## 🚀 Primeros Pasos

### Requisitos Previos
- Java JDK 17 o superior  
- Node.js y npm  
- MySQL  

### Configuración del Backend
```
cd back_end/server
mvn spring-boot:run
```

### Configuración del Frontend
```
cd front_end
npm install
npm run dev
```

## 🔮 Planes a Futuro

- Desarrollo de aplicación móvil  
- Panel de análisis avanzado  
- Integración con pasarelas de pago  
- Dockerización para facilitar el despliegue  
- Opciones de temas ampliadas  

---

## 💬 Conclusión

Power Ki Gym E-commerce ha evolucionado de una simple idea a una plataforma de compras en línea completamente funcional y con una estética única. La integración de elementos visuales de Dragon Ball Z crea una experiencia envolvente para el usuario, sin dejar de lado la funcionalidad profesional del comercio electrónico. La combinación de un backend robusto con Spring Boot y un frontend moderno con React y Redux ofrece una base sólida para futuras mejoras.

Este proyecto demuestra la capacidad de nuestro equipo para entregar aplicaciones funcionales y visualmente impactantes que se destacan en el competitivo mundo del e-commerce. 🏋️‍♂️🐉⚡
