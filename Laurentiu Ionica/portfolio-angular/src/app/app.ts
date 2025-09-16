import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent, Project, Skill, SkillCategory, PersonalInfo } from './components/main/main.component';
import { FooterComponent } from './components/footer/footer.component';

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
        { name: 'Node.js', level: 3 },
        { name: 'Express', level: 3 },
        { name: 'MariaDB', level: 4 },
        { name: 'MySQL', level: 3 }
      ]
    },
    {
      name: 'Herramientas',
      skills: [
        { name: 'GitHub', level: 4 },
        { name: 'VS Code', level: 5 },
        { name: 'MySQL Workbench', level: 3 },
        { name: 'Draw.io', level: 4 }
      ]
    }
  ]);

  // Información personal
  protected readonly personalInfo = signal<PersonalInfo>({
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
      description: 'Cronómetro web funcional con controles de inicio, pausa y reinicio. Incluye contador de milisegundos, diseño moderno con gradientes animados y efectos visuales. Implementado con JavaScript puro para máxima compatibilidad.',
      icon: '⏱️',
      technologies: ['JavaScript', 'HTML5', 'CSS3'],
      year: '2024',
      githubUrl: 'https://github.com/Laurentiuionica/Laurentiuionica.github.io/tree/main/cronómetro',
      liveUrl: 'https://laurentiuionica.github.io/cronómetro/',
      featured: true
    },
    {
      id: 2,
      name: 'Sistema de Formularios',
      description: 'Sistema dinámico para crear y gestionar formularios con validación en tiempo real, campos dinámicos y almacenamiento local de datos. Incluye funcionalidades de agregar y eliminar elementos del formulario con validación instantánea.',
      icon: '📝',
      technologies: ['JavaScript', 'HTML5', 'CSS3'],
      year: '2024',
      githubUrl: 'https://github.com/Laurentiuionica/Laurentiuionica.github.io/tree/main/formularioConLista',
      liveUrl: 'https://laurentiuionica.github.io/formularioConLista/formulario.html',
      featured: false
    },
    {
      id: 3,
      name: 'Lista de Personas',
      description: 'Aplicación de gestión de personas con funcionalidades de agregar, editar, eliminar y visualizar información de contactos. Incluye persistencia local con localStorage, interfaz intuitiva y validación de datos.',
      icon: '👥',
      technologies: ['JavaScript', 'HTML5', 'CSS3'],
      year: '2024',
      githubUrl: 'https://github.com/Laurentiuionica/Laurentiuionica.github.io/tree/main/formularioConLista',
      liveUrl: 'https://laurentiuionica.github.io/formularioConLista/lista.html',
      featured: false
    },
    {
      id: 4,
      name: 'Juego del Ahorcado',
      description: 'Implementación completa del clásico juego del ahorcado con interfaz gráfica moderna, palabras aleatorias y efectos visuales. Incluye lógica de juego robusta y experiencia de usuario optimizada.',
      icon: '🎯',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      year: '2024',
      githubUrl: 'https://github.com/Laurentiuionica/Laurentiuionica.github.io/tree/main/multiTasks/Ahorcado',
      liveUrl: 'https://laurentiuionica.github.io/multiTasks/Ahorcado/',
      featured: true
    },
    {
      id: 5,
      name: 'Buscador de Contenido',
      description: 'Herramienta de búsqueda avanzada con filtros dinámicos, resultados en tiempo real y búsqueda por múltiples criterios. Incluye interfaz intuitiva y algoritmos de búsqueda optimizados.',
      icon: '🔍',
      technologies: ['TypeScript', 'JavaScript', 'HTML5'],
      year: '2024',
      githubUrl: 'https://github.com/Laurentiuionica/Laurentiuionica.github.io/tree/main/Sesion2',
      liveUrl: 'https://laurentiuionica.github.io/Sesion2/',
      featured: false
    },
    {
      id: 6,
      name: 'Calculadora de Números Primos',
      description: 'Aplicación matemática para calcular y verificar números primos con algoritmo optimizado, visualización de resultados y análisis de propiedades numéricas. Incluye interfaz clara y cálculos eficientes.',
      icon: '🔢',
      technologies: ['TypeScript', 'JavaScript', 'HTML5'],
      year: '2024',
      githubUrl: 'https://github.com/Laurentiuionica/Laurentiuionica.github.io/tree/main/multiTasks/buscadorNumeroPrimo',
      liveUrl: 'https://laurentiuionica.github.io/multiTasks/buscadorNumeroPrimo/',
      featured: false
    },
    {
      id: 7,
      name: 'Sistema de Coordenadas',
      description: 'Visualizador interactivo de coordenadas cartesianas con gráficos dinámicos, cálculos matemáticos en tiempo real y representación visual de puntos y funciones. Incluye herramientas de análisis geométrico.',
      icon: '📊',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      year: '2024',
      githubUrl: 'https://github.com/Laurentiuionica/Laurentiuionica.github.io/tree/main/multiTasks/Coordenadas',
      liveUrl: 'https://laurentiuionica.github.io/multiTasks/Coordenadas/',
      featured: false
    },
    {
      id: 8,
      name: 'Galería de Imágenes',
      description: 'Galería interactiva con filtros por categorías y navegación intuitiva entre imágenes. Incluye visualización optimizada y diseño responsive.',
      icon: '🖼️',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      year: '2024',
      githubUrl: 'https://github.com/Laurentiuionica/Laurentiuionica.github.io/tree/main/galeriaDeimagenes',
      liveUrl: 'https://laurentiuionica.github.io/galeriaDeimagenes/',
      featured: false
    },
    {
      id: 9,
      name: 'Juego de Banderas',
      description: 'Aplicación educativa interactiva para aprender banderas del mundo con sistema de puntuación y modo de práctica. Incluye interfaz moderna y experiencia de usuario optimizada.',
      icon: '🏳️',
      technologies: ['JavaScript', 'HTML5', 'CSS3'],
      year: '2024',
      githubUrl: 'https://github.com/Laurentiuionica/Laurentiuionica.github.io/tree/main/JuegoBanderas',
      liveUrl: 'https://laurentiuionica.github.io/juegoBanderas/',
      featured: false
    }
  ]);

  // Sistema de filtros por tecnologías - Angular, JavaScript, TypeScript y Destacados
  protected readonly availableTechnologies = computed(() => {
    return ['Angular', 'JavaScript', 'TypeScript', 'Destacados'];
  });

  // Proyectos filtrados según la tecnología seleccionada
  protected readonly filteredProjects = computed(() => {
    const filter = this.selectedFilter();
    if (filter === 'all') {
      return this.projects();
    }
    if (filter === 'Destacados') {
      return this.projects().filter(project => project.featured);
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