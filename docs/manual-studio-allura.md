# Manual de Usuario — Allura Healthcare CMS
### Sanity Studio · Guía para el equipo editorial

---

## ¿Qué es el CMS y para qué sirve?

El CMS (Sistema de Gestión de Contenidos) de Allura Healthcare es una herramienta que te permite **editar el contenido del sitio web sin necesidad de tocar código**. Desde aquí puedes publicar artículos de blog, actualizar perfiles del equipo, subir fotos a la galería, gestionar testimonios, crear promociones y mucho más.

El sitio web siempre tiene un **contenido base** que se ve aunque el CMS esté vacío. Cuando tú agregas contenido en el CMS, ese contenido reemplaza automáticamente el base.

---

## Cómo acceder al Studio

### URL de acceso
```
https://tu-dominio.com/studio
```
*(En desarrollo local: `http://localhost:3000/studio`)*

### Primera vez — crear tu cuenta
1. Recibirás un **email de invitación** de Sanity (puede caer en spam — revísalo)
2. Haz clic en el enlace del email
3. Crea tu contraseña
4. Ingresa con tu email y contraseña en la URL de arriba

### Ingresos siguientes
1. Ve a `https://tu-dominio.com/studio`
2. Si el Studio pide login, ingresa con tu email y contraseña
3. Si ya tienes sesión activa, entras directamente

---

## Pantalla principal — el menú lateral

Cuando entras al Studio verás este menú a la izquierda:

```
Contenido

🏠 Página de inicio
⚙️ Configuración global
🔍 SEO y medición
📄 Páginas
🦷 Servicios
📝 Blog
⭐ Testimonios
❓ Preguntas frecuentes
🖼️ Galería
🎬 Videos
🏆 Casos de éxito
👥 Equipo
🎯 Promociones y popups
```

Haz clic en cualquier sección para ver su contenido.

---

## Mecánica básica: cómo funciona el Studio

### Crear un documento
1. Haz clic en la sección (ej: Blog)
2. Haz clic en el botón **+** (esquina superior derecha de la lista)
3. Llena los campos
4. Haz clic en **Publish** (botón verde, esquina superior derecha)

### Editar un documento existente
1. Haz clic en la sección
2. Haz clic en el documento que quieres editar
3. Modifica los campos
4. Haz clic en **Publish**

### Borrar un documento
1. Abre el documento
2. Haz clic en los **tres puntos (...)** esquina superior derecha
3. Selecciona **Delete**
⚠️ *Algunos documentos tienen la opción "Desactivar" — úsala en vez de borrar para no perder el contenido.*

### Publish vs Draft
- **Draft** = guardado pero NO visible en el sitio
- **Published** = visible en el sitio
- El botón **Publish** aparece cuando hay cambios sin publicar

---

## Lo que puedes hacer desde el Studio

### ✅ SÍ puedes editar desde el Studio
- Textos del blog (artículos, imágenes, fechas)
- Perfiles del equipo (nombre, cargo, foto, bio)
- Testimonios de pacientes
- Preguntas frecuentes
- Galería de imágenes
- Videos
- Banners de promoción
- Popups
- Datos de contacto (WhatsApp, email, redes sociales)
- SEO de cada página (título, descripción para Google)

### ❌ NO puedes cambiar desde el Studio
- El diseño del sitio (colores, tipografías, layout)
- El menú de navegación
- Las páginas de servicios (Aligners, Smile Makeover, etc.)
- Agregar nuevas categorías de servicios
- Cambiar la estructura de cualquier página

*Para esos cambios se necesita un desarrollador.*

---

## Guía por sección

---

### 🏠 Página de inicio

Controla el contenido del Hero (parte superior de la pantalla principal).

**Campos que puedes editar:**
- **Supratítulo** — texto pequeño sobre el titular principal
- **Titular línea 1 y 2** — el titular grande del Hero
- **Subtexto** — descripción debajo del titular
- **CTA primario** — botón principal (texto + URL de destino)
- **CTA secundario** — botón secundario
- **Imagen de fondo** — foto de fondo del Hero

**Cómo funciona:**
- Si llenas un campo → el sitio muestra tu texto
- Si dejas un campo vacío → el sitio muestra el texto original predeterminado
- Siempre haz clic en **Publish** después de editar

---

### ⚙️ Configuración global → Datos del sitio

Información central del negocio que aparece en todo el sitio.

**Campos importantes:**
- **Nombre del sitio** — aparece en el navegador y Google
- **WhatsApp** — número en formato internacional (ej: `+573001234567`)
- **Email de contacto** — email que recibe los formularios del sitio
- **Instagram / Facebook / LinkedIn** — URLs completas de las redes sociales

**Nota:** El número de WhatsApp que pongas aquí reemplaza el del footer y todos los botones de WhatsApp del sitio.

---

### 🔍 SEO y medición → SEO global

Controla cómo aparece el sitio en Google y cuando alguien comparte un link.

