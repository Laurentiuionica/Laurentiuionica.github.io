# Servicio Fake - Productos Angular 20

Esta es una aplicación de demostración que muestra cómo crear un servicio fake en Angular 20 que simula una API real para obtener una lista de productos.

## 🚀 Características

- **Servicio Fake**: Simula una API real con datos de productos inventados
- **Componente de Productos**: Muestra los productos en una cuadrícula responsive
- **Diseño Moderno**: Interfaz limpia y atractiva con efectos hover
- **Productos Destacados**: Algunos productos tienen un badge especial
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Comentarios en Español**: Todo el código está comentado en español

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   └── producto/
│   │       ├── producto.component.ts
│   │       ├── producto.component.html
│   │       └── producto.component.css
│   ├── models/
│   │   └── producto.interface.ts
│   ├── services/
│   │   └── producto.service.ts
│   ├── app.component.ts
│   ├── app.component.html
│   └── app.component.css
├── main.ts
├── index.html
└── styles.css
```

## 🛠️ Instalación y Ejecución

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar la aplicación**:
   ```bash
   npm start
   ```

3. **Abrir en el navegador**:
   La aplicación estará disponible en `http://localhost:4200`

## 📋 Funcionalidades del Servicio

El `ProductoService` incluye los siguientes métodos:

- `obtenerProductos()`: Obtiene todos los productos
- `obtenerProductoPorId(id)`: Obtiene un producto específico por ID
- `obtenerProductosDestacados()`: Obtiene solo los productos destacados
- `obtenerProductosPorCategoria(categoria)`: Filtra productos por categoría

## 🎨 Características del Diseño

- **Grid Responsive**: Los productos se organizan en una cuadrícula que se adapta al tamaño de pantalla
- **Efectos Hover**: Las tarjetas de productos tienen animaciones suaves
- **Productos Destacados**: Se muestran con un borde dorado y badge especial
- **Indicador de Stock**: Muestra el stock disponible, con color rojo si es bajo
- **Imágenes Placeholder**: Usa imágenes de placeholder para simular las fotos de productos

## 🔧 Tecnologías Utilizadas

- **Angular 20**: Framework principal
- **TypeScript**: Lenguaje de programación
- **CSS Grid**: Para el layout responsive
- **RxJS**: Para el manejo de observables
- **Standalone Components**: Arquitectura moderna de Angular

## 📝 Notas

- Todos los comentarios están en español para facilitar el entendimiento
- El código está diseñado para ser educativo y fácil de seguir
- Los datos son completamente ficticios y solo para demostración
