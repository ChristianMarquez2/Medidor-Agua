import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class CameraService {

  constructor() {}

  /**
   * Toma una foto usando la cámara del dispositivo
   * Retorna un FILE listo para subir a Supabase
   */
  async takePhoto(): Promise<File | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      if (!image.webPath) {
        console.error("No se obtuvo webPath de la imagen");
        return null;
      }

      // Convertir URI a Blob
      const response = await fetch(image.webPath);
      const blob = await response.blob();

      // Crear un archivo para Supabase
      const fileName = `photo_${Date.now()}.jpeg`;
      const file = new File([blob], fileName, { type: blob.type });

      return file;

    } catch (error) {
      console.error("Error al tomar la foto:", error);
      return null;
    }
  }
}
