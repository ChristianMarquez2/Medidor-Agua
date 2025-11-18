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
  selector: 'app-mis-lecturas',
  templateUrl: './mis-lecturas.page.html',
  styleUrls: ['./mis-lecturas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonImg,
    IonList
  ]
})
export class MisLecturasPage implements OnInit {

  lecturas: any[] = [];
  loading = true;
  private supabase: SupabaseClient;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.supabase = this.supabaseService.getClient();
  }

  async ngOnInit() {
    await this.cargarMisLecturas();
  }

  async cargarMisLecturas() {
    this.loading = true;

    try {
      // Obtener usuario actual
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) {
        alert('Debes iniciar sesión.');
        await this.router.navigate(['/login']);
        return;
      }

      // Obtener lecturas del usuario
      const { data, error } = await this.supabase
        .from('lecturas')
        .select('*')
        .eq('usuario_id', user.id)
        .order('fecha_registro', { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      this.lecturas = data || [];

    } finally {
      this.loading = false;
    }
  }

  // abrir Google Maps
  abrirMapa(lat: number, lng: number) {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  }
}
