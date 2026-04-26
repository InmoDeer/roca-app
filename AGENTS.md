# AGENTS.md - Reglas del Proyecto ROCA

## Descripción
- Nombre: ROCA App
- Tipo: React 19 + Vite + Supabase
- Propósito: Gestión de propiedades inmobiliarias para agentes

---

## Stack
- React 19 + Vite
- Supabase (DB + Auth)
- Cloudinary (fotos)
- Vercel (deploy)

---

## Estructura
src/
├── components/
│   ├── ui/              # Gallery, CopyShareBtns
│   └── formFields/      # Field, Select, Checkbox
├── features/
│   ├── contacts/
│   │   ├── ContactsView.jsx      # Vista CRM (leads + propietarios)
│   │   ├── ContactForm.jsx       # Form unificado (lead o propietario)
│   │   └── PropietarioModal.jsx  # Asignar propietario desde PropertyDetail
│   └── properties/
│       ├── PropertyForm.jsx
│       ├── PropertyDetail.jsx
│       └── PublicGallery.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useProperties.js
│   ├── useContacts.js     # ← hook CRM
│   ├── useTheme.jsx
│   └── useSwipeBack.js
├── utils/
│   ├── api.js             # CRUD propiedades
│   ├── contactsApi.js     # CRUD contactos + asignaciones
│   ├── cloudinary.js
│   ├── messageFormatter.js
│   └── constants.js       # Estados, pipelines, colores
├── styles/
│   ├── theme.js           # darkTheme, lightTheme
│   └── componentStyles.js # Una función por componente
├── config/
│   └── environment.js
├── App.jsx
├── main.jsx
└── index.css

---

## REGLAS OBLIGATORIAS

### 1. Estilos — siempre componentStyles.js
- NUNCA estilos inline en JSX salvo valores dinámicos puntuales (ej: color calculado)
- Cada componente usa su función: getXxxStyles(t, mode)
- t viene de useTheme(), nunca hardcodear colores
- Colores del tema: t.colors.primary, t.colors.bg, t.colors.text, etc.

### 2. Constantes — siempre constants.js
- NUNCA definir arrays de estados o colores dentro de componentes
- Estados de leads: ESTADOS_LEAD
- Estados de propietarios: ESTADOS_PROPIETARIO  
- Estados de propiedades: ESTADOS_PROPIEDAD
- Colores: ESTADO_COLORS (generado por buildEstadoColors)
- Tipos, monedas, opciones de formulario: todo en constants.js

### 3. API / Supabase — siempre a través de utils
- NUNCA llamar supabase directo desde un componente
- Propiedades → utils/api.js
- Contactos → utils/contactsApi.js
- Si necesitás una query nueva, agregás la función al util correspondiente

### 4. Lógica de estado — siempre en hooks
- NUNCA fetch + useState + useEffect dentro de un componente
- Propiedades → useProperties
- Contactos → useContacts
- Los componentes solo llaman al hook y renderizan

### 5. Tema
- Siempre usar useTheme() para obtener t y mode
- t.colors.primary = dorado (#d4af37)
- mode = "dark" | "light"
- Nunca hardcodear "#0a0a0a" o "#ffffff" en componentes, usar t.colors.bg / t.colors.text

---

## Flujo correcto al crear un componente nuevo

1. Agregar estilos en componentStyles.js → getNuevoStyles(t, mode)
2. Agregar constantes necesarias en constants.js
3. Si necesita datos de Supabase → agregar función en api.js o contactsApi.js
4. Si maneja estado propio de fetch → crear useNuevo.js en hooks/
5. El componente solo: importa hook + styles + constants, renderiza

---

## Pipelines CRM

### Leads (clientes que buscan)
Interesado → Seguimiento → Visita → Vendido/Alquilado
+ Cerrado (descarte suave)

### Propietarios (captación)
Captación → Propuesta/Tasación → Negociación → Firmado / Cerrado

### Colores de estado
- Generados automáticamente por buildEstadoColors(pipeline) en constants.js
- Gradiente de color oscuro → dorado → verde según avance en el pipeline
- Nunca definir colores de estado fuera de constants.js

---

## Relaciones en base de datos
- propiedades.propietario_id → FK a contactos
- contactos.propiedad_id → FK a propiedades
- Asignación/desasignación siempre via contactsApi: assignPropietario / unassignPropietario

---

## Formularios

| Componente     | Maneja              | Props clave                    |
|----------------|---------------------|-------------------------------|
| PropertyForm   | Crear/editar prop.  | initial, onSave, onClose      |
| ContactForm    | Lead o propietario  | tipoFiltro, tipoLabel, userId |
| PropietarioModal | Asignar a propiedad | propertyId, onClose          |

---

## Anti-patrones prohibidos
- ❌ Estilos inline en JSX (salvo valor 100% dinámico)
- ❌ supabase.from() dentro de componentes
- ❌ Arrays de estados definidos en componentes
- ❌ Colores hardcodeados fuera de theme.js / constants.js
- ❌ Lógica de fetch fuera de hooks
- ❌ Duplicar funciones que ya existen en utils
