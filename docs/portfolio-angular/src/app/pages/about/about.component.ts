import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalInfo } from '../../components/main/main.component';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class AboutComponent {
  // Información personal recibida del componente padre
  readonly personalInfo = input.required<PersonalInfo>();
}
