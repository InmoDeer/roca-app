# AGENTS.md - Reglas del Proyecto ROCA

## Descripción
- Nombre: ROCA App
- Tipo: Next.js 16 + React 19 + TypeScript + Supabase
- Propósito: Gestión de propiedades inmobiliarias para agentes

---

## Stack
- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript (strict)
- Supabase (DB + Auth)
- Cloudinary (fotos)
- Radix UI (dialog, select, toast)
- Lucide React (iconos)

---

## Estructura
```
src/
├── app/                       # Next.js App Router
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home (lista + detalle + formulario)
│   ├── propiedad/[id]/        # Ruta pública de propiedad
│   └── api/cloudinary/delete/ # API route para eliminar fotos
├── components/
│   ├── ui/                    # Dialog, Gallery, CopyShareBtns, ToastProvider, Select
│   ├── formFields/            # Field, Select, Checkbox
│   ├── ManualHighlightsSelector.tsx
│   ├── PropertyCard.tsx
│   ├── PropertyDetail.tsx
│   ├── PropertyFilters.tsx
│   └── PropertyForm.tsx
├── hooks/
│   ├── useAuth.ts             # Auth (login/logout)
│   ├── useProperties.ts       # CRUD propiedades
│   ├── useStatus.ts           # Colores dinámicos por estado
│   └── useTheme.tsx           # Tema (t, mode, toggle)
├── lib/
│   ├── api.ts                 # CRUD propiedades + fetchPropietarios
│   ├── supabase.ts            # Cliente Supabase (browser)
│   ├── cloudinary.ts          # Upload + delete fotos (vía API route)
│   ├── constants.ts           # Estados, tipos, monedas, opciones
│   └── messageFormatter.ts    # Generar mensajes WhatsApp con auto-highlights
├── styles/
│   ├── theme.ts               # darkTheme, lightTheme
│   ├── componentStyles.ts     # getXxxStyles para cada componente
│   └── statusColors.ts        # Motor de gradiente de estado
├── middleware.ts              # Auth middleware
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
- NUNCA llamar supabase directo desde componentes (excepción: PropertyForm usa `supabase.client.from("contacts")` para vincular propietario post-save)
- Propiedades → lib/api.ts
- Si necesitás una query nueva, agregás la función al util correspondiente

### 4. Lógica de estado — siempre en hooks
- NUNCA fetch + useState + useEffect dentro de un componente
- Propiedades → useProperties
- Los componentes solo llaman al hook y renderizan

### 5. Tema
- Siempre usar useTheme() para obtener t y mode
- `t.colors.primary` = dorado (#d4af37)
- `t.colors.primaryDark` = #b8962e
- mode = "dark" | "light"
- Nunca hardcodear "#0a0a0a" o "#ffffff" — usar t.colors.bg / t.colors.text

### 6. Iconos
- NUNCA emojis en código — usar iconos de lucide-react
- Todos los iconos vienen de "lucide-react"
- Excepción: mensajes WhatsApp (messageFormatter.ts) pueden usar emojis

---

## Pipeline de propiedades

```ts
["Descartado", "Mantenimiento", "Disponible", "Reservado", "Cerrado"]
```

### Colores de estado
- Generados automáticamente por `getStatusColors()` en statusColors.ts
- Nunca definir colores de estado fuera de statusColors.ts

---

## Componentes principales

### PropertyForm (`src/components/PropertyForm.tsx`)
Formulario completo para crear/editar propiedades con todas las secciones:
- General (nombre, tipo, operación)
- Ubicación (distrito, dirección, maps_url, cerca_a)
- Precio (precio, moneda, mantenimiento)
- Características físicas (dormitorios, ambientes, baños, área, piso, antigüedad)
- Amenities y extras (cochera, ascensor, amoblado, etc. con iconos)
- Calidad y confort (balcón, ventanas, closet, cocina, seguridad)
- Áreas comunes (sub-checkboxes condicionales)
- Destacar en mensaje (ManualHighlightsSelector)
- Multimedia (fotos con drag & drop + reorden, video_url, tour360_url)
- Propietario (selector desde DB)

### PropertyDetail (`src/components/PropertyDetail.tsx`)
Vista detalle de propiedad con:
- Header con botones eliminar/editar
- Hero image + galería
- Info principal (título, tipo, distrito, precio)
- StatusSelect para cambiar estado
- Tabs mensaje corto/largo con CopyShareBtns
- ActionGrid (ver fotos, tour 360, video, mapa)
- Cards de ubicación y multimedia

### PropertyCard (`src/components/PropertyCard.tsx`)
Card de propiedad en lista con menú de 3 puntitos (editar, duplicar, eliminar).

### PropertyFilters (`src/components/PropertyFilters.tsx`)
Barra de búsqueda por nombre/distrito + selects de operación, tipo y estado.

---

## Componentes UI disponibles

### RocaDialog
```tsx
import { RocaDialog } from "./components/ui/dialog";

<RocaDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Mi título"
  variant="bottom" | "center"
  footer={<button>Guardar</button>}
>
  {children}
</RocaDialog>
```

### RocaSelect / StatusSelect
```tsx
import { StatusSelect, RocaSelect } from "./components/ui/select";

<StatusSelect value={estado} onValueChange={setEstado} pipeline={PIPELINE_PROPERTY} />

<RocaSelect value={value} onValueChange={setValue} options={["A", "B"]} placeholder="Seleccionar" />
```

### ToastProvider + useToast
```tsx
// En layout.tsx:
<ToastProvider>

// En cualquier componente:
const { toast } = useToast();
toast.success("¡Guardado!");
toast.error("Error");
```

### Gallery
```tsx
import { Gallery } from "./components/ui/Gallery";

<Gallery fotos={["url1", "url2"]} onClose={handleClose} initialIndex={0} />
```

---

## Anti-patrones prohibidos
- Estilos inline en JSX (salvo valor 100% dinámico)
- supabase.from() dentro de componentes (excepción documentada)
- Arrays de estados definidos en componentes
- Colores hardcodeados fuera de theme.ts / statusColors.ts
- Lógica de fetch fuera de hooks
- Duplicar funciones que ya existen en lib/
- Emojis en código — usar Lucide icons (excepción: mensajes WhatsApp)

---

## Funciones de estilos disponibles

### componentStyles.ts
| Función | Uso |
|---------|-----|
| getPropertyCardStyles | Card de propiedad en lista |
| getPropertyDetailStyles | Vista detalle de propiedad |
| getFormStyles | Formulario de propiedad |
| getAppStyles | App principal (topBar, list, empty, etc.) |
| getProfileMenuStyles | Menú de perfil (toggle tema, cerrar sesión) |
| getDialogStyles | RocaDialog |
| createShadow | Sombras dinámicas |
| glassSurface | Efecto glass con blur |

### statusColors.ts
| Función | Uso |
|---------|-----|
| getStatusColors | Colores interpolados por estado |
| getPipelineForEntity | Obtener pipeline para entity |
| generateStatusPalette | Debug de paleta |
