import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from '../../pages/about/about.component';
import { SkillsComponent } from '../../pages/skills/skills.component';
import { PortfolioComponent } from '../../pages/portfolio/portfolio.component';

export type Section = 'about' | 'skills' | 'portfolio';

export interface Project {
  id: number;
  name: string;
  description: string;
  icon: string;
  technologies: string[];
  year: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
}

export interface Skill {
  name: string;
  level: number;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  age: number;
  email: string;
  introduction: string;
}

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
  readonly personalInfo = input.required<PersonalInfo>();
  readonly skills = input.required<SkillCategory[]>();
  readonly projects = input.required<Project[]>();
  readonly filteredProjects = input.required<Project[]>();
  readonly availableTechnologies = input.required<string[]>();
  readonly selectedFilter = input.required<string>();

  // Eventos de salida para comunicación con el componente padre
  readonly filterChange = output<string>();
  readonly projectView = output<Project>();
  readonly projectGithub = output<Project>();
}
