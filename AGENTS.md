# AGENTS.md - Reglas del Proyecto ROCA

## Descripción
- Nombre: ROCA App
- Tipo: Next.js 15 + React 19 + TypeScript + Supabase
- Propósito: Gestión de propiedades inmobiliarias para agentes

---

## Stack
- Next.js 15 (App Router)
- React 19
- TypeScript
- Supabase (DB + Auth)
- Cloudinary (fotos)
- Radix UI (dialog, dropdown, select, tabs, toast)
- Lucide React (iconos)

---

## Estructura
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home (lista de propiedades)
│   └── propiedad/[id]/     # Detalle de propiedad
├── components/
│   ├── ui/                 # Gallery, CopyShareBtns, dialog, dropdown, select, skeleton, tabs, ToastProvider
│   └── formFields/         # Field, Select, Checkbox
├── hooks/
│   ├── useAuth.ts          # Auth (login/logout)
│   ├── useProperties.ts    # CRUD propiedades
│   ├── useStatus.ts        # Colores dinámicos por estado
│   ├── useTheme.tsx        # Tema (t, mode, toggle)
│   └── useSwipeBack.ts
├── lib/
│   ├── api.ts              # CRUD propiedades
│   ├── supabase.ts         # Cliente Supabase
│   ├── cloudinary.ts       # Upload fotos
│   ├── constants.ts         # Estados, tipos, monedas
│   └── messageFormatter.ts # Generar mensajes WhatsApp
├── styles/
│   ├── theme.ts            # darkTheme, lightTheme
│   ├── componentStyles.ts  # getXxxStyles para cada componente
│   └── statusColors.ts     # Motor de gradiente de estado
├── middleware.ts          # Auth middleware
└── globals.css
```

---

## REGLAS OBLIGATORIAS

### 1. Estilos — siempre componentStyles.ts
- NUNCA estilos inline en JSX salvo valores dinámicos puntuales
- Cada componente usa su función: `getXxxStyles(t, mode)`
- t viene de useTheme(), nunca hardcodear colores
- Colores del tema: `t.colors.primary`, `t.colors.bg`, `t.colors.text`, etc.

### 2. Constantes — siempre constants.ts
- NUNCA definir arrays de estados o colores dentro de componentes
- Estados en `PIPELINE_PROPERTY`
- Tipos, monedas, opciones de formulario: todo en constants.ts

### 3. API / Supabase — siempre a través de lib/api.ts
- NUNCA llamar supabase directo desde componentes
- Propiedades → lib/api.ts
- Si necesitás una query nueva, agregás la función al util correspondiente

### 4. Lógica de estado — siempre en hooks
- NUNCA fetch + useState + useEffect dentro de un componente
- Propiedades → useProperties
- Los componentes solo llaman al hook y renderizan

### 5. Tema
- Siempre usar useTheme() para obtener t y mode
- t.colors.primary = dorado (#d4af37)
- mode = "dark" | "light"
- Nunca hardcodear "#0a0a0a" o "#ffffff" — usar t.colors.bg / t.colors.text

### 6. Iconos
- NUNCA emojis en código — usar iconos de lucide-react
- Todos los iconos vienen de "lucide-react"

---

## Pipeline de propiedades

```ts
["Descartado", "Mantenimiento", "Disponible", "Reservado", "Cerrado"]
```

### Colores de estado
- Generados automáticamente por `getStatusColors()` en statusColors.ts
- Nunca definir colores de estado fuera de statusColors.ts

---

## useStatus — Hook de colores de estado

```ts
import { useStatus } from "../hooks/useStatus.ts";

const ec = useStatus("Disponible", "property", "solid");
// ec devuelve: { bg, text, dot, border, progress }
```

---

## Componentes UI disponibles

### RocaDialog
```tsx
import { RocaDialog } from "./components/ui/dialog.tsx";

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

### RocaSelect / StatusSelect
```tsx
import { StatusSelect, RocaSelect } from "./components/ui/select.tsx";

<StatusSelect
  value={estado}
  onValueChange={setEstado}
  pipeline={PIPELINE_PROPERTY}
/>

<RocaSelect
  value={value}
  onValueChange={setValue}
  options={["Opción 1", "Opción 2"]}
  placeholder="Seleccionar"
/>
```

### Dropdown
```tsx
import { Dropdown } from "./components/ui/dropdown.tsx";

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
```tsx
// En layout.tsx:
<ToastProvider>

// En cualquier componente:
const { toast } = useToast();
toast.success("¡Guardado!");
toast.error("Error");
toast.info("Info");
toast.warning("Cuidado");
```

### Gallery
```tsx
import { Gallery } from "./components/ui/Gallery.tsx";

<Gallery
  fotos={["url1", "url2"]}
  onClose={handleClose}
  initialIndex={0}
/>
```

---

## Anti-patrones prohibidos
- Estilos inline en JSX (salvo valor 100% dinámico)
- supabase.from() dentro de componentes
- Arrays de estados definidos en componentes
- Colores hardcodeados fuera de theme.ts / statusColors.ts
- Lógica de fetch fuera de hooks
- Duplicar funciones que ya existen en lib/
- Emojis en código — usar Lucide icons

---

## Funciones de estilos disponibles

### componentStyles.ts
| Función | Uso |
|---------|-----|
| getPropertyCardStyles | Card de propiedad en lista |
| getPropertyDetailStyles | Vista detalle de propiedad |
| getFormStyles | Formulario de propiedad |
| getAppStyles | App principal (topBar, list, empty, etc.) |
| getDialogStyles | RocaDialog |
| createShadow | Sombras dinámicas |
| glassSurface | Efecto glass con blur |

### statusColors.ts
| Función | Uso |
|---------|-----|
| getStatusColors | Colores interpolados por estado |
| getPipelineForEntity | Obtener pipeline para entity |
| generateStatusPalette | Debug de paleta |