**Campos:**
- **Meta título** — título que aparece en Google (máx. 60 caracteres)
- **Meta descripción** — descripción en resultados de Google (máx. 160 caracteres)
- **OG Image** — imagen que aparece cuando alguien comparte el link en WhatsApp o redes sociales (tamaño recomendado: 1200×630px)

**Consejo:** Incluye siempre "Allura Healthcare" y "Medellín" en el meta título para mejor posicionamiento.

---

### 📝 Blog → Entradas

Crea y gestiona artículos del blog.

**Campos obligatorios:**
- **Título** (español e inglés)
- **Slug** — URL del artículo. Haz clic en **Generate** para crearlo automáticamente desde el título. *No lo cambies después de publicar.*

**Campos opcionales pero recomendados:**
- **Imagen destacada** — foto principal del artículo
- **Extracto** — resumen corto (máx. 200 caracteres). Aparece en la lista del blog
- **Contenido** — el artículo completo. Usa la barra de herramientas para negritas, listas, links
- **Autor** — selecciona un miembro del equipo
- **Categorías** — clasifica el artículo
- **Fecha de publicación** — cuándo se publicó

**Estado del artículo:**
- ⚪ **Borrador** — solo tú lo ves en el Studio
- 🟡 **En revisión** — para coordinación interna
- 🟢 **Publicado** — visible en el sitio

*El estado "Publicado" en este campo + hacer clic en Publish son dos cosas distintas. Para que aparezca en el sitio necesitas hacer ambas.*

---

### 👥 Equipo

Gestiona los perfiles del equipo médico.

**Campos obligatorios:**
- **Nombre completo**
- **Slug** — haz clic en Generate

**Campos opcionales:**
- **Cargo** (español e inglés) — aparece debajo del nombre. Ej: *Directora Médica*
- **Departamento** — selecciona de la lista (Dental, Estética, Medicina, etc.)
- **Fotografía** — foto profesional del miembro
- **Bio corta** — resumen en 200 caracteres para tarjetas
- **Bio completa** — texto largo para la página de perfil
- **Especialidades** — hasta 5. Ej: *Implantología, Ortodoncia*
- **Credenciales** — títulos y certificaciones. Ej: *Universidad de Antioquia, Certificación Invisalign Diamond*
- **LinkedIn** — URL completa del perfil
- **Orden de aparición** — número. 1 aparece primero, 2 segundo, etc.
- **Activo en el sitio** — si lo desactivas, no aparece en el sitio pero no lo pierdes
- **Destacado en home** — si lo marcas, aparece en la sección de equipo de la página principal

---

### ⭐ Testimonios

Reseñas de pacientes que aparecen en el sitio.

**Campos obligatorios:**
- **Nombre del paciente**
- **Calificación** — número del 1 al 5
- **Testimonio** (español e inglés) — máx. 300 caracteres

**Campos opcionales:**
- **Ciudad / País de origen** — ej: *Miami, USA*
- **Servicio recibido** — vincula el testimonio a un servicio específico
- **Foto del paciente**
- **URL de video testimonial**

**Campo importante:**
- **✅ Aprobado para publicar** — el testimonio NO aparece en el sitio hasta que marques esta casilla. Esto es una medida de seguridad para revisar antes de publicar.

---

### ❓ Preguntas frecuentes

Preguntas y respuestas que aparecen en la sección "¿Cómo funciona?".

**Campos obligatorios:**
- **Pregunta** (español e inglés)

**Campos opcionales:**
- **Respuesta** — usa el editor para dar formato
- **Categoría** — General, Servicios, Viaje y alojamiento, Pagos, Post-tratamiento
- **Servicio relacionado** — vincula la pregunta a un servicio
- **Orden** — número para controlar el orden de aparición
- **Activo** — desactiva sin borrar

---

### 🖼️ Galería

Fotos que aparecen en la sección de galería.

**Recomendaciones de imagen:**
- Tamaño mínimo: 800×600px
- Formato: JPG o WebP
- Peso máximo recomendado: 2MB

**Campos:**
- **Título** (opcional) — nombre interno para identificar la foto
- **Imagen** — la foto
- **Alt text** — descripción de la imagen para accesibilidad y Google
- **Categoría** — Clínica, Equipo, Resultados, Medellín, Eventos
- **Servicio relacionado** — opcional
- **Destacado** — las imágenes destacadas aparecen primero
- **Fecha** — opcional, para ordenar cronológicamente

---

### 🎬 Videos

Videos del canal de YouTube, Vimeo o Instagram.

**Campos obligatorios:**
- **Título** (español e inglés)
- **Plataforma** — YouTube, Vimeo o Instagram
- **ID del video** — *solo el ID, no la URL completa*

**Cómo encontrar el ID de YouTube:**
En la URL `youtube.com/watch?v=dQw4w9WgXcQ` el ID es `dQw4w9WgXcQ`

