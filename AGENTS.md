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
- Radix UI (dialog, dropdown, select, tabs, toast)

---

## Estructura
src/
├── components/
│   ├── ui/              # Gallery, CopyShareBtns, dialog, dropdown, select, skeleton, tabs, ToastProvider
│   └── formFields/      # Field, Select, Checkbox
├── features/
│   ├── contacts/
│   │   ├── contactsview.jsx     # Vista CRM (leads + propietarios)
│   │   ├── contactForm.jsx     # Form unificado (lead o propietario)
│   │   └── PropietarioModal.jsx  # Asignar propietario desde PropertyDetail
│   └── properties/
│       ├── PropertyForm.jsx
│       ├── PropertyDetail.jsx
│       └── PublicGallery.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useProperties.js    # CRUD propiedades
│   ├── useContacts.js     # CRUD contactos (leads + propietarios)
│   ├── useTheme.jsx      # Tema (t, mode, toggle)
│   ├── useStatus.js      # Colores dinámicos por estado/pipeline
│   ├── useToast.js      # (no existe — usar desde ToastProvider.jsx)
│   └── useSwipeBack.js
├── utils/
│   ├── api.js             # CRUD propiedades
│   ├── contactsApi.js     # CRUD contactos + funciones de sync
│   ├── cloudinary.js      # Upload fotos
│   ├── messageFormatter.js # Generar mensajes WhatsApp
│   └── constants.js      # Estados, pipelines, display helpers
├── styles/
│   ├── theme.js        # darkTheme, lightTheme
│   ├── componentStyles.js # getXxxStyles para cada componente
│   ├── statusColors.js  # Motor de gradiente de estado (getStatusColors, getPipelineForEntity)
│   └── animations.css  # Animaciones (fadeIn, slideUp, spin, shimmer, etc.)
├── config/
│   └── supabase.js    # Cliente Supabase
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
- Estados en PIPELINE_PROPERTY, ESTADOS_LEAD, ESTADOS_PROPIETARIO
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

### 6. Iconos y Emojis
- NUNCA emojis en código — usar siempre iconos de lucide-react
- NUNCA caracteres Unicode como ✓, ✏️, 🏢 en JSX — usar Lucide icons
- Todos los iconos vienen de "lucide-react"

---

## Flujo correcto al crear un componente nuevo

1. Agregar estilos en componentStyles.js → getNuevoStyles(t, mode)
2. Agregar constantes necesarias en constants.js
3. Si necesita datos de Supabase → agregar función en api.js o contactsApi.js
4. Si maneja estado propio de fetch → crear useNuevo.js en hooks/
5. El componente solo: importa hook + styles + constants, renderiza

---

## Pipelines de estado

### Propiedades
`["Descartado", "Mantenimiento", "Disponible", "Reservado", "Cerrado"]`

### Leads (clientes que buscan comprar/alquilar)
`["Descartado", "Interesado", "Seguimiento", "Visita", "Seguimiento post-visita", "Cerrado"]`

### Propietarios (captación)
`["Descartado", "Contactado", "Propuesta/Tasación", "Seguimiento", "Cerrado"]`

### Colores de estado
- Generados automáticamente por getStatusColors(status, pipeline, t, mode, variant) en statusColors.js
- getPipelineForEntity(entityType) para obtener el pipeline correcto
- Nunca definir colores de estado fuera de statusColors.js

---

## useStatus — Hook de colores de estado

```js
import { useStatus } from "../hooks/useStatus.js";

// Uso: ec = useStatus(estado, tipo, variant)
// tipos: "property" | "lead" | "propietario"
// variant: "solid" (badges, cards) | "subtle" (selects)

// ec devuelve: { bg, text, dot, border, progress }
```

---

## Componentes UI disponibles

### RocaDialog
```jsx
import { RocaDialog } from "./components/ui/dialog.jsx";

<RocaDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Mi título"
  variant="bottom" | "center"
  footer={<Button>Guardar</Button>}
>
  {children}
</RocaDialog>
```

### RocaSelect
```jsx
import { StatusSelect, RocaSelect } from "./components/ui/select.jsx";

// Select de estado con colores automáticos (usa pipeline)
<StatusSelect
  value={estado}
  onValueChange={setEstado}
  pipeline={PIPELINE_PROPERTY}
/>

// Select genérico
<RocaSelect
  value={value}
  onValueChange={setValue}
  options={["Opción 1", "Opción 2"]}
  placeholder="Seleccionar"
/>
```

### Dropdown
```jsx
import { Dropdown } from "./components/ui/dropdown.jsx";

<Dropdown
  trigger={<Button>Menú</Button>}
  items={[
    { label: "Editar", icon: PencilLine, onClick: handleEdit },
    { label: "Eliminar", icon: Trash2, onClick: handleDelete, danger: true },
    { divider: true },
    { label: "Cerrar", icon: X, onClick: handleClose },
  ]}
/>
```

### ToastProvider + useToast
```jsx
import { ToastProvider, useToast } from "./components/ui/ToastProvider.jsx";

// En App.jsx:
<ToastProvider>
// ...

// En cualquier componente:
const { toast } = useToast();
toast.success("¡Guardado!");
toast.error("Error");
toast.info("Info");
toast.warning("Cuidado");
```

### Gallery
```jsx
import { Gallery } from "./components/ui/Gallery.jsx";

<Gallery
  fotos={["url1", "url2"]}
  onClose={handleClose}
  initialIndex={0}
/>
```

---

## Relaciones en base de datos
- propiedades.propietario_id → FK a contactos
- contactos.propiedad_id → FK a propiedades
- Asignación/desasignación siempre via contactsApi: assignPropietario / unassignPropietario

---

## Anti-patrones prohibidos
- ❌ Estilos inline en JSX (salvo valor 100% dinámico)
- ❌ supabase.from() dentro de componentes
- ❌ Arrays de estados definidos en componentes
- ❌ Colores hardcodeados fuera de theme.js / statusColors.js
- ❌ Lógica de fetch fuera de hooks
- ❌ Duplicar funciones que ya existen en utils
- ❌ Emojis o caracteres Unicode (✓, ✏️, 🏢, etc.) — usar Lucide icons

---

## Funciones de estilos disponibles

### componentStyles.js
| Función | Uso |
|---------|-----|
| getPropertyCardStyles | Card de propiedad en lista |
| getPropertyDetailStyles | Vista detalle de propiedad |
| getFormStyles | Formulario de propiedad |
| getClientsViewStyles | Vista CRM (lista de contactos) |
| getContactFormStyles | Formulario de contacto |
| getContactCardStyles | Card de contacto (con color por estado) |
| getPropietarioModalStyles | Modal de asignación de propietario |
| getAppStyles | App principal (topBar, list, empty, etc.) |
| getProfileMenuStyles | Drawer de perfil |
| getDialogStyles | RocaDialog |
| createShadow | Sombras dinámicas |
| glassSurface | Efecto glass con blur |
| focusRing | Anillo dorado para focus |

### statusColors.js
| Función | Uso |
|---------|-----|
| getStatusColors | Colores interpolados por estado/pipeline |
| getPipelineForEntity | Obtener pipeline por tipo de entidad |
| generateStatusPalette | Debug/visualización de paleta |