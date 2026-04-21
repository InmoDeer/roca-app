# Graph Report - .  (2026-04-17)

## Corpus Check
- 26 files · ~12,805 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 62 nodes · 53 edges · 21 communities detected
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]

## God Nodes (most connected - your core abstractions)
1. `Select()` - 4 edges
2. `cleanup()` - 4 edges
3. `deleteCloudinaryImage()` - 4 edges
4. `buildOutputs()` - 4 edges
5. `ROCAApp()` - 3 edges
6. `PropertyDetail()` - 3 edges
7. `generateSignature()` - 3 edges
8. `deleteCloudinaryImage()` - 3 edges
9. `getAllCloudinaryImages()` - 3 edges
10. `fetchPropertyById()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `cleanup()` --calls--> `Select()`  [INFERRED]
  src\scripts\cleanupOrphanedPhotos.js → src\components\formFields\Select.jsx
- `deleteProperty()` --calls--> `deleteCloudinaryImage()`  [INFERRED]
  src\utils\api.js → src\utils\cloudinary.js
- `ROCAApp()` --calls--> `useAuth()`  [INFERRED]
  src\App.jsx → src\hooks\useAuth.js
- `ROCAApp()` --calls--> `useProperties()`  [INFERRED]
  src\App.jsx → src\hooks\useProperties.js
- `fetchProperties()` --calls--> `Select()`  [INFERRED]
  src\utils\api.js → src\components\formFields\Select.jsx

## Communities

### Community 0 - "Community 0"
Cohesion: 0.28
Nodes (4): deleteProperty(), fetchProperties(), fetchPropertyById(), Select()

### Community 1 - "Community 1"
Cohesion: 0.29
Nodes (5): buildOutputs(), buildTituloDinamico(), PropertyDetail(), PublicPropertyPage(), useSwipeBack()

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (3): ROCAApp(), useAuth(), useProperties()

### Community 3 - "Community 3"
Cohesion: 0.8
Nodes (4): cleanup(), deleteCloudinaryImage(), generateSignature(), getAllCloudinaryImages()

### Community 4 - "Community 4"
Cohesion: 0.6
Nodes (3): deleteCloudinaryImage(), generateSignature(), getPublicIdFromUrl()

### Community 5 - "Community 5"
Cohesion: 0.4
Nodes (0): 

### Community 6 - "Community 6"
Cohesion: 1.0
Nodes (0): 

### Community 7 - "Community 7"
Cohesion: 1.0
Nodes (0): 

### Community 8 - "Community 8"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 6`** (2 nodes): `PropertyCard()`, `PropertyCard.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (2 nodes): `PropertyFilters()`, `PropertyFilters.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (2 nodes): `Checkbox()`, `Checkbox.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (2 nodes): `Field()`, `Field.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (2 nodes): `CopyShareBtns()`, `CopyShareBtns.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (2 nodes): `Gallery()`, `Gallery.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (2 nodes): `PropertyForm()`, `PropertyForm.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (2 nodes): `PublicGallery()`, `PublicGallery.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `eslint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (1 nodes): `vite.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (1 nodes): `main.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (1 nodes): `environment.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (1 nodes): `supabase.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (1 nodes): `theme.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (1 nodes): `constants.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Select()` connect `Community 0` to `Community 3`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `deleteProperty()` connect `Community 0` to `Community 4`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `deleteCloudinaryImage()` connect `Community 4` to `Community 0`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `Select()` (e.g. with `cleanup()` and `fetchProperties()`) actually correct?**
  _`Select()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `buildOutputs()` (e.g. with `PropertyDetail()` and `PublicPropertyPage()`) actually correct?**
  _`buildOutputs()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `ROCAApp()` (e.g. with `useAuth()` and `useProperties()`) actually correct?**
  _`ROCAApp()` has 2 INFERRED edges - model-reasoned connections that need verification._