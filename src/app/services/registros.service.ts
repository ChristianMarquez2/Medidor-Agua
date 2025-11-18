import { Injectable } from '@angular/core';
import { SupabaseService, Reading } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class RegistrosService {
  constructor(private supabaseService: SupabaseService) {}

  // ----------------------------------
  // OBTENER PERFIL (para saber si es admin o user normal)
  // ----------------------------------
  async getUserRole() {
    // ANTES: .getUser()
    const { data: userData } = await this.supabaseService.getCurrentUser(); // <-- CORREGIDO
    const userId = userData?.user?.id;

    if (!userId) return null;

    const { data: profile } = await this.supabaseService.getUserProfile(userId);
    return profile?.rol ?? null;
  }

  // ----------------------------------
  // OBTENER LECTURAS
  // ----------------------------------

  // Lecturas solo del usuario actual
  async getMisLecturas() {
    // ANTES: .getUser()
    const { data: userData } = await this.supabaseService.getCurrentUser(); // <-- CORREGIDO
    const userId = userData?.user?.id;

    if (!userId) {
      // Retornamos un objeto de error compatible con la respuesta de Supabase
      return { data: null, error: { message: 'Usuario no autenticado' } };
    }

    return await this.supabaseService.getReadingsForUser(userId);
  }

  // Lecturas para admins
  async getLecturasAdmin() {
    return await this.supabaseService.getAllReadings();
  }

  // ----------------------------------
  // CREAR UNA LECTURA NUEVA
  // ----------------------------------

  async crearRegistro(lectura: Reading) {
    return await this.supabaseService.createReading(lectura);
  }

  // ----------------------------------
  // SUBIR IMÁGENES Y OBTENER URL
  // ----------------------------------

  async subirImagen(path: string, file: File) {
    return await this.supabaseService.uploadImagePublic(path, file);
  }
}