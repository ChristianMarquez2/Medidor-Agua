import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { SupabaseService } from '../services/supabase.service';
import { RegistrosService } from '../services/registros.service'; // <-- Importar RegistrosService

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <ion-content>
      <!-- Esta página ahora es solo un 'router' -->
    </ion-content>
  `,
  imports: [CommonModule, IonContent],
})
export class HomePage implements OnInit {
  constructor(
    private router: Router,
    private registrosService: RegistrosService // <-- Usar RegistrosService
  ) {}

  async ngOnInit() {
    // Esta página ahora solo redirige al dashboard correcto
    await this.verificarSesionYRuta();
  }

  async verificarSesionYRuta() {
    const rol = await this.registrosService.getUserRole();

    if (!rol) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    // Redirige al dashboard principal de cada rol
    if (rol === 'admin') {
      // ANTES: /admin-registros
      this.router.navigate(['/tabs/admin-registros'], { replaceUrl: true });
    } else {
      // ANTES: /mis-lecturas
      this.router.navigate(['/tabs/mis-lecturas'], { replaceUrl: true });
    }
  }
}