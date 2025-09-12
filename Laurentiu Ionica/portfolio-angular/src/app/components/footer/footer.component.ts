import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class FooterComponent {
  // Información personal recibida del componente padre
  readonly personalInfo = input.required<{
    name: string;
    title: string;
    location: string;
    age: number;
    email: string;
    introduction: string;
  }>();
}
