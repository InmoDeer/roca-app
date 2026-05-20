# Graph Report - .  (2026-05-19)

## Corpus Check
- Corpus is ~20,222 words - fits in a single context window. You may not need a graph.

## Summary
- 232 nodes · 362 edges · 24 communities (16 shown, 8 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Form Fields & Validation|Form Fields & Validation]]
- [[_COMMUNITY_Property Features & Listing|Property Features & Listing]]
- [[_COMMUNITY_TS Config & Build|TS Config & Build]]
- [[_COMMUNITY_App Shell & Auth|App Shell & Auth]]
- [[_COMMUNITY_UI Components & MediaViewer|UI Components & MediaViewer]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Architectural Patterns|Architectural Patterns]]
- [[_COMMUNITY_Runtime Dependencies|Runtime Dependencies]]
- [[_COMMUNITY_Layout & Theme System|Layout & Theme System]]
- [[_COMMUNITY_Project Docs & Rules|Project Docs & Rules]]
- [[_COMMUNITY_Status Color Pipeline|Status Color Pipeline]]
- [[_COMMUNITY_API & Data Layer|API & Data Layer]]
- [[_COMMUNITY_Cloudinary API|Cloudinary API]]
- [[_COMMUNITY_Build Configuration|Build Configuration]]
- [[_COMMUNITY_OpenCode Plugin|OpenCode Plugin]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_OpenCode Schema|OpenCode Schema]]
- [[_COMMUNITY_Next Config|Next Config]]
- [[_COMMUNITY_Type Declarations|Type Declarations]]
- [[_COMMUNITY_Select Components|Select Components]]
- [[_COMMUNITY_Dialog Component|Dialog Component]]
- [[_COMMUNITY_Toast Provider|Toast Provider]]

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 34 edges
2. `compilerOptions` - 16 edges
3. `dependencies` - 16 edges
4. `devDependencies` - 9 edges
5. `Use Theme Hook/Provider` - 9 edges
6. `getStatusColors()` - 7 edges
7. `PropertyForm Component` - 7 edges
8. `buildOutputs()` - 6 edges
9. `MediaViewer()` - 6 edges
10. `useStatus()` - 6 edges

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

## Communities (24 total, 8 thin omitted)

### Community 0 - "Form Fields & Validation"
Cohesion: 0.1
Nodes (22): GROUPS, LABELS, ManualHighlightsSelector(), Checkbox(), getCheckboxStyles(), Field(), getFieldStyles(), createProperty() (+14 more)

### Community 1 - "Property Features & Listing"
Cohesion: 0.19
Nodes (15): PropertyDetail(), PropertyFilters(), getSelectStyles(), Select(), useTheme(), PublicPropertyPage(), PIPELINE_PROPERTY, buildOutputs() (+7 more)

### Community 2 - "TS Config & Build"
Cohesion: 0.1
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 3 - "App Shell & Auth"
Cohesion: 0.18
Nodes (13): Home(), PropertyCard(), PropertyForm(), useAuth(), useProperties(), getAppStyles(), getDialogStyles(), getFormStyles() (+5 more)

### Community 4 - "UI Components & MediaViewer"
Cohesion: 0.13
Nodes (19): Checkbox Form Field Component, CopyShareBtns UI Component, Field Form Field Component, ManualHighlightsSelector Component, Manual Highlights Selection Groups, Manual Highlights Feature Labels, MediaViewer UI Component, MediaViewer Tabs (fotos/video/tour) (+11 more)

### Community 5 - "Package Dependencies"
Cohesion: 0.11
Nodes (17): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+9 more)

### Community 6 - "Architectural Patterns"
Cohesion: 0.17
Nodes (16): Arch: Context Provider Pattern, Arch: Status Color Pipeline, Arch: Theme-Aware Component Pattern, RocaDialog Component, RocaSelect Component, StatusSelect Component, ThemeProvider Component, ToastProvider (component) (+8 more)

### Community 7 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, lucide-react, next, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, @radix-ui/react-select, @radix-ui/react-tabs, @radix-ui/react-toast (+8 more)

### Community 8 - "Layout & Theme System"
Cohesion: 0.22
Nodes (7): metadata, ThemeContext, ThemeProvider(), darkTheme, lightTheme, ToastContext, ToastProvider()

### Community 9 - "Project Docs & Rules"
Cohesion: 0.24
Nodes (13): AGENTS.md Developer Rules, Anti-patterns: no inline styles, no direct supabase, no emojis, Brand: Dorado #d4af37 primary, dark/light theme, Home Page (login + list + detail + form), Root Layout (Theme + Toast Providers), PropertyCard Component (list card), PropertyFilters Component, Property Pipeline: Descartado/Mantenimiento/Disponible/Reservado/Cerrado (+5 more)

### Community 10 - "Status Color Pipeline"
Cohesion: 0.32
Nodes (9): useStatus(), blend(), getContrastText(), getLuminance(), getPipelineForEntity(), getStatusColors(), hexToRgb(), hexToRgba() (+1 more)

### Community 11 - "API & Data Layer"
Cohesion: 0.4
Nodes (6): Arch: API Facade Pattern, Properties Feature (Form/Detail), Use Auth Hook, Use Properties Hook, API CRUD Module, Supabase Client Module

### Community 12 - "Cloudinary API"
Cohesion: 0.83
Nodes (3): generateSignature(), getPublicIdFromUrl(), POST()

### Community 13 - "Build Configuration"
Cohesion: 0.67
Nodes (3): ESLint Config, Next.js Config, PostCSS Config (Tailwind)

## Knowledge Gaps
- **84 isolated node(s):** `nextConfig`, `config`, `target`, `lib`, `allowJs` (+79 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useTheme()` connect `Property Features & Listing` to `Form Fields & Validation`, `Layout & Theme System`, `Status Color Pipeline`, `App Shell & Auth`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Runtime Dependencies` to `Package Dependencies`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `Use Theme Hook/Provider` (e.g. with `StatusSelect Component` and `RocaSelect Component`) actually correct?**
  _`Use Theme Hook/Provider` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `nextConfig`, `config`, `target` to the rest of the system?**
  _84 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Form Fields & Validation` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `TS Config & Build` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `UI Components & MediaViewer` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._