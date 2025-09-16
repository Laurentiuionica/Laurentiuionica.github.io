import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillCategory } from '../../components/main/main.component';

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
