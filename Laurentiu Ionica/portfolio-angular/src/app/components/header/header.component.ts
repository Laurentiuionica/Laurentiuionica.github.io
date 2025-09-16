import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalInfo } from '../main/main.component';

export type Section = 'about' | 'skills' | 'portfolio';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class HeaderComponent {
  // Inputs
  readonly currentSection = input.required<Section>();
  readonly personalInfo = input.required<PersonalInfo>();

  // Outputs
  readonly sectionChange = output<Section>();

  // Método para cambiar la sección activa
  protected setCurrentSection(section: Section): void {
    this.sectionChange.emit(section);
  }
}