**Campos opcionales:**
- **Miniatura** — imagen de portada. Si no la pones, se usa la del video automáticamente
- **Descripción**
- **Servicio relacionado**
- **Destacado** — aparece primero en la sección de videos

---

### 🎯 Promociones y popups → Promociones

Banners de oferta o anuncio que aparecen en el sitio.

**Campos obligatorios:**
- **Nombre interno** — solo para tu referencia, no lo ve el paciente
- **Título** (español e inglés) — texto principal del banner

**Campos opcionales:**
- **Descripción** — texto secundario debajo del título
- **CTA** — botón dentro del banner (texto + URL)
- **Color de fondo** — Azul oscuro, Azul claro o Dorado
- **Fecha de inicio / fin** — para programar cuándo aparece y desaparece
- **🔴 Activo** — enciende o apaga el banner

⚠️ **Solo puede haber una promoción activa a la vez.** Si activas una nueva, desactiva la anterior primero.

---

### 🎯 Promociones y popups → Popups

Ventanas emergentes que aparecen al entrar al sitio.

**Campos obligatorios:**
- **Nombre interno**
- **Título del popup** (español e inglés)
- **Contenido** — texto del popup

**Campos opcionales:**
- **Trigger** — cuándo aparece: al cargar, después de un tiempo, o al intentar salir
- **Tiempo de espera** — segundos antes de aparecer (si el trigger es "después de un tiempo")
- **Páginas donde aparece** — si lo dejas vacío, aparece en todo el sitio
- **Frecuencia** — una vez, por sesión, o siempre
- **Fecha de inicio / fin** — para programar
- **Activo** — enciende o apaga el popup

---

## Consejos para no romper nada

### 1. El Slug — no lo cambies después de publicar
El slug es la URL del documento (ej: `/blog/mi-articulo`). Si lo cambias después de que el artículo está publicado, el link anterior dejará de funcionar y Google perderá el posicionamiento. **Solo genera el slug una vez y no lo toques más.**

### 2. Imágenes — tamaño y peso
- Fotos de perfil del equipo: 400×400px mínimo, formato cuadrado
- Imágenes de galería: 800×600px mínimo
- OG Image (para redes sociales): exactamente 1200×630px
- Peso máximo recomendado: 2MB por imagen

### 3. Textos en dos idiomas
Muchos campos tienen **Español** e **Inglés**. Llena siempre los dos. Si dejas el inglés vacío, el sitio puede mostrar texto vacío a los visitantes que usen el sitio en inglés.

### 4. Publish vs guardar
El Studio **guarda automáticamente** como borrador mientras escribes. Pero para que los cambios aparezcan en el sitio debes hacer clic en el botón **Publish** (verde, esquina superior derecha).

### 5. Desactivar en vez de borrar
Antes de borrar un documento, considera usar el campo **"Activo"** para desactivarlo. Así conservas el contenido y puedes reactivarlo después.

---

## Límites de contenido

| Campo | Límite |
|-------|--------|
| Meta título SEO | 60 caracteres |
| Meta descripción SEO | 160 caracteres |
| Extracto de blog | 200 caracteres |
| Testimonio | 300 caracteres |
| Bio corta del equipo | 200 caracteres |
| Descripción de promoción | 120 caracteres |
| Texto de botón (CTA) | 50 caracteres |
| Especialidades por miembro | Máximo 5 |
| Credenciales por miembro | Máximo 8 |
| Servicios relacionados en blog | Máximo 2 |
| Posts relacionados en blog | Máximo 3 |
| Imágenes en galería de servicio | Máximo 10 |

---

## Preguntas frecuentes del Studio

**¿Cuánto tiempo tarda en verse en el sitio?**
Los cambios publicados aparecen en el sitio en menos de 1 hora en producción. En desarrollo local, aparecen inmediatamente al recargar la página.

**¿Puedo publicar desde el celular?**
Sí. El Studio funciona en navegador móvil, aunque es más cómodo usarlo en computador.

**¿Qué pasa si cometo un error?**
El Studio guarda un historial de versiones. Puedes hacer clic en los **tres puntos (...)** → **History** para ver versiones anteriores del documento.

**¿Puedo trabajar en equipo?**
Sí. Múltiples editores pueden trabajar al mismo tiempo. Si dos personas editan el mismo documento al mismo tiempo, el Studio muestra un aviso.

**¿Quién puede hacer qué?**

| Rol | Qué puede hacer |
|-----|----------------|
| **Administrador** | Todo: editar contenido, configurar el proyecto, ver herramientas técnicas |
| **Editor** | Crear, editar y publicar cualquier contenido |
| **Viewer (solo lectura)** | Ver el contenido pero no editar |

---

## Contacto de soporte

Para cambios en el diseño, estructura de páginas, nuevas secciones o problemas técnicos, contacta al equipo de desarrollo.

---

*Manual generado para Allura Healthcare · Versión 1.0 · Mayo 2026*
