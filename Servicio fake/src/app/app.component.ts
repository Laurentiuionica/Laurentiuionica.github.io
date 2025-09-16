import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoComponent } from './components/producto/producto.component';

@Component({
  selector: 'app-root',
  standalone: true, // Componente standalone de Angular 17+
  imports: [CommonModule, ProductoComponent], // Importamos el componente de productos
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Título de la aplicación
  titulo = 'Tienda de Productos - Servicio Fake';
}
