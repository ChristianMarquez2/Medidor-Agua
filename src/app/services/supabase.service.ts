import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

// INTERFAZ CORREGIDA - Para coincidir con tu BD (lecturas)
export interface Reading {
  id?: string;
  usuario_id: string; // ANTES: user_id
  valor: number; // ANTES: meter_value
  observacion?: string; // ANTES: observations
  foto_medidor: string; // ANTES: meter_photo_url
  foto_fachada?: string; // ANTES: facade_photo_url
  latitud: number; // ANTES: latitude
  longitud: number; // ANTES: longitude
  google_maps_url?: string;
  fecha_registro?: string; // ANTES: created_at
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  /** Obtener cliente supabase (opcional para otros servicios) */
  getClient(): SupabaseClient {
    return this.supabase;
  }

  // -------------------------------------------------------------------
  // AUTH
  // -------------------------------------------------------------------

  async signUp(email: string, password: string) {
    return await this.supabase.auth.signUp({ email, password });
  }

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  async getCurrentUser() {
    return await this.supabase.auth.getUser();
  }

  // --- ¡NUEVA FUNCIÓN! ---
  /** Envía un correo de reseteo de contraseña */
  async sendPasswordReset(email: string) {
    return await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`, // A dónde volver después
    });
  }

  // -------------------------------------------------------------------
  // PROFILES (roles)
  // -------------------------------------------------------------------

  /** Obtiene el rol del usuario desde la tabla profiles */
  async getUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('rol')
      .eq('id', userId)
      .single();

    return { data, error };
  }

  // -------------------------------------------------------------------
  // STORAGE
  // -------------------------------------------------------------------

  async uploadImagePublic(path: string, file: File) {
    const { error: uploadError } = await this.supabase.storage
      .from('uploads')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) return { error: uploadError, publicUrl: null };

    const { data: publicData } = this.supabase.storage
      .from('uploads')
      .getPublicUrl(path);

    return { error: null, publicUrl: publicData.publicUrl };
  }

  // -------------------------------------------------------------------
  // GOOGLE MAPS
  // -------------------------------------------------------------------

  getGoogleMapsLink(latitude: number, longitude: number): string {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }

  // -------------------------------------------------------------------
  // READINGS (Lecturas) - ¡CORREGIDO!
  // -------------------------------------------------------------------

  async createReading(reading: Reading) {
    // Completa automáticamente el enlace de Google Maps
    if (!reading.google_maps_url) {
      reading.google_maps_url = this.getGoogleMapsLink(
        reading.latitud, // CORREGIDO
        reading.longitud // CORREGIDO
      );
    }

    const { data, error } = await this.supabase
      .from('lecturas') // CORREGIDO (antes 'readings')
      .insert([reading])
      .select();

    return { data, error };
  }

  async getReadingsForUser(userId: string) {
    const { data, error } = await this.supabase
      .from('lecturas') // CORREGIDO (antes 'readings')
      .select('*')
      .eq('usuario_id', userId) // CORREGIDO (antes 'user_id')
      .order('fecha_registro', { ascending: false }); // CORREGIDO (antes 'created_at')

    return { data, error };
  }

  async getAllReadings() {
    const { data, error } = await this.supabase
      .from('lecturas') // CORREGIDO (antes 'readings')
      .select('*')
      .order('fecha_registro', { ascending: false }); // CORREGIDO (antes 'created_at')

    return { data, error };
  }
}