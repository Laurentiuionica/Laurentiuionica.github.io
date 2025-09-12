import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Skill {
  name: string;
  level: number;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class SkillsComponent {
  // Lista de habilidades técnicas recibida del componente padre
  readonly skills = input.required<SkillCategory[]>();

  // Método para generar las estrellas de calificación
  protected getStars(level: number): string[] {
    return Array(5).fill('⭐').map((_, index) => 
      index < level ? '⭐' : '☆'
    );
  }
}
