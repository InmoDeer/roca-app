# ROCA App

**El sistema inmobiliario que te ayuda a vender y alquilar más rápido.**

ROCA te permite gestionar tus propiedades, generar mensajes profesionales para WhatsApp en segundos. Todo desde tu celular o computadora.

---

## Que puedes hacer con ROCA

- **Gestionar inmuebles**: Agrega, edita y organiza todas tus propiedades (departamentos, casas, oficinas, locales, terrenos).
- **Generar mensajes listos para WhatsApp**: Con un solo toque, copia un mensaje atractivo con fotos, características destacadas y ubicación. Los destacados se generan automáticamente según los datos del inmueble (piso, área, amenities, etc.). Los enlaces de video y tour 360 apuntan a la app, no a URLs externas.
- **Estados visuales**: Colores dinámicos que muestran el estado de cada propiedad.
- **Modo claro / oscuro**: Trabaja cómodo a cualquier hora. Tu preferencia se guarda.

---

## Como empezar

1. **Accede a la app**: https://roca-app.vercel.app/
2. **Inicia sesión** con tu email y contraseña
3. **Agrega tu primer inmueble** con el botón **"+ Nuevo"**
4. Completa los datos (nombre, distrito, precio, fotos, etc.)
5. **Copia el mensaje** generado automáticamente y compártelo por WhatsApp

---

## Características destacadas

### Formulario completo
Todas las secciones en un solo formulario: datos generales, ubicación, precio, características físicas, amenities, calidad y confort, áreas comunes, multimedia y propietario.

### Visor multimedia (MediaViewer)
Reproductor con tabs para fotos, video (YouTube embed) y tour 360° inline. Se abre desde el detalle de la propiedad o desde enlaces compartidos, sin salir de la app. Navegación por teclado (← →) en fotos.

### Fotos con drag & drop
Sube todas las fotos que quieras, reordenalas arrastrándolas y eliminalas individualmente. La primera foto se marca como principal.

### Mensajes inteligentes
Los mensajes de WhatsApp se generan automáticamente con frases cualitativas según:
- **Piso**: vista panorámica, iluminación
- **Área**: amplitud, distribución
- **Antigüedad**: a estrenar, buen estado
- **Amenities**: piscina, gimnasio, parrilla, etc.
- **Vista**: parque, mar, panorámica
- **Ubicación**: sobre avenida, zona residencial, distritos top

Además puedes elegir manualmente hasta 3 características para destacar primero.

### Estados de propiedad
Organiza tu cartera con estados visuales:
- **Descartado** (gris)
- **Mantenimiento** (naranja)
- **Disponible** (verde/dorado)
- **Reservado** (amarillo)
- **Cerrado** (verde intenso - Alquilado/Vendido)

### Filtros
Encuentra rápido lo que buscas filtrando por:
- Texto (nombre o distrito)
- Operación (Alquiler / Venta)
- Tipo (Departamento, Casa, Local, Oficina, Terreno)
- Estado

### Tema personalizable
Elige entre modo claro u oscuro. Tu preferencia se guarda automáticamente.

---

## Stack Tecnológico

- **Frontend**: Next.js 16, React 19
- **UI**: Radix UI (dialog, select, toast)
- **Iconos**: Lucide React
- **Backend**: Supabase (Auth + Database)
- **Imágenes**: Cloudinary
- **Multimedia**: Visor con tabs (fotos, video YouTube embed, tour 360 inline)
- **Estilos**: CSS centralizado con soporte claro/oscuro + gradientes dinámicos por estado
- **Deploy**: Vercel

---

## Diseño

- **Marca**: Dorado (#d4af37) como color primario
- **Tema oscuro**: Fondo #0a0a0a, tarjetas #1a1a1a
- **Tema claro**: Fondo #f5f5f5, tarjetas #ffffff
- **Estados**: Colores generados automáticamente por gradiente

---

## Preguntas frecuentes

**Puedo usar ROCA en mi celular?**
Sí, la app está optimizada para usarse desde el navegador del móvil.

**Mis datos están seguros?**
Sí, cada agente solo ve sus propias propiedades. Usamos Supabase con autenticación segura.

**Necesito saber de tecnología para usarla?**
Para nada. ROCA está diseñada para que cualquier agente inmobiliario la use sin complicaciones.

---

## Eres desarrollador?

Si quieres conocer los detalles técnicos, convenciones de código o contribuir al proyecto, consulta el archivo [AGENTS.md](./AGENTS.md).

---

## Licencia

Privado — Todos los derechos reservados.

---

**Listo para optimizar tu trabajo?**
[Accede a ROCA App](https://roca-app.vercel.app) y cierra más tratos hoy mismo.
