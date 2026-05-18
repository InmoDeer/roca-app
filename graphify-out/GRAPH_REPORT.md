# Graph Report - roca-app  (2026-05-17)

## Corpus Check
- 42 files · ~19,877 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 527 nodes · 907 edges · 48 communities (28 shown, 20 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `951fd541`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

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
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 60 edges
2. `compilerOptions` - 16 edges
3. `dependencies` - 16 edges
4. `What You Must Do When Invoked` - 15 edges
5. `/graphify` - 14 edges
6. `ROCA App` - 13 edges
7. `getStatusColors()` - 12 edges
8. `PublicPropertyPage` - 11 edges
9. `AGENTS.md - Reglas del Proyecto ROCA` - 10 edges
10. `devDependencies` - 9 edges

## Surprising Connections (you probably didn't know these)
- `PublicPropertyPage()` --calls--> `buildOutputs()`  [INFERRED]
  /mnt/chromeos/removable/USB Drive/home/juan/Escritorio/ROCA/roca-app/docs/landing-archived/PublicPropertyPage.jsx → src/lib/messageFormatter.ts
- `PublicPropertyPage` --conceptually_related_to--> `isMobile Helper`  [INFERRED]
  src/app/propiedad/[id]/page.tsx → docs/landing-archived/PublicPropertyPage.jsx
- `ManualHighlightsSelector()` --calls--> `useTheme()`  [EXTRACTED]
  src/components/ManualHighlightsSelector.tsx → /mnt/chromeos/removable/USB Drive/home/juan/Escritorio/ROCA/roca-app/src/hooks/useTheme.tsx
- `PropertyForm()` --calls--> `useTheme()`  [EXTRACTED]
  src/components/PropertyForm.tsx → /mnt/chromeos/removable/USB Drive/home/juan/Escritorio/ROCA/roca-app/src/hooks/useTheme.tsx
- `PropertyCard()` --calls--> `useTheme()`  [EXTRACTED]
  src/components/PropertyCard.tsx → /mnt/chromeos/removable/USB Drive/home/juan/Escritorio/ROCA/roca-app/src/hooks/useTheme.tsx

## Hyperedges (group relationships)
- **Tech Stack Foundation** — rocaapp_nextjs, rocaapp_react, rocaapp_typescript, rocaapp_supabase, rocaapp_cloudinary, rocaapp_radix_ui, rocaapp_lucide_react, rocaapp_vercel [EXTRACTED 1.00]
- **Design System** — rocaapp_gold_identity, rocaapp_theme_system, rocaapp_component_styles, rocaapp_status_gradient [INFERRED 0.80]
- **Architecture Conventions** — rocaapp_api_layer, rocaapp_hooks_layer, rocaapp_constants_layer, rocaapp_antipatterns [INFERRED 0.85]

## Communities (48 total, 20 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (44): Business Name Config, Gallery Component, Helmet SEO Component, Home page (page.tsx), Loading Screen, Not Found, Photo Collage Grid, PropertyDetail (+36 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (30): metadata, RootLayout(), PropertyDetail(), PropertyFilters(), Checkbox(), getCheckboxStyles(), useSwipeBack(), ThemeContext (+22 more)

### Community 2 - "Community 2"
Cohesion: 0.1
Nodes (29): Home(), LABELS, ManualHighlightsSelector(), PropertyForm(), useAuth(), useProperties(), createProperty(), deleteProperty() (+21 more)

### Community 3 - "Community 3"
Cohesion: 0.2
Nodes (11): supabase, collageStyles, isMobile(), LoadingScreen(), NotFound(), PhotoCollage(), PublicPropertyPage(), styles (+3 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (22): AGENTS.md Developer Guide, Anti-pattern Prohibitions, API Layer (lib/api.ts), ROCA App, Cloudinary, Component Styles System, Constants Centralization, Gold Brand Identity (+14 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (14): Gallery (TSX), Toast Context, ToastProvider (JSX), ToastProvider (TSX), RocaDialog (JSX), RocaDialog (TSX), Dropdown (TSX), getDialogStyles Function (+6 more)

### Community 6 - "Community 6"
Cohesion: 0.1
Nodes (23): Field(), getFieldStyles(), getSelectStyles(), Select(), createShadow(), getDialogStyles(), getFormStyles(), glassSurface() (+15 more)

### Community 7 - "Community 7"
Cohesion: 0.22
Nodes (8): src/App.jsx, src/lib/constants.ts, src/lib/cloudinary.ts, src/main.jsx, src/lib/messageFormatter.ts, src/lib/api.ts, src/lib/supabase.ts, src/proxy.ts

### Community 8 - "Community 8"
Cohesion: 0.05
Nodes (44): code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash (mkdir -p graphify-out), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c ") (+36 more)

### Community 9 - "Community 9"
Cohesion: 0.29
Nodes (13): PropertyCard(), useStatus(), useStatusPalette(), getPropertyCardStyles(), blend(), generateStatusPalette(), getContrastText(), getLuminance() (+5 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (33): 1. Estilos — siempre componentStyles.ts, 2. Constantes — siempre constants.ts, 3. API / Supabase — siempre a través de lib/api.ts, 4. Lógica de estado — siempre en hooks, 5. Tema, 6. Iconos, AGENTS.md - Reglas del Proyecto ROCA, Anti-patrones prohibidos (+25 more)

### Community 11 - "Community 11"
Cohesion: 0.53
Nodes (4): Skeleton(), SkeletonCard(), SkeletonList(), SkeletonText()

### Community 12 - "Community 12"
Cohesion: 0.06
Nodes (33): code:block1 (/graphify                                             # full), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c ") (+25 more)

### Community 13 - "Community 13"
Cohesion: 0.47
Nodes (6): Component Styles (JS), Component Styles (TS), Status Color Engine (JS), Status Color Engine (TS), Theme Definitions (JS), Theme Definitions (TS)

### Community 14 - "Community 14"
Cohesion: 0.5
Nodes (4): Branding Asset, Evan You (Creator), Vite Logo SVG, Vite Build Tool

### Community 16 - "Community 16"
Cohesion: 0.67
Nodes (3): Hero Image, Hero Styles (componentStyles), Property Detail Hero Section

### Community 38 - "Community 38"
Cohesion: 0.06
Nodes (33): dependencies, lucide-react, next, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, @radix-ui/react-select, @radix-ui/react-tabs, @radix-ui/react-toast (+25 more)

### Community 39 - "Community 39"
Cohesion: 0.1
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 40 - "Community 40"
Cohesion: 0.12
Nodes (15): Características destacadas, Como empezar, Diseño, Eres desarrollador?, Estados de propiedad, Filtros, Formulario completo, Fotos con drag & drop (+7 more)

### Community 41 - "Community 41"
Cohesion: 0.5
Nodes (6): createProperty(), deleteProperty(), fetchProperties(), fetchPropertyById(), updateProperty(), updatePropertyStatus()

### Community 42 - "Community 42"
Cohesion: 0.83
Nodes (3): generateSignature(), getPublicIdFromUrl(), POST()

## Ambiguous Edges - Review These
- `src/lib/cloudinary.ts` → `PropertyCard.jsx`  [AMBIGUOUS]
  src/components/PropertyCard.jsx · relation: calls

## Knowledge Gaps
- **192 isolated node(s):** `nextConfig`, `rewrites`, `target`, `lib`, `allowJs` (+187 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `src/lib/cloudinary.ts` and `PropertyCard.jsx`?**
  _Edge tagged AMBIGUOUS (relation: calls) - confidence is low._
- **Why does `lucide-react` connect `Community 38` to `Community 1`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `useTheme()` connect `Community 1` to `Community 9`, `Community 2`, `Community 11`, `Community 6`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `nextConfig`, `rewrites`, `target` to the rest of the system?**
  _192 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._