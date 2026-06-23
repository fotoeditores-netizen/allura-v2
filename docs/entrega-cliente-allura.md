# Entrega del sitio Allura al cliente — Guía paso a paso

> **Decisión técnica:** El sitio está construido en **Next.js + Supabase**. Estas son
> las plataformas que mejor corren esta tecnología, y tú (el desarrollador) seguirás
> manteniendo el sitio. Por eso **NO migramos a otro proveedor (Hostinger, VPS, etc.).**
> En cambio, **transferimos la propiedad de las cuentas al cliente.** El cliente queda
> dueño legal y económico de todo, sin re-trabajo ni riesgo de romper el sitio.

---

## Resumen: qué queda a nombre del cliente

| Pieza | Plataforma | A nombre de | Costo |
|-------|-----------|-------------|-------|
| Código fuente | GitHub | Cliente | Gratis |
| Sitio web (hosting) | Vercel | Cliente | Gratis (plan Hobby) o ~20 USD/mes (Pro, si se necesita) |
| Base de datos + imágenes + login | Supabase | Cliente | Gratis (plan Free alcanza) |
| Dominio | Registrador a elección (Hostinger, Namecheap, GoDaddy…) | Cliente | ~10–15 USD/año |
| Correos corporativos (opcional) | Hostinger / Google Workspace / Zoho | Cliente | Desde gratis (Zoho) hasta ~6 USD/mes |

**Costo total realista para el cliente: entre 0 y ~25 USD/mes.** Dentro de tu presupuesto.

---

## PARTE 1 — Qué necesita comprar / crear el cliente

El cliente NO necesita comprar hosting ni servidores. Solo necesita **crear cuentas
a su nombre** (con su correo y su tarjeta) en:

1. **Cuenta en GitHub** — https://github.com → "Sign Up" con el correo del cliente.
   - Gratis. Aquí vivirá el **código fuente** del sitio. Da independencia: si algún día
     cambia de desarrollador, el código es suyo.
2. **Cuenta en Vercel** — https://vercel.com → "Sign Up" con el correo del cliente.
   - Plan **Hobby (gratis)** sirve para empezar. Si el tráfico crece, se sube a Pro (~20 USD/mes).
   - Conviene registrarse en Vercel **usando la cuenta de GitHub** del cliente (botón
     "Continue with GitHub"), así quedan enlazadas desde el inicio.
3. **Cuenta en Supabase** — https://supabase.com → "Start your project" con el correo del cliente.
   - Plan **Free** alcanza para este sitio (500 MB BD + 1 GB imágenes + 50.000 usuarios/mes).
4. **Dominio propio** — si aún no lo tiene, comprarlo en cualquier registrador.
   - Recomendado: que lo compre donde también tendrá los correos, para simplificar.
5. **(Opcional) Correos corporativos** — ej. `info@allurahealthcare.com`.
   - Zoho Mail tiene plan gratis; Google Workspace ~6 USD/mes; Hostinger los incluye con dominio.

> ✅ **Importante:** que el cliente cree estas cuentas con SU correo y SU tarjeta.
> Esa es la única forma de que sea dueño real. Tú luego pides acceso de colaborador
> para seguir manteniendo.

---

## PARTE 2 — Cómo se hace la migración (paso a paso)

> Regla de oro: **NO borrar las cuentas actuales (Vercel/Supabase tuyas) hasta que
> el sitio nuevo del cliente esté 100% probado y funcionando.** Sirven de respaldo.

> Orden recomendado: **GitHub → Supabase → Vercel → Dominio → Verificación.**
> (El código va primero porque Vercel se conecta a él; la base de datos antes que
> el sitio porque el sitio necesita sus claves.)

### Fase 0 — Código fuente (GitHub)

El código está hoy en `fotoeditores-netizen/allura-v2` (el repo que usa Vercel). Para
pasarlo al cliente:

1. El cliente crea su cuenta de GitHub (ver Parte 1).
2. **Transferir el repositorio** al cliente:
   GitHub → repo `allura-v2` → Settings → General → **Transfer ownership** → poner el
   usuario del cliente. El cliente recibe un correo y debe **aceptar** la transferencia.
3. El cliente te agrega de vuelta como **colaborador**:
   repo → Settings → Collaborators → Add people → tu usuario. Así sigues manteniéndolo.
4. (Alternativa si no quieres transferir ESE repo) Crear un repo nuevo en la cuenta del
   cliente y subir el código ahí con `git push`. Igual de válido; transferir es más directo
   porque conserva el historial y la conexión.

> Resultado: el **código es del cliente**, tú conservas acceso de colaborador.

### Fase A — Base de datos (Supabase)

1. El cliente crea su cuenta y un **proyecto nuevo** en Supabase (ej. "allura-prod").
2. **Exportar la base de datos actual** (la nuestra):
   - Supabase → proyecto actual → Database → Backups, o usar `pg_dump` con la cadena de conexión.
3. **Importar a la base nueva** del cliente (restaurar el dump).
4. **Migrar las imágenes (Storage):** descargar el bucket actual y subirlo al bucket nuevo.
   - El proyecto tiene las migraciones en `supabase/migrations/` — sirven para recrear
     la estructura desde cero si hiciera falta.
