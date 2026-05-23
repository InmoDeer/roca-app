# Graph Report - .  (2026-05-23)

## Corpus Check
- 141 files · ~71,400 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 450 nodes · 904 edges · 39 communities (28 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_UI Components & Pages|UI Components & Pages]]
- [[_COMMUNITY_API & Data Layer|API & Data Layer]]
- [[_COMMUNITY_Package Config & Dependencies|Package Config & Dependencies]]
- [[_COMMUNITY_Form Fields & UI Primitives|Form Fields & UI Primitives]]
- [[_COMMUNITY_Constants & Enums|Constants & Enums]]
- [[_COMMUNITY_Chat Panel & Messaging|Chat Panel & Messaging]]
- [[_COMMUNITY_Intent Parser & Chat Engine|Intent Parser & Chat Engine]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Property Result Display|Property Result Display]]
- [[_COMMUNITY_Form Shared Components|Form Shared Components]]
- [[_COMMUNITY_Chat Response Builder|Chat Response Builder]]
- [[_COMMUNITY_UI Dialogs & Selects|UI Dialogs & Selects]]
- [[_COMMUNITY_Manual Highlights|Manual Highlights]]
- [[_COMMUNITY_Theme & Layout|Theme & Layout]]
- [[_COMMUNITY_Graphify Skills|Graphify Skills]]
- [[_COMMUNITY_Icons & Metadata|Icons & Metadata]]
- [[_COMMUNITY_Graph Build Tools|Graph Build Tools]]
- [[_COMMUNITY_Event System (JS)|Event System (JS)]]
- [[_COMMUNITY_Auth & Supabase|Auth & Supabase]]
- [[_COMMUNITY_Serwist SW|Serwist SW]]
- [[_COMMUNITY_Code (misc)|Code (misc)]]
- [[_COMMUNITY_JSON Schema|JSON Schema]]
- [[_COMMUNITY_Plugin Dependencies|Plugin Dependencies]]
- [[_COMMUNITY_FilterSort Properties|Filter/Sort Properties]]
- [[_COMMUNITY_Next Config|Next Config]]
- [[_COMMUNITY_Get Route|Get Route]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 52 edges
2. `dependencies` - 19 edges
3. `compilerOptions` - 16 edges
4. `useAuth()` - 15 edges
5. `fetchPropertyById()` - 15 edges
6. `getAppStyles()` - 13 edges
7. `ActionResult` - 12 edges
8. `parseIntent()` - 12 edges
9. `devDependencies` - 11 edges
10. `getStatusColors()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `PropertyCard Component (list card)` --renders_status_via_hook--> `Property Pipeline: Descartado/Mantenimiento/Disponible/Reservado/Cerrado`  [EXTRACTED]
  src/components/PropertyCard.tsx → AGENTS.md
- `PropertyFilters Component` --filters_by_status--> `Property Pipeline: Descartado/Mantenimiento/Disponible/Reservado/Cerrado`  [EXTRACTED]
  src/components/PropertyFilters.tsx → AGENTS.md
- `Home Page (login + list + detail + form)` --invokes_via_buildOutputs--> `WhatsApp Auto-Messaging with highlights`  [EXTRACTED]
  src/app/page.tsx → README.md
- `Home Page (login + list + detail + form)` --sorts_by_status_order--> `Property Pipeline: Descartado/Mantenimiento/Disponible/Reservado/Cerrado`  [EXTRACTED]
  src/app/page.tsx → AGENTS.md
- `Public Property Page (MediaViewer)` --invokes_via_buildOutputs--> `WhatsApp Auto-Messaging with highlights`  [EXTRACTED]
  src/app/propiedad/[id]/page.tsx → README.md

## Communities (39 total, 11 thin omitted)

### Community 0 - "UI Components & Pages"
Cohesion: 0.11
Nodes (33): AjustesPage(), Home(), HomeContent(), HomePage(), DashboardNav(), NAV_ITEMS, PropertyCard(), PropertyDetail() (+25 more)

### Community 1 - "API & Data Layer"
Cohesion: 0.12
Nodes (34): ActionResult, deleteCloudinaryImage(), deleteCloudinaryImages(), isCloudinaryUrl(), createProperty(), deleteProperty(), fetchProperties(), fetchPropertyById() (+26 more)

### Community 2 - "Package Config & Dependencies"
Cohesion: 0.05
Nodes (38): dependencies, lucide-react, next, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, @radix-ui/react-select, @radix-ui/react-tabs, @radix-ui/react-toast (+30 more)

### Community 3 - "Form Fields & UI Primitives"
Cohesion: 0.1
Nodes (21): generateSignature(), getPublicIdFromUrl(), POST(), Checkbox(), getCheckboxStyles(), Field(), getFieldStyles(), getSelectStyles() (+13 more)

### Community 4 - "Constants & Enums"
Cohesion: 0.1
Nodes (22): ANTIGUEDAD_OPTIONS, CURRENCIES, getEstadoDisplay(), MASCOTAS_OPTIONS, OPERATIONS, PERFIL_IDEAL_OPTIONS, PIPELINE_PROPERTY, PROPERTY_TYPES (+14 more)

### Community 5 - "Chat Panel & Messaging"
Cohesion: 0.14
Nodes (15): ChatInput(), ChatPanel(), ChatPanelProps, FormattedText(), HELP_COMMANDS, HelpCommands(), MessageBubble(), ChatMessage (+7 more)

### Community 6 - "Intent Parser & Chat Engine"
Cohesion: 0.26
Nodes (15): PropertyIntent, ParseContext, buildCreateIntent(), buildSearchIntent(), extractDistrito(), extractPrecio(), matchesAny(), normalizeEstado() (+7 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.1
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "Property Result Display"
Cohesion: 0.24
Nodes (13): formatCardBrief(), PropertyResultCard(), useStatus(), blend(), generateStatusPalette(), getContrastText(), getLuminance(), getPipelineForEntity() (+5 more)

### Community 9 - "Form Shared Components"
Cohesion: 0.13
Nodes (19): Checkbox Form Field Component, CopyShareBtns UI Component, Field Form Field Component, ManualHighlightsSelector Component, Manual Highlights Selection Groups, Manual Highlights Feature Labels, MediaViewer UI Component, MediaViewer Tabs (fotos/video/tour) (+11 more)

### Community 10 - "Chat Response Builder"
Cohesion: 0.21
Nodes (10): EngineResult, processMessage(), buildResponse(), buildUnknownText(), ChatResponse, formatCurrency(), formatPropertyBrief(), formatPropertyCardLine() (+2 more)

### Community 11 - "UI Dialogs & Selects"
Cohesion: 0.17
Nodes (16): Arch: Context Provider Pattern, Arch: Status Color Pipeline, Arch: Theme-Aware Component Pattern, RocaDialog Component, RocaSelect Component, StatusSelect Component, ThemeProvider Component, ToastProvider (component) (+8 more)

### Community 12 - "Manual Highlights"
Cohesion: 0.21
Nodes (11): GROUPS, LABELS, ManualHighlightsSelector(), ANTIGUEDAD_MAP, fuseManuales(), getAmplitudLabel(), HIGHLIGHT_GROUPS, KEY_TO_PHRASE_MAP (+3 more)

### Community 13 - "Theme & Layout"
Cohesion: 0.23
Nodes (9): metadata, RootLayout(), viewport, ThemeContext, ThemeProvider(), darkTheme, lightTheme, ToastContext (+1 more)

### Community 14 - "Graphify Skills"
Cohesion: 0.24
Nodes (13): AGENTS.md Developer Rules, Anti-patterns: no inline styles, no direct supabase, no emojis, Brand: Dorado #d4af37 primary, dark/light theme, Home Page (login + list + detail + form), Root Layout (Theme + Toast Providers), PropertyCard Component (list card), PropertyFilters Component, Property Pipeline: Descartado/Mantenimiento/Disponible/Reservado/Cerrado (+5 more)

### Community 15 - "Icons & Metadata"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 16 - "Graph Build Tools"
Cohesion: 0.31
Nodes (7): combineGraphs(), { execSync }, extractDotBlocks(), fs, main(), path, renderToSvg()

### Community 17 - "Event System (JS)"
Cohesion: 0.33
Nodes (3): eventQueue, indicator, target

### Community 18 - "Auth & Supabase"
Cohesion: 0.4
Nodes (6): Arch: API Facade Pattern, Properties Feature (Form/Detail), Use Auth Hook, Use Properties Hook, API CRUD Module, Supabase Client Module

### Community 21 - "Code (misc)"
Cohesion: 0.67
Nodes (3): ESLint Config, Next.js Config, PostCSS Config (Tailwind)

## Knowledge Gaps
- **136 isolated node(s):** `nextConfig`, `config`, `target`, `lib`, `allowJs` (+131 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useTheme()` connect `UI Components & Pages` to `Form Fields & UI Primitives`, `Chat Panel & Messaging`, `Property Result Display`, `Manual Highlights`, `Theme & Layout`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `StatusSelect()` connect `Property Result Display` to `UI Components & Pages`, `Constants & Enums`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `getEstadoDisplay()` connect `Constants & Enums` to `Property Result Display`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `nextConfig`, `config`, `target` to the rest of the system?**
  _136 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Components & Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `API & Data Layer` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Package Config & Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._