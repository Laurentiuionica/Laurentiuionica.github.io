// Interfaz que define la estructura de un producto
// Esto nos ayuda a tener tipado fuerte y saber qué propiedades tiene cada producto
export interface Producto {
  id: number;           // Identificador único del producto
  nombre: string;       // Nombre del producto
  precio: number;       // Precio en euros
  descripcion: string;  // Descripción del producto
  categoria: string;    // Categoría a la que pertenece
  imagen: string;       // URL de la imagen del producto
  stock: number;        // Cantidad disponible en stock
  destacado: boolean;   // Si es un producto destacado o no
}
