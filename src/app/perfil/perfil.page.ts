import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
} from '@ionic/angular/standalone';

import { StatusBar } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular/standalone';
import { SupabaseService } from '../services/supabase.service';
import { addIcons } from 'ionicons';
import { logOutOutline, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
  ],
})
export class PerfilPage implements OnInit {
  userEmail: string | undefined = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private platform: Platform
  ) {
    addIcons({ logOutOutline, personCircleOutline });
  }

  async ngOnInit() {
    const { data } = await this.supabaseService.getCurrentUser();
    this.userEmail = data.user?.email;
  }

  async signOut() {

    if (this.platform.is('capacitor')) {
      try {
        await StatusBar.show();
      } catch (e) {
        console.error('Error al mostrar StatusBar', e);
      }
    }
    await this.supabaseService.signOut();
    // Redirige al login y limpia el historial
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}