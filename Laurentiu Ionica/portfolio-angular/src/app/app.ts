import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { FooterComponent } from './components/footer/footer.component';

// Interfaces de datos
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

export type Section = 'about' | 'skills' | 'portfolio';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, HeaderComponent, MainComponent, FooterComponent]
})
export class AppComponent {
  // Estado de la aplicación
  protected readonly currentSection = signal<Section>('about');
  protected readonly selectedFilter = signal<string>('all');

  // Datos de habilidades técnicas
  protected readonly skills = signal<SkillCategory[]>([
    {
      name: 'Frontend',
      skills: [
        { name: 'Angular', level: 3 },
        { name: 'TypeScript', level: 4 },
        { name: 'JavaScript', level: 4 },
        { name: 'HTML5', level: 5 },
        { name: 'CSS3', level: 5 }
      ]
    },
    {
      name: 'Backend',
      skills: [
        { name: 'Node.js', level: 2 },
        { name: 'Express', level: 2 },
        { name: 'MariaDB', level: 3 },
        { name: 'MySQL', level: 3 }
      ]
    },
    {
      name: 'Herramientas',
      skills: [
        { name: 'Git', level: 4 },
        { name: 'VS Code', level: 5 },
        { name: 'Chrome DevTools', level: 4 },
        { name: 'Postman', level: 3 }
      ]
    }
  ]);

  // Información personal
  protected readonly personalInfo = signal({
    name: 'Laurentiu Ionica',
    title: 'Desarrollador Frontend',
    location: 'Tomelloso, Ciudad Real, España',
    age: 25,
    email: 'ionica2802@gmail.com',
    introduction: 'Apasionado desarrollador frontend con una sólida base en tecnologías web modernas. Me especializo en crear experiencias de usuario excepcionales utilizando las últimas tecnologías como Angular, TypeScript y JavaScript. Mi enfoque se centra en escribir código limpio, eficiente y mantenible, siempre buscando la excelencia técnica y la innovación en cada proyecto.'
  });

  // Lista de proyectos del portfolio
  protected readonly projects = signal<Project[]>([
    {
      id: 1,
      name: 'Cronómetro Interactivo',
      description: 'Cronómetro web con controles de inicio, pausa y reinicio. Incluye contador de milisegundos y diseño moderno con efectos visuales.',
      icon: '⏱️',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      year: '2024',
      githubUrl: 'https://github.com/Laurentiuionica/Laurentiuionica.github.io/tree/main/Sesion11',
      liveUrl: 'https://laurentiuionica.github.io/Sesion11/',
      featured: true
    },
    {
      id: 2,
      name: 'Sistema de Formularios',
      description: 'Sistema dinámico para crear y gestionar formularios con validación en tiempo real y almacenamiento local de datos.',
      icon: '📝',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      year: '2024',
      githubUrl: 'https://github.com/Laurentiuionica/Laurentiuionica.github.io/tree/main/Sesion_14/Sesion14.1',
      liveUrl: 'https://laurentiuionica.github.io/Sesion_14/Sesion14.1/formulario.html',
      featured: false
    },
    {
      id: 3,
      name: 'Lista de Tareas',
      description: 'Aplicación de gestión de tareas con funcionalidades de agregar, editar, eliminar y marcar como completadas con persistencia local.',
      icon: '✅',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      year: '2024',
      githubUrl: 'https://github.com/Laurentiuionica/Laurentiuionica.github.io/tree/main/Sesion_14/Sesion14.1',
      liveUrl: 'https://laurentiuionica.github.io/Sesion_14/Sesion14.1/lista.html',
      featured: false
    },
    {
      id: 4,
      name: 'Juego del Ahorcado',
      description: 'Implementación del clásico juego del ahorcado con interfaz gráfica, sistema de puntuación y palabras aleatorias.',
      icon: '🎯',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      year: '2024',
      githubUrl: 'https://github.com/Laurentiuionica/Laurentiuionica.github.io/tree/main/Sesion10/taskAhorcado',
      liveUrl: 'https://laurentiuionica.github.io/Sesion10/taskAhorcado/',
      featured: true
    },
    {
      id: 5,
      name: 'Buscador de Contenido',
      description: 'Herramienta de búsqueda con filtros avanzados, resultados en tiempo real y búsqueda por múltiples criterios.',
      icon: '🔍',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      year: '2024',
      githubUrl: 'https://github.com/Laurentiuionica/Laurentiuionica.github.io/tree/main/Sesion2',
      liveUrl: 'https://laurentiuionica.github.io/Sesion2/',
      featured: false
    },
    {
      id: 6,
      name: 'Calculadora de Números Primos',
      description: 'Aplicación para calcular y verificar números primos con algoritmo optimizado y visualización de resultados.',
      icon: '🔢',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      year: '2024',
      githubUrl: 'https://github.com/Laurentiuionica/Laurentiuionica.github.io/tree/main/Sesion10/taskNumeroPrimo',
      liveUrl: 'https://laurentiuionica.github.io/Sesion10/taskNumeroPrimo/',
      featured: false
    },
    {
      id: 7,
      name: 'Sistema de Coordenadas',
      description: 'Visualizador interactivo de coordenadas cartesianas con gráficos dinámicos y cálculos matemáticos.',
      icon: '📊',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      year: '2024',
      githubUrl: 'https://github.com/Laurentiuionica/Laurentiuionica.github.io/tree/main/Sesion10/taskCoordenadas',
      liveUrl: 'https://laurentiuionica.github.io/Sesion10/taskCoordenadas/',
      featured: false
    },
    {
      id: 8,
      name: 'Galería de Imágenes',
      description: 'Galería interactiva con lightbox, filtros por categorías y navegación intuitiva entre imágenes.',
      icon: '🖼️',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      year: '2024',
      githubUrl: 'https://github.com/Laurentiuionica/Laurentiuionica.github.io/tree/main/Sesion_13',
      liveUrl: 'https://laurentiuionica.github.io/Sesion_13/',
      featured: false
    },
    {
      id: 9,
      name: 'Selector de Banderas',
      description: 'Aplicación educativa para aprender banderas del mundo con sistema de puntuación y modo de práctica.',
      icon: '🏳️',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      year: '2024',
      githubUrl: 'https://github.com/Laurentiuionica/Laurentiuionica.github.io/tree/main/Sesion1',
      liveUrl: 'https://laurentiuionica.github.io/Sesion1/',
      featured: false
    }
  ]);

  // Sistema de filtros por tecnologías
  protected readonly availableTechnologies = computed(() => {
    const allTechs = this.projects().flatMap(project => project.technologies);
    return [...new Set(allTechs)].sort();
  });

  // Proyectos filtrados según la tecnología seleccionada
  protected readonly filteredProjects = computed(() => {
    const filter = this.selectedFilter();
    if (filter === 'all') {
      return this.projects();
    }
    return this.projects().filter(project => 
      project.technologies.includes(filter)
    );
  });

  // Métodos de navegación entre secciones
  protected setCurrentSection(section: Section): void {
    this.currentSection.set(section);
  }

  protected setFilter(filter: string): void {
    this.selectedFilter.set(filter);
  }

  // Métodos para manejar proyectos
  protected viewProject(project: Project): void {
    if (project.liveUrl) {
      window.open(project.liveUrl, '_blank');
    } else {
      this.openGithub(project);
    }
  }

  protected openGithub(project: Project): void {
    if (project.githubUrl) {
      window.open(project.githubUrl, '_blank');
    }
  }
}