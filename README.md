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
├── components/     # Componentes reutilizables
├── features/       # Funcionalidades por módulo
├── hooks/          # Custom hooks (useAuth, useProperties)
├── utils/          # Utilidades (api, constants, cloudinary)
├── config/         # Configuración del entorno
├── styles/         # Estilos
├── App.jsx         # Componente principal
├── main.jsx        # Entry point
└── index.css       # Estilos globales
```

## Convenciones de Código
- Componentes funcionales con Hooks
- Nombres de archivos en PascalCase para componentes, camelCase para utils/hooks
- Imports ordenados: externos, internos, relativos

## Patrones Comunes
- useAuth hook para autenticación
- useProperties hook para gestión de propiedades
- API utilities para comunicación con Supabase
- StatusBadge para estados