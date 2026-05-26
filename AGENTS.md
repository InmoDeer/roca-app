## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- ALWAYS read graphify-out/GRAPH_REPORT.md before reading any source files, running grep/glob searches, or answering codebase questions. The graph is your primary map of the codebase.
- IF graphify-out/wiki/index.md EXISTS, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

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
├── app/
│   ├── layout.tsx
│   ├── page.tsx               # ?id= galería pública; sin id → /propiedades
│   ├── login/
│   ├── (dashboard)/           # Rutas autenticadas + nav inferior
│   │   ├── propiedades/
│   │   └── ajustes/
│   ├── propiedad/[id]/
│   └── api/cloudinary/delete/
├── features/
│   ├── properties/views/      # PropertiesView
│   ├── auth/views/            # LoginView
│   ├── dashboard/components/  # DashboardNav, StubPage
│   └── chat/components/       # ChatPanel, MessageBubble, ChatInput, etc.
├── components/
│   ├── ui/                    # Dialog, MediaViewer, CopyShareBtns, ToastProvider, Select
│   ├── formFields/            # Field, Select, Checkbox
│   ├── ManualHighlightsSelector.tsx
│   ├── PropertyCard.tsx
│   ├── PropertyDetail.tsx
│   ├── PropertyFilters.tsx
│   └── PropertyForm.tsx
├── core/
│   ├── entities/property/     # types, constants, mapper
│   ├── actions/properties/    # 1 archivo por acción (action-first)
│   ├── actions/chat/          # parseIntent regex + IA fallback opcional
│   ├── chat/                  # chatEngine, responseBuilder
│   ├── presenters/            # propertyText, summaryText
│   ├── repositories/          # I/O Supabase
│   └── services/              # supabase, cloudinary, gemini
├── hooks/
│   ├── useAuth.ts             # Auth (login/logout)
│   ├── useProperties.ts       # CRUD propiedades
│   ├── useStatus.ts           # Colores dinámicos por estado
│   ├── useTheme.tsx           # Tema (t, mode, toggle)
│   ├── useChat.ts             # Chat: estado + sendMessage
│   └── useVoiceRecognition.ts # Dictado por voz
├── lib/
│   ├── highlights.ts          # Auto-highlights + HIGHLIGHT_GROUPS + getAmplitudLabel
│   └── messageFormatter.ts    # Generar mensajes WhatsApp con auto-highlights
└── styles/
    ├── theme.ts
    ├── componentStyles.ts
    └── statusColors.ts
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

### 3. Action-first — negocio en core/actions
- UI, chat y automatizaciones → `core/actions/*` → `repositories/*` → `services/*`
- NUNCA acceder a repositorios o servicios desde componentes/features — todo pasa por `core/actions/`
- `lib/` solo contiene utilidades de formateo (`highlights`, `messageFormatter`); toda lógica nueva va en `core/`

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

### MediaViewer
```tsx
import { MediaViewer } from "./components/ui/MediaViewer";

<MediaViewer
  fotos={["url1", "url2"]}
  videoUrl="https://youtube.com/..."
  tourUrl="https://tour.com/..."
  onClose={handleClose}
  initialIndex={0}
/>
```

---

## Anti-patrones prohibidos
- Estilos inline en JSX (salvo valor 100% dinámico)
- supabase.from() dentro de componentes (excepción documentada)
- Arrays de estados definidos en componentes
- Colores hardcodeados fuera de theme.ts / statusColors.ts
- Lógica de fetch fuera de hooks
- Duplicar lógica de estilos en componentes (usar componentStyles.ts)
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
| getDashboardStyles | DashboardLayout + Nav inferior + stub |
| getChatStyles | ChatPanel, MessageBubble, ChatInput |
| getDialogStyles | RocaDialog |
| getSelectStyles | RocaSelect / StatusSelect |
| getCheckboxStyles | Checkbox en form |
| getFieldStyles | Field en form |
| primaryGradient | Gradiente dorado reutilizable |
| getLabelStyle | Estilo de label compartido |

### statusColors.ts
| Función | Uso |
|---------|-----|
| getStatusColors | Colores interpolados por estado |
| getPipelineForEntity | Obtener pipeline para entity |

---

## Cambios recientes (sesión 26/05/2026)

### ChatPanel -- auto-scroll y click-fuera
- `src/features/chat/components/ChatPanel.tsx`
- **Auto-scroll**: `useEffect` con `scrollIntoView` cuando `messages` cambia
- **Cerrar ayuda al click fuera**: `helpRef` + `useEffect` con `mousedown` en document, cierra `HelpCommands` si el target está fuera del ref

### parseIntent.ts -- múltiples fixes al parser regex
- **normalizeTipo** reescrita con mapa `TIPO_KEYWORDS`. Plurales generados automáticamente (`s?` / `es?`). Para agregar un tipo nuevo, solo añadir línea al mapa
- **normalizeOperacion**: agregados `\bventas\b`, `\barriendos?\b`, restaurado `\balquileres\b`
- **extractPrecio**: eliminado `!text.includes("crear")` que bloqueaba extracción de precio en comandos `create`
- **buildCreateIntent**: ahora recibe `ctx`, usa `extractDistrito(text, ctx)` en vez de regex manual; precio ya no defaultea a `0`
- **extractDistrito reescrito**: segmenta por palabras, encuentra TODOS los candidatos tras `en`/`de`, filtra por tipo/operación/precio, itera de atrás a adelante (último candidato suele ser el más específico)
- **Create keywords**: agregados `"crea"`, `"nuevo"`
- **Search keywords**: agregados `"departamentos en"`, `"locales en"`, `"oficinas en"`, `"terrenos en"`, `"ventas"`, `"arriendos"`

### parseIntent.ts -- prompt Gemini mejorado
- Ahora incluye estructura JSON completa de cada acción con campos opcionales y valores válidos, más ejemplos concretos

### Archivos modificados en esta sesión
- `src/features/chat/components/ChatPanel.tsx` — auto-scroll + click-fuera
- `src/core/actions/chat/parseIntent.ts` — normalizeTipo, normalizeOperacion, extractDistrito, buildCreateIntent, extractPrecio, keywords
- `src/core/services/gemini/parseIntent.ts` — prompt con estructura JSON
