# Graph Report - roca-app  (2026-05-26)

## Corpus Check
- 133 files · ~71,411 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1323 nodes · 1757 edges · 96 communities (80 shown, 16 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dd2c80ca`
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
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 52 edges
2. `Writing Skills` - 22 edges
3. `dependencies` - 19 edges
4. `compilerOptions` - 16 edges
5. `Testing Skills With Subagents` - 16 edges
6. `fetchPropertyById()` - 15 edges
7. `useAuth()` - 15 edges
8. `Test-Driven Development (TDD)` - 15 edges
9. `Code Review Reception` - 15 edges
10. `What You Must Do When Invoked` - 15 edges

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

## Communities (96 total, 16 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (65): AjustesPage(), Home(), HomeContent(), HomePage(), DashboardNav(), NAV_ITEMS, GROUPS, LABELS (+57 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (34): ActionResult, deleteCloudinaryImages(), createProperty(), deleteProperty(), fetchProperties(), fetchPropertyById(), updateProperty(), updatePropertyStatus() (+26 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (38): dependencies, lucide-react, next, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, @radix-ui/react-select, @radix-ui/react-tabs, @radix-ui/react-toast (+30 more)

### Community 3 - "Community 3"
Cohesion: 0.43
Nodes (6): deleteCloudinaryImage(), isCloudinaryUrl(), uploadToCloudinary(), generateSignature(), getPublicIdFromUrl(), POST()

### Community 4 - "Community 4"
Cohesion: 0.1
Nodes (22): ANTIGUEDAD_OPTIONS, CURRENCIES, getEstadoDisplay(), MASCOTAS_OPTIONS, OPERATIONS, PERFIL_IDEAL_OPTIONS, PIPELINE_PROPERTY, PROPERTY_TYPES (+14 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (25): EngineResult, processMessage(), buildResponse(), buildUnknownText(), ChatResponse, ChatInput(), ChatPanel(), ChatPanelProps (+17 more)

### Community 6 - "Community 6"
Cohesion: 0.24
Nodes (16): PropertyIntent, ParseContext, buildCreateIntent(), buildSearchIntent(), extractDistrito(), extractPrecio(), matchesAny(), normalizeEstado() (+8 more)

### Community 7 - "Community 7"
Cohesion: 0.1
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "Community 8"
Cohesion: 0.05
Nodes (43): 1. Explicit Negation in Rules, 2. Entry in Rationalization Table, 3. Red Flag Entry, 4. Update description, code:markdown (IMPORTANT: This is a real scenario. Choose and act.), code:yaml (description: Use when you wrote code before tests, when temp), code:markdown (your human partner: You read the skill and chose Option C an), code:markdown (Scenario: 200 lines done, forgot TDD, exhausted, dinner plan) (+35 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (19): Checkbox Form Field Component, CopyShareBtns UI Component, Field Form Field Component, ManualHighlightsSelector Component, Manual Highlights Selection Groups, Manual Highlights Feature Labels, MediaViewer UI Component, MediaViewer Tabs (fotos/video/tour) (+11 more)

### Community 10 - "Community 10"
Cohesion: 0.05
Nodes (44): code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash (mkdir -p graphify-out), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c ") (+36 more)

### Community 11 - "Community 11"
Cohesion: 0.17
Nodes (16): Arch: Context Provider Pattern, Arch: Status Color Pipeline, Arch: Theme-Aware Component Pattern, RocaDialog Component, RocaSelect Component, StatusSelect Component, ThemeProvider Component, ToastProvider (component) (+8 more)

### Community 12 - "Community 12"
Cohesion: 0.05
Nodes (36): Browser Events Format, Cards (visual designs), Cleaning Up, code:bash (# Start server with persistence (mockups saved to project)), code:html (<div class="options" data-multiselect>), code:html (<div class="cards">), code:html (<div class="mockup">), code:html (<div class="split">) (+28 more)

### Community 13 - "Community 13"
Cohesion: 0.23
Nodes (9): metadata, RootLayout(), viewport, ThemeContext, ThemeProvider(), darkTheme, lightTheme, ToastContext (+1 more)

### Community 14 - "Community 14"
Cohesion: 0.24
Nodes (13): AGENTS.md Developer Rules, Anti-patterns: no inline styles, no direct supabase, no emojis, Brand: Dorado #d4af37 primary, dark/light theme, Home Page (login + list + detail + form), Root Layout (Theme + Toast Providers), PropertyCard Component (list card), PropertyFilters Component, Property Pipeline: Descartado/Mantenimiento/Disponible/Reservado/Cerrado (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 16 - "Community 16"
Cohesion: 0.31
Nodes (7): combineGraphs(), { execSync }, extractDotBlocks(), fs, main(), path, renderToSvg()

### Community 17 - "Community 17"
Cohesion: 0.33
Nodes (3): eventQueue, indicator, target

### Community 18 - "Community 18"
Cohesion: 0.4
Nodes (6): Arch: API Facade Pattern, Properties Feature (Form/Detail), Use Auth Hook, Use Properties Hook, API CRUD Module, Supabase Client Module

### Community 21 - "Community 21"
Cohesion: 0.67
Nodes (3): ESLint Config, Next.js Config, PostCSS Config (Tailwind)

### Community 24 - "Community 24"
Cohesion: 0.06
Nodes (34): 1. Estilos — siempre componentStyles.ts, 2. Constantes — siempre constants.ts, 3. Action-first — negocio en core/actions, 4. Lógica de estado — siempre en hooks, 5. Tema, 6. Iconos, AGENTS.md - Reglas del Proyecto ROCA, Anti-patrones prohibidos (+26 more)

### Community 39 - "Community 39"
Cohesion: 0.06
Nodes (33): code:block1 (NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST), code:bash ($ npm test), code:typescript (function submitForm(data: FormData) {), code:bash ($ npm test), code:block13 (Production code → test exists and failed first), code:dot (digraph tdd_cycle {), code:typescript (test('retries failed operations 3 times', async () => {), code:typescript (test('retry works', async () => {) (+25 more)

### Community 40 - "Community 40"
Cohesion: 0.06
Nodes (33): code:block1 (/graphify                                             # full), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c "), code:bash ($(cat graphify-out/.graphify_python) -c ") (+25 more)

### Community 41 - "Community 41"
Cohesion: 0.06
Nodes (32): Anti-Pattern 1: Testing Mock Behavior, Anti-Pattern 2: Test-Only Methods in Production, Anti-Pattern 3: Mocking Without Understanding, Anti-Pattern 4: Incomplete Mocks, Anti-Pattern 5: Integration Tests as Afterthought, code:block1 (1. NEVER test mock behavior), code:block10 (BEFORE mocking any method:), code:typescript (// ❌ BAD: Partial mock - only fields you think you need) (+24 more)

### Community 42 - "Community 42"
Cohesion: 0.06
Nodes (32): Advanced: Skills with executable code, [Analysis Title], Anti-patterns to avoid, Avoid offering too many options, Avoid Windows-style paths, Build evaluations first, code:block36, code:`markdown (## Commit message format) (+24 more)

### Community 43 - "Community 43"
Cohesion: 0.06
Nodes (30): code:bash (# Run project's test suite), code:block10 (This will permanently delete:), code:bash (MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." re), code:bash (git branch -D <feature-branch>), code:bash (GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd), code:bash (MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." re), code:block2 (Tests failing (<N> failures). Must fix before completing:), code:bash (GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd) (+22 more)

### Community 44 - "Community 44"
Cohesion: 0.07
Nodes (29): Acknowledging Correct Feedback, Code Review Reception, code:block1 (WHEN receiving code review feedback:), code:block10 (Reviewer: "Remove legacy code"), code:block11 (Reviewer: "Implement proper metrics tracking with database, ), code:block12 (your human partner: "Fix items 1-6"), code:block2 (IF any item is unclear:), code:block3 (your human partner: "Fix 1-6") (+21 more)

### Community 45 - "Community 45"
Cohesion: 0.07
Nodes (29): 1a. Native Worktree Tools (preferred), 1b. Git Worktree Fallback, Assuming directory location, code:bash (GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd), code:bash (# If this returns a path, you're in a submodule, not a workt), code:bash (ls -d .worktrees 2>/dev/null     # Preferred (hidden)), code:bash (project=$(basename "$(git rev-parse --show-toplevel)")), code:bash (git check-ignore -q .worktrees 2>/dev/null || git check-igno) (+21 more)

### Community 46 - "Community 46"
Cohesion: 0.08
Nodes (26): Avoid deeply nested references, code:yaml (description: Analyze Excel spreadsheets, create pivot tables), code:yaml (description: Generate descriptive commit messages by analyzi), code:yaml (description: Helps with documents), code:yaml (description: Processes data), code:yaml (description: Does stuff with files), code:block15 (pdf/), code:`markdown (---) (+18 more)

### Community 47 - "Community 47"
Cohesion: 0.08
Nodes (24): 1. Observe the Symptom, 2. Find Immediate Cause, 3. Ask: What Called This?, 4. Keep Tracing Up, 5. Find Original Trigger, Adding Stack Traces, code:dot (digraph when_to_use {), code:block2 (Error: git init failed in ~/project/packages/core) (+16 more)

### Community 48 - "Community 48"
Cohesion: 0.08
Nodes (24): code:block1 (IMPORTANT: This is a real scenario. Choose and act.), code:block2 (IMPORTANT: This is a real scenario. Choose and act.), code:block3 (IMPORTANT: This is a real scenario. Choose and act.), code:block4 (IMPORTANT: This is a real scenario. Choose and act.), code:markdown (## Skills Library), code:markdown (## Skills Library), code:xml (<available_skills>), code:markdown (## Working with Skills) (+16 more)

### Community 49 - "Community 49"
Cohesion: 0.1
Nodes (20): 1. Authority, 2. Commitment, 3. Scarcity, 4. Social Proof, 5. Unity, 6. Reciprocity, 7. Liking, code:markdown (✅ Write code before test? Delete it. Start over. No exceptio) (+12 more)

### Community 50 - "Community 50"
Cohesion: 0.1
Nodes (19): 1. Identify Independent Domains, 2. Create Focused Agent Tasks, 3. Dispatch in Parallel, 4. Review and Integrate, Agent Prompt Structure, code:dot (digraph when_to_use {), code:typescript (// In Claude Code / AI environment), code:markdown (Fix the 3 failing tests in src/agents/agent-tool-abort.test.) (+11 more)

### Community 51 - "Community 51"
Cohesion: 0.1
Nodes (19): Bulletproofing Elements, Creation Log: Systematic Debugging Skill, Enhancement 1: TDD Reference, Extraction Decisions, Final Outcome, Initial Version, Iterations, Key Insight (+11 more)

### Community 52 - "Community 52"
Cohesion: 0.1
Nodes (19): code:block1 (NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST), code:block2 (For EACH component boundary:), code:bash (# Layer 1: Workflow), Common Rationalizations, Overview, Phase 1: Root Cause Investigation, Phase 2: Pattern Analysis, Phase 3: Hypothesis and Testing (+11 more)

### Community 53 - "Community 53"
Cohesion: 0.11
Nodes (18): code:block1 (NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE), code:block2 (BEFORE claiming any status or expressing satisfaction:), code:block3 (✅ [Run test command] [See: 34/34 pass] "All tests pass"), code:block4 (✅ Write → Run (pass) → Revert fix → Run (MUST FAIL) → Restor), code:block5 (✅ [Run build] [See: exit 0] "Build passes"), code:block6 (✅ Re-read plan → Create checklist → Verify each → Report gap), code:block7 (✅ Agent reports success → Check VCS diff → Verify changes → ), Common Failures (+10 more)

### Community 54 - "Community 54"
Cohesion: 0.11
Nodes (17): Code Examples, code:block1 (skills/), code:block14 (NO SKILL WITHOUT A FAILING TEST FIRST), code:markdown (---), Common Rationalizations for Skipping Testing, Directory Structure, Discovery Workflow, Overview (+9 more)

### Community 55 - "Community 55"
Cohesion: 0.12
Nodes (16): Bite-Sized Task Granularity, code:markdown (# [Feature Name] Implementation Plan), code:`markdown (### Task N: [Component Name]), code:block3, code:block4, code:block5, Execution Handoff, File Structure (+8 more)

### Community 56 - "Community 56"
Cohesion: 0.12
Nodes (16): Características destacadas, Como empezar, Diseño, Eres desarrollador?, Estados de propiedad, Filtros, Formulario completo, Fotos con drag & drop (+8 more)

### Community 57 - "Community 57"
Cohesion: 0.12
Nodes (15): Applying the Pattern, code:typescript (function createProject(name: string, workingDirectory: strin), code:typescript (function initializeWorkspace(projectDir: string, sessionId: ), code:typescript (async function gitInit(directory: string) {), code:typescript (async function gitInit(directory: string) {), Defense-in-Depth Validation, Example from Session, Key Insight (+7 more)

### Community 58 - "Community 58"
Cohesion: 0.14
Nodes (13): Advantages, code:dot (digraph when_to_use {), code:dot (digraph process {), code:block3 (You: I'm using Subagent-Driven Development to execute this p), Example Workflow, Handling Implementer Status, Integration, Model Selection (+5 more)

### Community 59 - "Community 59"
Cohesion: 0.14
Nodes (12): code:dot (digraph when_to_use {), code:typescript (// ❌ BEFORE: Guessing at timing), code:typescript (// Tool ticks every 100ms - need 2 ticks to verify partial o), Common Mistakes, Condition-Based Waiting, Core Pattern, Implementation, Overview (+4 more)

### Community 60 - "Community 60"
Cohesion: 0.15
Nodes (13): code:block52, code:block53, code:block56 (bigquery-skill/), code:markdown (Use the BigQuery:bigquery_schema tool to retrieve table sche), Create verifiable intermediate outputs, MCP tool references, Next steps, Package dependencies (+5 more)

### Community 61 - "Community 61"
Cohesion: 0.17
Nodes (12): 1. Rich Description Field, 2. Keyword Coverage, 3. Descriptive Naming, 4. Cross-Referencing Other Skills, 4. Token Efficiency (Critical), Claude Search Optimization (CSO), code:yaml (# ❌ BAD: Summarizes workflow - Claude may follow this instea), code:yaml (# ❌ BAD: Too abstract, vague, doesn't include when to use) (+4 more)

### Community 62 - "Community 62"
Cohesion: 0.17
Nodes (12): Address "Spirit vs Letter" Arguments, Build Rationalization Table, Bulletproofing Skills Against Rationalization, Close Every Loophole Explicitly, code:markdown (Write code before test? Delete it.), code:markdown (Write code before test? Delete it. Start over.), code:markdown (**Violating the letter of the rules is violating the spirit ), code:markdown (| Excuse | Reality |) (+4 more)

### Community 63 - "Community 63"
Cohesion: 0.18
Nodes (10): Executing Plans, Integration, Overview, Remember, Step 1: Load and Review Plan, Step 2: Execute Tasks, Step 3: Complete Development, The Process (+2 more)

### Community 64 - "Community 64"
Cohesion: 0.18
Nodes (10): code:dot (digraph skill_flow {), How to Access Skills, Instruction Priority, Platform Adaptation, Red Flags, Skill Priority, Skill Types, The Rule (+2 more)

### Community 65 - "Community 65"
Cohesion: 0.2
Nodes (9): After the Design, Anti-Pattern: "This Is Too Simple To Need A Design", Brainstorming Ideas Into Designs, Checklist, code:dot (digraph brainstorming {), Key Principles, Process Flow, The Process (+1 more)

### Community 66 - "Community 66"
Cohesion: 0.2
Nodes (9): Avoid time-sensitive information, code:markdown (If you're doing this before August 2025, use the old API.), code:markdown (## Current method), code:`markdown (## Report structure), Common patterns, Content guidelines, Skill authoring best practices, Template pattern (+1 more)

### Community 67 - "Community 67"
Cohesion: 0.22
Nodes (8): code:bash (BASE_SHA=$(git rev-parse HEAD~1)  # or origin/main), code:block2 ([Just completed Task 2: Add verification function]), Example, How to Request, Integration with Workflows, Red Flags, Requesting Code Review, When to Request Review

### Community 68 - "Community 68"
Cohesion: 0.22
Nodes (9): code:`markdown (## Research synthesis workflow), code:block26, code:`markdown (## PDF form filling workflow), code:block28, code:markdown (## Content review process), code:markdown (## Document editing process), Implement feedback loops, Use workflows for complex tasks (+1 more)

### Community 69 - "Community 69"
Cohesion: 0.29
Nodes (6): code:toml ([features]), code:bash (GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd), Codex App Finishing, Codex Tool Mapping, Environment Detection, Subagent dispatch requires multi-agent support

### Community 70 - "Community 70"
Cohesion: 0.29
Nodes (7): code:block11 (defense-in-depth/), code:block12 (condition-based-waiting/), code:block13 (pptx/), File Organization, Self-Contained Skill, Skill with Heavy Reference, Skill with Reusable Tool

### Community 71 - "Community 71"
Cohesion: 0.33
Nodes (5): Code Reviewer Prompt Template, code:block1 (Task tool (general-purpose):), code:block2, code:block3 (### Strengths), Example Output

### Community 72 - "Community 72"
Cohesion: 0.33
Nodes (5): Choose A, B, or C, code:block1 (PaymentError: Connection timeout to payments.api.com), Pressure Test 1: Emergency Production Fix, Scenario, Your Options

### Community 73 - "Community 73"
Cohesion: 0.33
Nodes (5): Choose A, B, or C, code:block1 (Expected: { status: 'completed', amount: 100 }), Pressure Test 2: Sunk Cost + Exhaustion, Scenario, Your Options

### Community 74 - "Community 74"
Cohesion: 0.33
Nodes (5): Additional Gemini CLI tools, Gemini CLI Tool Mapping, Parallel dispatch, Prompt filling, Subagent support

### Community 75 - "Community 75"
Cohesion: 0.33
Nodes (6): [Analysis Title], code:block34, code:`markdown (## Report structure), Executive summary, Key findings, Recommendations

### Community 76 - "Community 76"
Cohesion: 0.33
Nodes (6): code:`markdown (## Extract PDF text), code:block2, code:markdown (## Extract PDF text), Concise is key, Core principles, Test with all models you plan to use

### Community 77 - "Community 77"
Cohesion: 0.33
Nodes (6): code:markdown (## Code review process), code:`markdown (## Generate report), code:block6, code:`markdown (## Database migration), code:block8, Set appropriate degrees of freedom

### Community 78 - "Community 78"
Cohesion: 0.33
Nodes (6): Anti-Patterns, ❌ Code in Flowcharts, code:dot (step1 [label="import fs"];), ❌ Generic Labels, ❌ Multi-Language Dilution, ❌ Narrative Example

### Community 79 - "Community 79"
Cohesion: 0.4
Nodes (4): Choose A, B, or C, Pressure Test 3: Authority + Social Pressure, Scenario, Your Options

### Community 80 - "Community 80"
Cohesion: 0.4
Nodes (5): Discipline-Enforcing Skills (rules/requirements), Pattern Skills (mental models), Reference Skills (documentation/APIs), Technique Skills (how-to guides), Testing All Skill Types

### Community 81 - "Community 81"
Cohesion: 0.5
Nodes (3): Additional Copilot CLI tools, Async shell sessions, Copilot CLI Tool Mapping

### Community 82 - "Community 82"
Cohesion: 0.5
Nodes (4): Checklist for effective Skills, Code and scripts, Core quality, Testing

### Community 83 - "Community 83"
Cohesion: 0.5
Nodes (4): GREEN: Write Minimal Skill, RED-GREEN-REFACTOR for Skills, RED: Write Failing Test (Baseline), REFACTOR: Close Loopholes

### Community 84 - "Community 84"
Cohesion: 0.5
Nodes (4): Pattern, Reference, Skill Types, Technique

### Community 90 - "Community 90"
Cohesion: 0.67
Nodes (3): Avoid assuming tools are installed, code:`markdown (**Bad example: Assumes installation**:), code:"

### Community 91 - "Community 91"
Cohesion: 0.67
Nodes (3): code:`markdown (## Form layout analysis), code:block55, Use visual analysis

### Community 92 - "Community 92"
Cohesion: 0.67
Nodes (3): code:bash (./render-graphs.js ../some-skill           # Each diagram se), code:dot (digraph when_flowchart {), Flowchart Usage

### Community 94 - "Community 94"
Cohesion: 0.29
Nodes (12): formatCardBrief(), PropertyResultCard(), useStatus(), blend(), generateStatusPalette(), getContrastText(), getLuminance(), getPipelineForEntity() (+4 more)

## Knowledge Gaps
- **687 isolated node(s):** `nextConfig`, `config`, `target`, `lib`, `allowJs` (+682 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useTheme()` connect `Community 0` to `Community 5`, `Community 13`, `Community 94`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `StatusSelect()` connect `Community 0` to `Community 4`, `Community 94`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `getEstadoDisplay()` connect `Community 4` to `Community 0`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `nextConfig`, `config`, `target` to the rest of the system?**
  _687 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._