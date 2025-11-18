import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // <-- Importa RouterLink
import {
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  // IonToast, <-- ELIMINADO
  IonSpinner,
  ToastController,
  AlertController,
} from '@ionic/angular/standalone';

import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html', // <-- Asegúrate que la ruta es correcta
  styleUrls: ['./login.page.scss'], // <-- Asegúrate que la ruta es correcta
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    // IonToast, <-- ELIMINADO
    IonSpinner,
    CommonModule,
    FormsModule,
    RouterLink, // <-- Añadido a imports
  ],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  loading = false;

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController // <-- Asegúrate de tener esto
  ) {}

  ngOnInit() {}

  async login() {
    if (!this.email || !this.password) {
      this.showToast('Completa todos los campos', 'danger');
      return;
    }

    this.loading = true;

    const { data, error } = await this.supabase.signIn(this.email, this.password);

    if (error || !data.user) {
      this.loading = false;
      this.showToast('Credenciales incorrectas', 'danger');
      return;
    }

    // Ya NO necesitamos revisar el rol aquí.
    // El guard y la página de tabs se encargarán.

    // ANTES: Redirigía a /mis-lecturas o /admin-registros
    // AHORA: Redirige SIEMPRE a /tabs
    this.router.navigateByUrl('/tabs', { replaceUrl: true });
  }

  // --- ¡NUEVA FUNCIÓN! ---
  async forgotPassword() {
    const alert = await this.alertController.create({
      header: 'Recuperar Contraseña',
      message: 'Ingresa tu correo y te enviaremos un enlace de recuperación.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'tu@correo.com',
          value: this.email,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Enviar',
          handler: async (data) => {
            if (!data.email) {
              this.showToast('Por favor, ingresa un correo', 'danger');
              return;
            }
            this.loading = true;
            const { error } = await this.supabase.sendPasswordReset(data.email);
            this.loading = false;

            if (error) {
              this.showToast(error.message, 'danger');
            } else {
              this.showToast('Correo de recuperación enviado.', 'success');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: 'bottom',
      color: color,
    });
    await toast.present();
  }
}