5. Copiar las **claves nuevas** del proyecto del cliente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (la secreta, para el admin)
6. Verificar que las **políticas RLS** y **Storage** quedaron aplicadas (migraciones 006 y 007).

### Fase B — Sitio web (Vercel)

Tienes dos caminos. **El B1 es el recomendado.**

**B1 — Transferir el proyecto existente (más fácil, sin re-deploy):**
1. En Vercel (cuenta actual) → proyecto → Settings → **Transfer Project** a la cuenta del cliente.
2. Vercel pide que el cliente acepte la transferencia. Listo: mismo proyecto, nuevo dueño.

**B2 — Crear el proyecto desde cero en la cuenta del cliente (recomendado si ya hiciste
la Fase 0 de GitHub):**
1. El repo ya está en la cuenta del cliente (Fase 0).
2. En Vercel del cliente → "Add New Project" → importar **su** repo de GitHub.
3. Configurar las **variables de entorno** (las de Supabase nuevas de la Fase A + las de correo).
4. Hacer el primer deploy y probar.

> ✅ **Production Branch:** las ramas `main` y `feature/supabase-migration` ya están
> sincronizadas (mismo código). Al montar el proyecto nuevo, dejar **`main` como
> Production Branch** — es lo limpio y evita la confusión que había antes.

### Fase C — Variables de entorno a configurar en el Vercel del cliente

Tomar como base el archivo `.env.example` del proyecto. Las que hay que poner:
- `NEXT_PUBLIC_SUPABASE_URL` — del Supabase nuevo del cliente
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — del Supabase nuevo
- `SUPABASE_SERVICE_ROLE_KEY` — del Supabase nuevo (secreta)
- Variables de correo (nodemailer): host SMTP, usuario, contraseña del correo del cliente
- Cualquier otra que aparezca en `.env.example`

### Fase D — Dominio

1. El cliente apunta su dominio al proyecto de Vercel (Vercel da los registros DNS exactos).
2. En el registrador del dominio (Hostinger/Namecheap/etc.) se agregan esos registros.
3. Vercel emite el certificado SSL (HTTPS) automáticamente.
4. Verificar que `https://eldominio.com` carga el sitio y abre en **inglés** (default actual).

### Fase E — Verificación final (antes de apagar lo viejo)

- [ ] El sitio carga en el dominio del cliente con HTTPS.
- [ ] Abre en inglés por defecto.
- [ ] El panel admin (`/admin`) deja iniciar sesión.
- [ ] Los formularios de contacto envían correo correctamente.
- [ ] Las imágenes cargan (vienen del Storage nuevo).
- [ ] El CMS guarda cambios (botones del header, etc.).
- [ ] Botón "Pagar aquí" abre en pestaña nueva si está configurado.

Solo cuando TODO esto pase, se puede dar de baja el Vercel/Supabase antiguo (o dejarlo
un mes más como respaldo, que cuesta 0).

---

## PARTE 3 — Qué se le entrega al cliente

Un documento/correo con:

1. **Accesos (dueño):**
   - Cuenta Vercel (su correo) — dónde está el sitio.
   - Cuenta Supabase (su correo) — dónde está la base de datos y las imágenes.
   - Registrador del dominio (su correo) — dónde se administra el dominio.
   - Correos corporativos (si aplica).

2. **Accesos del CMS / Panel admin:**
   - URL: `https://eldominio.com/admin`
   - Usuario y contraseña de administrador.
   - El manual de usuario ya existe: `docs/manual-usuario-allura.html` — entregarlo.

3. **Documento de "qué tienes y cuánto cuesta":**
   - Lista de cuentas, qué hace cada una, y el costo mensual/anual de cada plan.
   - Recordatorio de renovar el dominio cada año.

4. **Acuerdo de mantenimiento (recomendado):**
   - Como tú seguirás manteniendo el sitio, dejar por escrito que te invite como
     **colaborador/miembro** en Vercel y Supabase (sin ser dueño). Así puedes seguir
     haciendo cambios sin tener el control económico.

5. **Código fuente:**
   - Ya queda en el **GitHub del cliente** (Fase 0), así que el código es suyo.
   - Confirmar que el cliente tiene el acceso de dueño del repo y tú el de colaborador.

---

## Por qué NO Hostinger (hosting compartido) para el sitio

Para que quede documentado el porqué de la decisión:

- El sitio es **Next.js**, que necesita un **servidor Node.js corriendo**, no archivos
  estáticos. El hosting compartido de Hostinger (el barato) está hecho para WordPress/HTML
  y **no corre bien Next.js**: el admin, login, formularios e imágenes dinámicas fallarían
  o irían muy lentos.
- La alternativa de Hostinger que sí sirve (VPS) **obliga a administrar un servidor Linux
  manualmente** (SSL, actualizaciones, reinicios, seguridad). Más trabajo y más riesgo.
- Vercel hace todo eso automático y gratis para este tamaño de sitio.

👉 **Hostinger sí es buena opción para lo que hace bien: vender el dominio y los correos
del cliente.** Eso sí se puede usar.
