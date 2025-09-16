import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Producto } from '../models/producto.interface';

@Injectable({
  providedIn: 'root' // Esto hace que el servicio esté disponible en toda la aplicación
})
export class ProductoService {

  // Lista de productos inventados que simula lo que vendría de una API real
  private productos: Producto[] = [
    {
      id: 1,
      nombre: 'iPhone 15 Pro',
      precio: 1199,
      descripcion: 'El último iPhone con cámara profesional y chip A17 Pro',
      categoria: 'Smartphones',
      imagen: 'https://via.placeholder.com/300x200?text=iPhone+15+Pro',
      stock: 25,
      destacado: true
    },
    {
      id: 2,
      nombre: 'Samsung Galaxy S24',
      precio: 999,
      descripcion: 'Smartphone Android con pantalla AMOLED y cámara de 200MP',
      categoria: 'Smartphones',
      imagen: 'https://via.placeholder.com/300x200?text=Galaxy+S24',
      stock: 18,
      destacado: true
    },
    {
      id: 3,
      nombre: 'MacBook Air M3',
      precio: 1299,
      descripcion: 'Portátil ultraligero con chip M3 y pantalla de 13 pulgadas',
      categoria: 'Portátiles',
      imagen: 'https://via.placeholder.com/300x200?text=MacBook+Air',
      stock: 12,
      destacado: false
    },
    {
      id: 4,
      nombre: 'Dell XPS 13',
      precio: 1099,
      descripcion: 'Portátil Windows con pantalla 4K y procesador Intel i7',
      categoria: 'Portátiles',
      imagen: 'https://via.placeholder.com/300x200?text=Dell+XPS',
      stock: 8,
      destacado: false
    },
    {
      id: 5,
      nombre: 'AirPods Pro 2',
      precio: 249,
      descripcion: 'Auriculares inalámbricos con cancelación de ruido activa',
      categoria: 'Audio',
      imagen: 'https://via.placeholder.com/300x200?text=AirPods+Pro',
      stock: 35,
      destacado: true
    },
    {
      id: 6,
      nombre: 'Sony WH-1000XM5',
      precio: 399,
      descripcion: 'Auriculares over-ear con la mejor cancelación de ruido del mercado',
      categoria: 'Audio',
      imagen: 'https://via.placeholder.com/300x200?text=Sony+WH1000XM5',
      stock: 15,
      destacado: false
    },
    {
      id: 7,
      nombre: 'iPad Pro 12.9"',
      precio: 1099,
      descripcion: 'Tablet profesional con pantalla Liquid Retina XDR y chip M2',
      categoria: 'Tablets',
      imagen: 'https://via.placeholder.com/300x200?text=iPad+Pro',
      stock: 20,
      destacado: true
    },
    {
      id: 8,
      nombre: 'Samsung Galaxy Tab S9',
      precio: 799,
      descripcion: 'Tablet Android con pantalla AMOLED y S Pen incluido',
      categoria: 'Tablets',
      imagen: 'https://via.placeholder.com/300x200?text=Galaxy+Tab+S9',
      stock: 14,
      destacado: false
    }
  ];

  constructor() { }

  // Método que simula una llamada a la API para obtener todos los productos
  // Devuelve un Observable que emite la lista de productos
  obtenerProductos(): Observable<Producto[]> {
    // Simulamos un pequeño delay como si fuera una llamada real a la API
    return of(this.productos);
  }

  // Método para obtener un producto específico por su ID
  obtenerProductoPorId(id: number): Observable<Producto | undefined> {
    const producto = this.productos.find(p => p.id === id);
    return of(producto);
  }

  // Método para obtener solo los productos destacados
  obtenerProductosDestacados(): Observable<Producto[]> {
    const destacados = this.productos.filter(p => p.destacado);
    return of(destacados);
  }

  // Método para buscar productos por categoría
  obtenerProductosPorCategoria(categoria: string): Observable<Producto[]> {
    const productosFiltrados = this.productos.filter(p => 
      p.categoria.toLowerCase().includes(categoria.toLowerCase())
    );
    return of(productosFiltrados);
  }
}
