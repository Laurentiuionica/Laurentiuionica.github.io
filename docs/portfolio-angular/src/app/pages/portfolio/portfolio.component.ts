import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../components/main/main.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class PortfolioComponent {
  // Propiedades de entrada para los proyectos
  readonly projects = input.required<Project[]>();
  readonly filteredProjects = input.required<Project[]>();
  readonly availableTechnologies = input.required<string[]>();
  readonly selectedFilter = input.required<string>();

  // Eventos de salida para comunicación con el componente padre
  readonly filterChange = output<string>();
  readonly projectView = output<Project>();
  readonly projectGithub = output<Project>();

  // Método para cambiar el filtro de tecnologías
  protected setFilter(filter: string): void {
    this.filterChange.emit(filter);
  }

  // Método para abrir un proyecto en una nueva pestaña
  protected viewProject(project: Project): void {
    this.projectView.emit(project);
  }

  // Método para abrir el repositorio de GitHub
  protected openGithub(project: Project): void {
    this.projectGithub.emit(project);
  }
}
