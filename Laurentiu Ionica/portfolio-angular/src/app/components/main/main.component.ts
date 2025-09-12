import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from '../../pages/about/about.component';
import { SkillsComponent } from '../../pages/skills/skills.component';
import { PortfolioComponent } from '../../pages/portfolio/portfolio.component';

export type Section = 'about' | 'skills' | 'portfolio';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AboutComponent, SkillsComponent, PortfolioComponent]
})
export class MainComponent {
  // Propiedades de entrada para el contenido principal
  readonly currentSection = input.required<Section>();
  readonly personalInfo = input.required<{
    name: string;
    title: string;
    location: string;
    age: number;
    email: string;
    introduction: string;
  }>();
  readonly skills = input.required<any[]>();
  readonly projects = input.required<any[]>();
  readonly filteredProjects = input.required<any[]>();
  readonly availableTechnologies = input.required<string[]>();
  readonly selectedFilter = input.required<string>();

  // Eventos de salida para comunicación con el componente padre
  readonly filterChange = output<string>();
  readonly projectView = output<any>();
  readonly projectGithub = output<any>();
}
