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
│   ├── properties/   # PropertyForm, PropertyDetail, PublicGallery
│   └── contacts/     # ContactsView (CRM de leads)
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