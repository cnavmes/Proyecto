import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
document.documentElement.classList.add('dark'); 
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    // Usamos fetch + interceptores inyectados desde DI
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    ),
    provideAnimations(),
    // Registro del interceptor para agregar el header Authorization
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
});