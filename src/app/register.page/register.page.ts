import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  ToastController,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonSpinner,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
  ],
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  loading = false;

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async register() {
    if (!this.email || !this.password) {
      this.showToast('Completa todos los campos', 'danger');
      return;
    }
    if (this.password.length < 6) {
      this.showToast('La contraseña debe tener al menos 6 caracteres', 'danger');
      return;
    }

    this.loading = true;

    const { data, error } = await this.supabase.signUp(this.email, this.password);

    this.loading = false;

    if (error) {
      this.showToast(error.message, 'danger');
      return;
    }

    if (data.user) {
      // Éxito
      this.showToast(
        '¡Registro exitoso! Revisa tu correo para confirmar la cuenta.',
        'success'
      );
      this.router.navigate(['/login']);
    }
  }

  async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: color,
    });
    await toast.present();
  }
}