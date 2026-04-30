# 🪨 ROCA App

**El sistema inmobiliario que te ayuda a vender y alquilar más rápido.**

ROCA te permite gestionar tus propiedades, generar mensajes profesionales para WhatsApp en segundos y hacer seguimiento de tus clientes interesados. Todo desde tu celular o computadora.

---

## 🚀 ¿Qué puedes hacer con ROCA?

- **📋 Gestionar inmuebles**: Agrega, edita y organiza todas tus propiedades (departamentos, casas, oficinas, locales, terrenos).
- **⚡ Generar mensajes listos para WhatsApp**: Con un solo toque, copia un mensaje atractivo con fotos, características destacada y ubicación.
- **🎯 Seguimiento de contactos (CRM)**: Registra leads interesados y propietarios. Haz seguimiento del estado del pipeline y contacta por WhatsApp o llamada con un solo toque.
- **📊 Pipelines visuales**: Colores dinámicos que muestran el estado de cada propiedad, lead o propietario.
- **🌓 Modo claro / oscuro**: Trabaja cómodo a cualquier hora. Tu preferencia se guarda.

---

## 📱 ¿Cómo empezar?

1. **Accede a la app**: https://roca-app.vercel.app/
2. **Inicia sesión** con tu email y contraseña
3. **Agrega tu primer inmueble** con el botón **"+ Nuevo"**
4. Completa los datos (nombre, distrito, precio, fotos, etc.)
5. **Copia el mensaje** generado automáticamente y compártelo por WhatsApp

---

## ✨ Características destacadas

### 📸 Fotos y multimedia
Sube todas las fotos que quieras, ordénalas arrastrando y añade enlaces a tour 360° o video de YouTube.

### 🏷️ Estados de propiedad (borde colorido)
Organiza tu cartera con estados visuales:
- **Descartado** (gris)
- **Mantenimiento** (naranja)
- **Disponible** (verde/dorado)
- **Reservado** (amarillo)
- **Cerrado** (verde intenso - Alquilado/Vendido)

### 🔍 Filtros inteligentes
Encuentra rápido lo que buscas filtrando por:
- Texto (nombre o distrito)
- Operación (Alquiler / Venta)
- Tipo (Departamento, Casa, Local, Oficina, Terreno)
- Estado

### 📊 Pipeline de Leads y Propietarios

**Leads** (clientes que buscan comprar/alquilar):
Descartado → Interesado → Seguimiento → Visita → Seguimiento post-visita → Cerrado

**Propietarios** (seguimiento de captación):
Descartado → Contactado → Propuesta/Tasación → Seguimiento → Cerrado

Cada estado tiene su propio color para identificar rápidamente en qué etapa está cada contacto.

### 🔗 Flujo Propietario → Propiedad
1. **Captación**: Identifica al propietario
2. **Propuesta/Tasación**: Le das el precio sugerido
3. **Seguimiento**: Mantén el contacto
4. **Cerrado**: ¡Ya puedes crear el inmueble!
   - Selecciona la propiedad asociada
   - Click "Crear" → Abre formulario con propietario precargado

### 🌙 Tema personalizable
Elige entre modo claro u oscuro. Tu preferencia se guarda automáticamente.

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 19, Vite
- **UI**: Radix UI (dialog, dropdown, select, tabs, toast)
- **Iconos**: Lucide React
- **Backend**: Supabase (Auth + Database)
- **Imágenes**: Cloudinary
- **Estilos**: CSS centralizado con soporte claro/oscuro + gradientes dinámicos por estado
- **Deploy**: Vercel

---

## 🎨 Diseño

- **Marca**: Dorado (#d4af37) como color primario
- **Tema oscuro**: Fondo #0a0a0a, tarjetas #1a1a1a
- **Tema claro**: Fondo #f5f5f5, tarjetas #ffffff
- **Estados**: Colores generados automáticamente por gradiente (statusStart → statusEnd)

---

## ❓ Preguntas frecuentes

**¿Puedo usar ROCA en mi celular?**  
Sí, la app está optimizada para usarse desde el navegador del móvil. También puedes instalarla como PWA.

**¿Mis datos están seguros?**  
Sí, cada agente solo ve sus propias propiedades y clientes. Usamos Supabase con autenticación segura.

**¿Necesito saber de tecnología para usarla?**  
Para nada. ROCA está diseñada para que cualquier agente inmobiliario la use sin complicaciones.

---

## 🛠️ ¿Eres desarrollador?

Si quieres conocer los detalles técnicos, convenciones de código o contribuir al proyecto, consulta el archivo [AGENTS.md](./AGENTS.md).

---

## 📄 Licencia

Privado — Todos los derechos reservados.

---

**¿Listo para optimizar tu trabajo?**  
[Accede a ROCA App](https://roca-app.vercel.app) y cierra más tratos hoy mismo.