import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

// Iniciamos la aplicación Angular
bootstrapApplication(AppComponent)
  .catch(err => console.error(err));
