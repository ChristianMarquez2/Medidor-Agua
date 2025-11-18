import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Necesario
import { FormsModule } from '@angular/forms'; // <-- Necesario
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonSpinner,
  IonItem,
  IonList,
  IonLabel,
  AlertController,
  IonTextarea, // <-- Faltaba importar
  IonIcon, // <-- Faltaba importar
  IonButtons, // <-- Faltaba importar
  IonBackButton, // <-- Faltaba importar
} from '@ionic/angular/standalone';

// Importa la INTERFAZ de tu servicio
import { Reading, SupabaseService } from '../services/supabase.service';
import { RegistrosService } from '../services/registros.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

// ¡NUEVO! Añadir el helper de addIcons
import { addIcons } from 'ionicons';
import {
  camera,
  image,
  location,
  checkmarkCircle,
} from 'ionicons/icons';

@Component({
  selector: 'app-registro-lectura',
  templateUrl: './registro-lectura.page.html',
  styleUrls: ['./registro-lectura.page.scss'],
  standalone: true,
  imports: [
    CommonModule, // <-- ¡NUEVO! Añadido
    FormsModule, // <-- ¡NUEVO! Añadido
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonInput,
    IonSpinner,
    IonList,
    IonItem,
    IonLabel,
    IonTextarea, // <-- ¡NUEVO! Añadido
    IonIcon, // <-- ¡NUEVO! Añadido
    IonButtons, // <-- ¡NUEVO! Añadido
    IonBackButton, // <-- ¡NUEVO! Añadido
  ],
})
export class RegistroLecturaPage {
  valor: number | null = null;
  observaciones: string = '';

  fotoMedidorPreview: string | null = null;
  fotoFachadaPreview: string | null = null;

  fotoMedidorFile: File | null = null;
  fotoFachadaFile: File | null = null;

  latitud: number | null = null;
  longitud: number | null = null;

  loading = false;

  constructor(
    private supabaseService: SupabaseService,
    private registrosService: RegistrosService,
    private router: Router,
    private alertController: AlertController
  ) {
    // ¡NUEVO! Carga los íconos que vamos a usar
    addIcons({ camera, image, location, checkmarkCircle });
  }

  // ... (obtenerGPS, tomarFoto, dataURLtoFile... todo esto está perfecto) ...
  // ⛅ Obtener ubicación actual
  async obtenerGPS() {
    try {
      const pos = await Geolocation.getCurrentPosition();
      this.latitud = pos.coords.latitude;
      this.longitud = pos.coords.longitude;
      console.log('GPS Obtenido:', this.latitud, this.longitud);
    } catch (e) {
      console.error('Error GPS:', e);
      this.mostrarAlerta(
        'Error GPS',
        'No se pudo obtener la ubicación GPS. Asegúrate de tener los permisos activados.'
      );
    }
  }

  // 📸 Tomar foto genérica
  async tomarFoto(tipo: 'medidor' | 'fachada') {
    try {
      const img = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 80,
      });

      const dataUrl = img.dataUrl!;
      const file = this.dataURLtoFile(dataUrl, `${tipo}-${Date.now()}.jpg`);

      if (tipo === 'medidor') {
        this.fotoMedidorPreview = dataUrl;
        this.fotoMedidorFile = file;
      } else {
        this.fotoFachadaPreview = dataUrl;
        this.fotoFachadaFile = file;
      }
    } catch (e: unknown) {
      console.error('Error al tomar foto:', e);
      if (e instanceof Error) {
        if (e.message !== 'User cancelled photos app') {
          this.mostrarAlerta('Error Cámara', 'No se pudo tomar la foto.');
        }
      } else {
        this.mostrarAlerta('Error Cámara', 'No se pudo tomar la foto.');
      }
    }
  }

  // Convertir base64 → File
  dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }

  // 📝 Guardar lectura completa en la BD (Modo Correcto)
  async registrarLectura() {
    if (!this.valor) {
      return this.mostrarAlerta(
        'Campo Requerido',
        'Debes ingresar el valor del medidor.'
      );
    }

    if (!this.fotoMedidorFile) {
      return this.mostrarAlerta(
        'Campo Requerido',
        'Debes tomar la foto del medidor.'
      );
    }

    if (!this.latitud || !this.longitud) {
      return this.mostrarAlerta(
        'Campo Requerido',
        'Debes obtener la ubicación GPS.'
      );
    }

    this.loading = true;

    try {
      // 1. Obtener usuario
      const {
        data: { user },
      } = await this.supabaseService.getCurrentUser();
      if (!user) {
        this.mostrarAlerta(
          'Error',
          'Sesión expirada. Vuelve a iniciar sesión.'
        );
        return this.router.navigate(['/login']);
      }

      // 2. Subir imagen obligatoria (medidor)
      const pathMedidor = `medidor/${user.id}_${Date.now()}.jpg`;
      const { publicUrl: urlMedidor, error: errorMedidor } =
        await this.registrosService.subirImagen(
          pathMedidor,
          this.fotoMedidorFile
        );

      if (errorMedidor) throw errorMedidor;

      // 3. Subir imagen opcional (fachada)
      let urlFachada: string | undefined = undefined;
      if (this.fotoFachadaFile) {
        const pathFachada = `fachada/${user.id}_${Date.now()}.jpg`;
        const { publicUrl: urlFachadaTemp, error: errorFachada } =
          await this.registrosService.subirImagen(
            pathFachada,
            this.fotoFachadaFile
          );

        if (errorFachada) {
          console.warn('No se pudo subir la foto de fachada, pero se continua.');
        } else {
          urlFachada = urlFachadaTemp;
        }
      }

      // 4. Crear el objeto Reading (MODO CORREGIDO)
      const nuevaLectura: Reading = {
        usuario_id: user.id,
        valor: this.valor!,
        observacion: this.observaciones || undefined,
        foto_medidor: urlMedidor!,
        foto_fachada: urlFachada,
        latitud: this.latitud!,
        longitud: this.longitud!,
      };

      // 5. Insertar registro usando el servicio
      const { error: errorInsert } = await this.registrosService.crearRegistro(
        nuevaLectura
      );

      if (errorInsert) throw errorInsert;

      await this.mostrarAlerta(
        'Éxito',
        'Lectura registrada correctamente.'
      );

      // --- ¡¡AQUÍ ESTÁ LA CORRECCIÓN!! ---
      // Le decimos que vaya a la ruta absoluta '/tabs/mis-lecturas'
      this.router.navigate(['/tabs/mis-lecturas']); // ANTES: ['/mis-lecturas']
    } catch (error: any) {
      console.error('Error al registrar lectura:', error);
      this.mostrarAlerta(
        'Error',
        `No se pudo guardar la lectura: ${error.message}`
      );
    } finally {
      this.loading = false;
    }
  }

  // Helper para mostrar alertas
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}