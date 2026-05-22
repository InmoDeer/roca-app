# Graph Report - .  (2026-05-22)

## Corpus Check
- 93 files · ~63,964 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 232 nodes · 362 edges · 24 communities (16 shown, 8 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]

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

### Community 0 - "Community 0"
Cohesion: 0.1
Nodes (22): GROUPS, LABELS, ManualHighlightsSelector(), Checkbox(), getCheckboxStyles(), Field(), getFieldStyles(), createProperty() (+14 more)

### Community 1 - "Community 1"
Cohesion: 0.19
Nodes (15): PropertyDetail(), PropertyFilters(), getSelectStyles(), Select(), useTheme(), PublicPropertyPage(), PIPELINE_PROPERTY, buildOutputs() (+7 more)

### Community 2 - "Community 2"
Cohesion: 0.1
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (13): Home(), PropertyCard(), PropertyForm(), useAuth(), useProperties(), getAppStyles(), getDialogStyles(), getFormStyles() (+5 more)

### Community 4 - "Community 4"
Cohesion: 0.13
Nodes (19): Checkbox Form Field Component, CopyShareBtns UI Component, Field Form Field Component, ManualHighlightsSelector Component, Manual Highlights Selection Groups, Manual Highlights Feature Labels, MediaViewer UI Component, MediaViewer Tabs (fotos/video/tour) (+11 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (17): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+9 more)

### Community 6 - "Community 6"
Cohesion: 0.17
Nodes (16): Arch: Context Provider Pattern, Arch: Status Color Pipeline, Arch: Theme-Aware Component Pattern, RocaDialog Component, RocaSelect Component, StatusSelect Component, ThemeProvider Component, ToastProvider (component) (+8 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (16): dependencies, lucide-react, next, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, @radix-ui/react-select, @radix-ui/react-tabs, @radix-ui/react-toast (+8 more)

### Community 8 - "Community 8"
Cohesion: 0.22
Nodes (7): metadata, ThemeContext, ThemeProvider(), darkTheme, lightTheme, ToastContext, ToastProvider()

### Community 9 - "Community 9"
Cohesion: 0.24
Nodes (13): AGENTS.md Developer Rules, Anti-patterns: no inline styles, no direct supabase, no emojis, Brand: Dorado #d4af37 primary, dark/light theme, Home Page (login + list + detail + form), Root Layout (Theme + Toast Providers), PropertyCard Component (list card), PropertyFilters Component, Property Pipeline: Descartado/Mantenimiento/Disponible/Reservado/Cerrado (+5 more)

### Community 10 - "Community 10"
Cohesion: 0.32
Nodes (9): useStatus(), blend(), getContrastText(), getLuminance(), getPipelineForEntity(), getStatusColors(), hexToRgb(), hexToRgba() (+1 more)

### Community 11 - "Community 11"
Cohesion: 0.4
Nodes (6): Arch: API Facade Pattern, Properties Feature (Form/Detail), Use Auth Hook, Use Properties Hook, API CRUD Module, Supabase Client Module

### Community 12 - "Community 12"
Cohesion: 0.83
Nodes (3): generateSignature(), getPublicIdFromUrl(), POST()

### Community 13 - "Community 13"
Cohesion: 0.67
Nodes (3): ESLint Config, Next.js Config, PostCSS Config (Tailwind)

## Knowledge Gaps
- **84 isolated node(s):** `nextConfig`, `config`, `target`, `lib`, `allowJs` (+79 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useTheme()` connect `Community 1` to `Community 0`, `Community 8`, `Community 10`, `Community 3`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 7` to `Community 5`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `Use Theme Hook/Provider` (e.g. with `StatusSelect Component` and `RocaSelect Component`) actually correct?**
  _`Use Theme Hook/Provider` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `nextConfig`, `config`, `target` to the rest of the system?**
  _84 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._