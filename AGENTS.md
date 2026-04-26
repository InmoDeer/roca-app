# AGENTS.md - Reglas del Proyecto Roca App

## Descripción del Proyecto
- **Nombre**: Roca App
- **Tipo**: Aplicación React con Supabase
- **Propósito**: Gestión de propiedades inmobiliarias

## Stack Tecnológico
- React 19
- Vite
- Supabase (backend)
- ESLint

## Estructura del Proyecto
```
src/
├── components/         # Componentes reutilizables
│   ├── ui/            # Componentes UI (Gallery, CopyShareBtns)
│   └── formFields/    # Campos de formulario (Field, Select, Checkbox)
├── features/          # Funcionalidades por módulo
│   ├── properties/   # PropertyForm, PropertyDetail, PublicGallery, PropietarioModal
│   └── contacts/     # ContactsView, ContactForm, PropietarioForm (CRM)
├── hooks/            # Custom hooks (useAuth, useProperties, useTheme)
├── utils/            # Utilidades (api, constants, cloudinary, messageFormatter)
├── config/           # Configuración del entorno
├── styles/           # Estilos centralizados
│   ├── theme.js     # Tema (colores, spacing, fuentes)
│   └── componentStyles.js  # Estilos de componentes
├── App.jsx           # Componente principal
├── main.jsx          # Entry point
└── index.css       # Estilos globales
```

## Formularios de la App

| Componente | Ubicación | Propósito |
|-----------|-----------|-----------|
| PropertyForm | features/properties/ | Crear/editar propiedades |
| ContactForm | features/contacts/ | Crear/editar leads |
| PropietarioForm | features/contacts/ | Crear/editar propietarios |

### PropietarioForm Props
- `initial`: Contacto existente (para editar)
- `onSave`: Callback al guardar
- `onClose`: Callback cerrar
- `onCrearPropiedad`: Callback para abrir PropertyForm con propietario precargado

## Pipeline de CRM (ContactsView)

### Leads - Estados
- Interesado: Ya hablaste con él
- Seguimiento: Le enviaste opciones
- Visita: Estado CRÍTICO en Real Estate
- Vendido/Alquilado: ¡Comisión ganada!
- Cerrado

### Propietarios - Estados
- Captación: Dueño identificado
- Propuesta/Tasación: Le diste el precio sugerido
- Negociación: Ajustando comisión/exclusividad
- Firmado / Cerrado: YA PUEDES CREAR EL INMUEBLE

### Propiedades del componente
- `defaultEstadoLead`: Estado inicial para nuevos leads (default: "Interesado")
- `defaultEstadoProp`: Estado inicial para nuevos propietarios (default: "Captación")

## Relación Propietario-Propiedad
- `propiedades.propietario_id`: FK a contactos (un propietario puede tener varias propiedades)
- `contactos.propiedad_id`: FK a propiedades (se guarda al asignar desde PropertyDetail)
- PropietarioModal actualiza ambas tablas al asignar/desasignar

## Convenciones de Código
- Componentes funcionales con Hooks
- Nombres de archivos en PascalCase para componentes, camelCase para utils/hooks
- Imports ordenados: externos, internos, relativos
- Estilos centralizados en componentStyles.js (no estilos inline en componentes)

## Patrones Comunes
- useAuth hook para autenticación
- useProperties hook para gestión de propiedades
- useTheme hook para tema (colores claros/oscuros)
- API utilities para comunicación con Supabase
- buildOutputs (messageFormatter) para generar mensajes de WhatsApp
- componentStyles.js para estilos de componentes