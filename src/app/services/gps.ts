import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

export interface GpsLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

@Injectable({
  providedIn: 'root',
})
export class GpsService {

  constructor() {}

  // Obtener coordenadas actuales
  async getCurrentLocation(): Promise<GpsLocation | null> {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 8000,
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy ?? undefined,
      };
    } catch (error) {
      console.error('Error obteniendo GPS:', error);
      return null;
    }
  }

  // Verificar si el GPS está activado
  async isGpsEnabled(): Promise<boolean> {
    try {
      const permission = await Geolocation.checkPermissions();
      if (permission.location === 'granted') return true;

      const request = await Geolocation.requestPermissions();
      return request.location === 'granted';
    } catch (e) {
      return false;
    }
  }
}
