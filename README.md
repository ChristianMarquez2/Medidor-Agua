App de Lectura de Medidores de Agua (Ionic + Supabase)

Aplicación móvil híbrida desarrollada con Ionic (Angular) para digitalizar y validar el proceso de lectura de medidores de agua en el Distrito Metropolitano de Quito. Su objetivo es reemplazar el registro manual en papel por un sistema digital confiable, seguro y con evidencia geográfica y fotográfica.

📌 Contexto del Proyecto

Actualmente, la toma de lecturas de medidores se realiza manualmente, lo que puede generar errores, pérdidas de información y falta de trazabilidad. Esta app permite:

Registrar lecturas de forma digital.

Validar la autenticidad de cada registro con fotos y ubicación GPS.

Mejorar el control y supervisión de las mediciones en campo.

Garantizar integridad y trazabilidad de los datos.

✨ Características Principales

Autenticación Segura: Inicio de sesión, registro y recuperación de contraseña.

Gestión de Roles: Dos perfiles con permisos diferenciados: Administrador y Medidor.

Registro de Lecturas: Formulario para capturar valor del medidor y observaciones.

Captura de Evidencia Nativa:

Fotos del medidor y de la fachada de la casa.

Coordenadas GPS precisas (latitud y longitud).

Validación Geográfica: Generación automática de enlaces de Google Maps por cada registro.

Historial de Registros:

Medidores: Acceso a sus propias lecturas.

Administradores: Acceso a todas las lecturas.

Experiencia Nativa:

Navegación optimizada por pestañas.

Splash Screen e icono personalizados.

Modo de pantalla completa al iniciar sesión.

👥 Perfiles de Usuario

El sistema utiliza Row Level Security (RLS) de Supabase para la gestión de permisos.

Medidor (rol: medidor)

Registrar nuevas lecturas.

Ver únicamente sus propios registros.

Accede a las pestañas: Mis Lecturas, Registrar, Perfil.

Administrador (rol: admin)

Visualizar todos los registros de todos los medidores.

No puede registrar lecturas.

Accede a las pestañas: Admin, Perfil.

🛠 Tecnologías Utilizadas
Frontend (Móvil)

Ionic 7 con @ionic/angular/standalone

Angular 17+ (Componentes Standalone)

Capacitor 5+ para funciones nativas

TypeScript y SCSS

Plugins de Capacitor:

@capacitor/camera → Captura de fotos

@capacitor/geolocation → Ubicación GPS

@capacitor/status-bar → Control de barra de estado

@capacitor/splash-screen → Pantalla de carga

Backend (BaaS)

Supabase

Authentication (JWT)

Database (PostgreSQL)

Storage (para fotos)

Row Level Security (RLS) para roles y permisos

🚀 Puesta en Marcha (Desarrollo)
1. Clonar el Repositorio
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio

2. Instalar Dependencias
npm install

3. Configuración del Backend (Supabase)

Crear un proyecto en Supabase.

Copiar Project URL y anon key desde Project Settings → API y pegarlas en src/environments/environment.ts.

Configurar la base de datos:

Tabla profiles

Columna	Tipo	Notas
id	uuid	Primary Key, referencia a auth.users.id
rol	text	'medidor' o 'admin'
name	text	Opcional
avatar_url	text	Opcional

Tabla lecturas

Columna	Tipo	Notas
id	int8	Primary Key
usuario_id	uuid	Foreign Key a profiles.id
valor	int4	Valor del medidor
observacion	text	Nullable
foto_medidor	text	URL de la imagen
foto_fachada	text	URL de la imagen, nullable
latitud	numeric	Coordenada GPS
longitud	numeric	Coordenada GPS
maps_url	text	Nullable
fecha_registro	timestamp	Default: now()

Trigger crítico para profiles

-- Función para crear perfil automáticamente
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, rol)
  values (new.id, 'medidor');
  return new;
end;
$$;

-- Trigger que llama a la función al crear un nuevo usuario
create or replace trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();


Configurar Storage

Crear un bucket público llamado uploads.

Actualizar rutas en supabase.service.ts.

Configurar RLS

Habilitar RLS en profiles y lecturas.

Definir políticas para lectura, inserción y roles (medidor vs admin).

4. Ejecutar la Aplicación
# Servidor de desarrollo web
ionic serve

# Sincronizar con plataformas nativas
ionic cap sync

# Ejecutar en Android
ionic cap run android
