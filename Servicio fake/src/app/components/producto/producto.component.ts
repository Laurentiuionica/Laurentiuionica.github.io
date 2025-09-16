import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto.interface';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-producto',
  standalone: true, // Componente standalone de Angular 17+
  imports: [CommonModule], // Importamos CommonModule para usar *ngFor, *ngIf, etc.
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  // Array donde guardaremos los productos que vengan del servicio
  productos: Producto[] = [];
  
  // Variable para controlar si estamos cargando los datos
  cargando: boolean = true;

  // Inyectamos el servicio en el constructor
  constructor(private productoService: ProductoService) { }

  // Este método se ejecuta cuando el componente se inicializa
  ngOnInit(): void {
    this.cargarProductos();
  }

  // Método que llama al servicio para obtener los productos
  cargarProductos(): void {
    this.cargando = true; // Activamos el indicador de carga
    
    // Llamamos al servicio y nos suscribimos al Observable
    this.productoService.obtenerProductos().subscribe({
      next: (productos) => {
        // Cuando recibimos los datos, los guardamos en nuestra variable
        this.productos = productos;
        this.cargando = false; // Desactivamos el indicador de carga
      },
      error: (error) => {
        // Si hay algún error, lo mostramos en consola
        console.error('Error al cargar productos:', error);
        this.cargando = false;
      }
    });
  }

  // Método para formatear el precio con el símbolo del euro
  formatearPrecio(precio: number): string {
    return `${precio}€`;
  }

  // Método para obtener las clases CSS según si el producto está destacado
  obtenerClasesDestacado(producto: Producto): string {
    return producto.destacado ? 'destacado' : '';
  }
}
