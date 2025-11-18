import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonList,
  IonImg
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-admin-registros',
  templateUrl: './admin-registros.page.html',
  styleUrls: ['./admin-registros.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonImg
  ]
})
export class AdminRegistrosPage implements OnInit {

  registros: any[] = [];
  loading = true;
  supabase: SupabaseClient;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.supabase = this.supabaseService.getClient();
  }

  async ngOnInit() {
    await this.cargarRegistros();
  }

  async cargarRegistros() {
    this.loading = true;

    try {
      // verificar usuario actual
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) {
        await this.router.navigate(['/login']);
        return;
      }

      // obtener rol del usuario
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('rol')
        .eq('id', user.id)
        .single();

      if (!profile || profile.rol !== 'admin') {
        alert('No tienes permisos.');
        await this.router.navigate(['/home']);
        return;
      }

      // obtener todas las lecturas
      const { data, error } = await this.supabase
        .from('lecturas')
        .select(`*, usuario_id`)
        .order('fecha_registro', { ascending: false });

      if (error) console.log(error);

      this.registros = data || [];

    } finally {
      this.loading = false;
    }
  }

  abrirMapa(lat: number, lng: number) {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  }
}
