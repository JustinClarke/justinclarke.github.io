# Project Refactoring & Directory Structure Guide

**Status:** RECOMMENDED CHANGES  
**Scope:** Code organization, scalability, maintainability  
**Effort:** ~8-10 hours  
**Priority:** MEDIUM (can parallelize with critical fixes)

---

## Current Structure Issues

### 🔴 Critical Problems

1. **Empty Folders**
   - `components/common/` exists but is empty
   - clutters project without serving purpose

2. **Deep Nesting of Sub-Components**
   - `components/home/expertise/ExpertiseSubComponents.tsx`
   - `components/home/hero/HeroSubComponents.tsx`
   - `components/projects/modal/ProjectModalSubComponents.tsx`
   - Adds unnecessary directory levels (hard to navigate)

3. **Ambiguous Naming**
   - "SubComponents" is unclear and generic
   - Hard to find what's inside without opening files
   - No semantic meaning

4. **Mixed Concerns in `components/ui/`**
   - `ContactModal.tsx` (page-level component, not reusable)
   - `CustomCursor.tsx` (global helper)
   - `Preloader.tsx` (global, not reusable)
   - Should be separated by type

5. **Single Files in Folders**
   - `context/` contains only `ModalContext.tsx`
   - `services/` contains only `api.ts`
   - No room for growth without restructuring

6. **Unclear Index Files**
   - Multiple `index.ts/tsx` files with unclear purpose
   - Not following consistent barrel export patterns
   - `data/index.tsx` exports JSX (confusing)

7. **Missing Core Patterns**
   - No Error Boundary component
   - No layout wrappers/providers folder
   - No shared utilities folder
   - No constants folder (mixed in config)

---

## Recommended New Structure

```
src/
├── _shared/
│   ├── components/
│   │   ├── ErrorBoundary.tsx
│   │   └── SectionContainer.tsx
│   ├── hooks/
│   │   ├── useReducedMotion.ts
│   │   ├── useSpotlight.ts
│   │   ├── useMouse.ts
│   │   └── index.ts (barrel)
│   ├── utils/
│   │   ├── cn.ts
│   │   ├── gemini.ts
│   │   └── index.ts (barrel)
│   ├── types/
│   │   └── index.ts (barrel)
│   └── constants/
│       └── index.ts
│
├── components/
│   ├── ui/
│   │   ├── Badge.tsx
│   │   ├── EducationCard.tsx
│   │   ├── ExperienceItem.tsx
│   │   ├── MagneticButton.tsx
│   │   └── SpotlightCard.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── HeroSubComponents.tsx
│   │   ├── ExpertiseAndExperience.tsx
│   │   ├── ExpertisePipeline.tsx
│   │   ├── ExpertiseSubComponents.tsx
│   │   ├── NetworkIllustration.tsx
│   │   └── TheCloser.tsx
│   ├── projects/
│   │   ├── FeaturedProjects.tsx
│   │   ├── ProjectCard.tsx (NEW - extracted from FeaturedProjects)
│   │   ├── ProjectModal.tsx
│   │   ├── ProjectModalContent.tsx (RENAMED from ProjectModalSubComponents)
│   │   └── Visuals.tsx
│   ├── modals/
│   │   ├── ContactModal.tsx
│   │   ├── ContactForm.tsx (NEW - extracted form logic)
│   │   └── index.ts (barrel)
│   └── ui-global/
│       ├── CustomCursor.tsx
│       ├── Preloader.tsx
│       └── index.ts (barrel)
│
├── context/
│   └── ModalContext.tsx
│
├── data/
│   ├── projects.ts (MOVED business logic out of TSX)
│   └── index.ts (barrel export)
│
├── config/
│   ├── animations.ts
│   └── constants.ts (MERGED with constants/)
│
├── services/
│   ├── api.ts
│   └── index.ts (barrel)
│
├── pages/
│   ├── Home.tsx
│   ├── NotFound.tsx
│   └── ProjectDetails.tsx
│
├── providers/
│   ├── ModalProvider.tsx (MOVED from context)
│   ├── RootProviders.tsx (NEW - wraps all providers)
│   └── index.ts (barrel)
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## Detailed Changes

### ❌ Delete These Files/Folders

```
components/common/                          # Empty folder
components/home/expertise/                  # Move content up
components/home/hero/                       # Move content up
components/layout/SectionContainer.tsx      # Move to _shared/components
components/projects/modal/                  # Move content up
components/ui/ContactModal.tsx              # Move to components/modals/
components/ui/CustomCursor.tsx              # Move to components/ui-global/
components/ui/Preloader.tsx                 # Move to components/ui-global/
```

### ✏️ Rename These Files

```
components/home/ExpertiseSubComponents.tsx
  → components/home/ExpertiseSubComponents.tsx (keep for now, but document it)

components/projects/ProjectModalSubComponents.tsx
  → components/projects/ProjectModalContent.tsx

components/home/HeroSubComponents.tsx
  → Maybe extract as HeroVisuals.tsx, HeroContent.tsx (split if large)
```

### 🆕 Create These Files

```
_shared/components/ErrorBoundary.tsx        # ESSENTIAL
_shared/hooks/index.ts                      # Barrel export
_shared/utils/cn.ts                         # Move from utils/index.ts
_shared/utils/gemini.ts                     # Move from utils/index.ts
_shared/utils/index.ts                      # Barrel export
_shared/types/index.ts                      # Move from types/index.ts
_shared/constants/index.ts                  # Move from config/

components/modals/index.ts                  # Barrel export
components/modals/ContactForm.tsx           # Extract form logic
components/ui-global/index.ts               # Barrel export

components/projects/ProjectCard.tsx         # Extract from FeaturedProjects
components/projects/index.ts                # Barrel export

providers/ModalProvider.tsx                 # Move from context
providers/RootProviders.tsx                 # Wrap all providers
providers/index.ts                          # Barrel export

data/projects.ts                            # Move from data/index.tsx
data/index.ts                               # Barrel export
```

### 🔄 Merge/Move These Folders

```
config/constants.ts
  → Move to: _shared/constants/index.ts
  (Consolidate all app constants in one place)

types/index.ts
  → Move to: _shared/types/index.ts
  (Shared across app)

utils/index.ts
  → Split into:
    - _shared/utils/cn.ts
    - _shared/utils/gemini.ts
    - _shared/utils/index.ts (barrel)

context/ModalContext.tsx
  → Move to: providers/ModalProvider.tsx
  (More semantic naming)
```

---

## Refactoring Actions

### Phase 1: Create New Folder Structure (2 hours)

```bash
# Create new directories
mkdir -p src/_shared/components
mkdir -p src/_shared/hooks
mkdir -p src/_shared/utils
mkdir -p src/_shared/types
mkdir -p src/_shared/constants

mkdir -p src/components/modals
mkdir -p src/components/ui-global
mkdir -p src/providers

# Move/copy files
mv src/components/layout/SectionContainer.tsx src/_shared/components/
mv src/types/index.ts src/_shared/types/
mv src/utils/index.ts src/_shared/utils/
mv src/hooks/index.ts src/_shared/hooks/

# Create new provider
mv src/context/ModalContext.tsx src/providers/ModalProvider.tsx
```

### Phase 2: Create Barrel Exports (1 hour)

Create these index files for clean imports:

**`src/_shared/utils/index.ts`**
```typescript
export { cn } from './cn';
export { getGeminiKey, safeAIRequest } from './gemini';
```

**`src/_shared/hooks/index.ts`**
```typescript
export { useReducedMotion } from './useReducedMotion';
export { useSpotlight } from './useSpotlight';
// ... other hooks
```

**`src/components/modals/index.ts`**
```typescript
export { ContactModal } from './ContactModal';
export { ContactForm } from './ContactForm';
```

**`src/providers/index.ts`**
```typescript
export { ModalProvider } from './ModalProvider';
export { RootProviders } from './RootProviders';
```

### Phase 3: Extract Sub-Components (3 hours)

**`components/projects/ProjectCard.tsx`** (NEW)
```typescript
// Extract from FeaturedProjects.tsx
// Individual project card component - reusable
export function ProjectCard({ project, onOpen }: Props) {
  // isolated logic
}
```

**`components/modals/ContactForm.tsx`** (NEW)
```typescript
// Extract from ContactModal.tsx
// Just the form, not the dialog wrapper
export function ContactForm({ onSubmit, status }: Props) {
  // form logic only
}
```

Rename and reorganize:
- `ProjectModalSubComponents.tsx` → `ProjectModalContent.tsx`
- Keep `HeroSubComponents.tsx` but consider splitting if >500 lines
- Keep `ExpertiseSubComponents.tsx` but document its purpose in header comment

### Phase 4: Update All Imports (2 hours)

**Before:**
```typescript
import { useReducedMotion, useSpotlight } from '../../hooks';
import { cn } from '../../utils';
import SectionContainer from '../layout/SectionContainer';
```

**After:**
```typescript
import { useReducedMotion, useSpotlight } from '@/_shared/hooks';
import { cn } from '@/_shared/utils';
import { SectionContainer } from '@/_shared/components';
```

**Update `tsconfig.json` paths aliasing:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/shared/*": ["./src/_shared/*"],
      "@/components/*": ["./src/components/*"],
      "@/providers/*": ["./src/providers/*"]
    }
  }
}
```

### Phase 5: Reorganize Data Files (1 hour)

**Move from `src/data/index.tsx` to `src/data/projects.ts`:**
```typescript
// src/data/projects.ts - Pure JS, no JSX
import { Project } from '@/shared/types';

export const projectsData: Project[] = [
  // ... project data
];
```

**Create barrel export:**
```typescript
// src/data/index.ts
export { projectsData } from './projects';
export { expertiseData } from './expertise'; // if needed
```

### Phase 6: Create Error Boundary (1.5 hours)

**`src/_shared/components/ErrorBoundary.tsx`**
```typescript
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<Props> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error, info);
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen bg-red-900/20">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-500">Something went wrong</h1>
              <p className="text-gray-400 mt-2">{this.state.error?.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
              >
                Reload Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### Phase 7: Create Root Providers (1 hour)

**`src/providers/RootProviders.tsx`**
```typescript
import { ReactNode } from 'react';
import { ModalProvider } from './ModalProvider';
import { ErrorBoundary } from '@/_shared/components/ErrorBoundary';

export function RootProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p>Application failed to load</p>
        </div>
      }
    >
      <ModalProvider>
        {children}
      </ModalProvider>
    </ErrorBoundary>
  );
}
```

**Update `src/main.tsx`:**
```typescript
import { RootProviders } from './providers';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <RootProviders>
        <App />
      </RootProviders>
    </HashRouter>
  </StrictMode>,
);
```

---

## File-by-File Changes

### `src/App.tsx`

**Before:**
```typescript
import { CustomCursor } from './components/ui/CustomCursor';
import { ContactModal } from './components/ui/ContactModal';
import { ProjectModal } from './components/projects/ProjectModal';
import { Preloader } from './components/ui/Preloader';
import { ModalProvider } from './context/ModalContext';
```

**After:**
```typescript
import { CustomCursor, Preloader } from './components/ui-global';
import { ContactModal } from './components/modals';
import { ProjectModal } from './components/projects';
// Remove ModalProvider - now in RootProviders
```

**And remove:**
```typescript
// DELETE THIS - moved to RootProviders
<ModalProvider>
  {/* ... */}
</ModalProvider>
```

---

## Import Path Standardization

### Current Messy State
```typescript
import { useReducedMotion } from '../../../hooks';
import { cn } from '../../../utils';
import SectionContainer from '../../layout/SectionContainer';
import { Badge } from '../ui/Badge';
```

### Clean State (with path aliases)
```typescript
import { useReducedMotion } from '@/_shared/hooks';
import { cn } from '@/_shared/utils';
import { SectionContainer } from '@/_shared/components';
import { Badge } from '@/components/ui';
```

---

## Migration Checklist

### Week 1

- [ ] Create new folder structure (`_shared/`, `providers/`, `components/modals/`, etc.)
- [ ] Create barrel exports for all index files
- [ ] Create ErrorBoundary component
- [ ] Create RootProviders wrapper
- [ ] Update tsconfig.json with path aliases

### Week 2

- [ ] Extract ProjectCard from FeaturedProjects
- [ ] Extract ContactForm from ContactModal
- [ ] Rename ProjectModalSubComponents → ProjectModalContent
- [ ] Move SectionContainer to _shared/components
- [ ] Move ModalContext → providers/ModalProvider

### Week 3

- [ ] Update all import statements across codebase
- [ ] Move data files (projects.ts, expertise.ts)
- [ ] Delete old empty folders
- [ ] Update git history (squash commits if needed)
- [ ] Test all functionality after refactoring

---

## Benefits After Refactoring

### ✅ Clearer Structure
- `_shared/` = anything used across app
- `components/` = feature-specific components
- `providers/` = all context/provider logic
- Clear separation of concerns

### ✅ Easier Navigation
- No more "SubComponents" files
- Semantic folder names
- Consistent barrel exports
- Tab completion works better with aliases

### ✅ Better Scalability
- Room to add components without restructuring
- Clear patterns for future developers
- Service calls isolated in `services/`
- Config centralized in one place

### ✅ Improved DX
- Path aliases avoid relative import hell (`../../../`)
- Barrel exports reduce import statements
- Consistent file organization
- Easier to find anything

### ✅ Reduced Errors
- ErrorBoundary catches component crashes
- Single provider entry point
- Type safety with error handling
- Clear data flow

---

## Potential Issues & Solutions

### Issue 1: Circular Dependencies
**Problem:** After moving files, circular imports appear
**Solution:** Add barrel exports to break cycles
```typescript
// ✗ Don't do this
import { Component } from '../Component';
import { helper } from './helper';  // helper imports from Component

// ✓ Do this
// Create index.ts that exports both
export { Component } from './Component';
export { helper } from './helper';
```

### Issue 2: Import Path Confusion
**Problem:** Mix of aliases and relative paths
**Solution:** Standardize: Use aliases for `_shared` and `providers`, relative for siblings in same component folder

### Issue 3: Breaking Changes
**Problem:** Third-party tools expect old structure
**Solution:** Check vite.config.ts, build pipeline, CI/CD scripts after changes

### Issue 4: Large Sub-Component Files
**Problem:** `HeroSubComponents.tsx` and `ExpertiseSubComponents.tsx` might be large
**Solution:** If >500 lines, split into separate files:
```
Instead of: HeroSubComponents.tsx (500 lines)
Use: HeroContent.tsx, HeroVisuals.tsx, HeroAnimations.tsx
```

---

## Git Strategy

### Commit Plan
```bash
# Commit 1: Folder structure + barrel exports
git commit -m "refactor: create _shared and providers folders with barrel exports"

# Commit 2: Move ErrorBoundary and RootProviders
git commit -m "feat: add ErrorBoundary and centralized RootProviders"

# Commit 3: Extract sub-components
git commit -m "refactor: extract ProjectCard and ContactForm components"

# Commit 4: Update all imports
git commit -m "refactor: standardize imports to use path aliases"

# Commit 5: Delete old folders
git commit -m "refactor: remove obsolete folder structure"
```

Or use interactive rebase to squash into logical chunks:
```bash
git rebase -i HEAD~5
```

---

## Timeline & Effort

| Phase | Task | Hours | Days |
|-------|------|-------|------|
| 1 | Create folder structure | 2 | 0.25 |
| 2 | Barrel exports | 1 | 0.1 |
| 3 | Extract components | 3 | 0.4 |
| 4 | Update imports | 2 | 0.25 |
| 5 | Error boundaries | 1.5 | 0.2 |
| 6 | Providers setup | 1 | 0.1 |
| 7 | Testing & cleanup | 2 | 0.25 |
| **Total** | | **12.5** | **1.6** |

**Actual time:** ~8-10 hours (accounting for breaks and adjustments)

---

## Recommended Execution

### Option A: Do It All At Once (Parallel with Critical Fixes)
- **Pro:** Get everything done together
- **Con:** Large PR, harder to review
- **Timeline:** Day 2-3 while critical fixes are being reviewed

### Option B: In Smaller Batches (After Critical Fixes Done)
- **Pro:** Smaller PRs, easier to review
- **Con:** Slower total time
- **Timeline:** Days 5-7

**Recommendation:** Option A if you have time, Option B if under time pressure

---

## Validation Checklist After Refactoring

- [ ] All imports resolve without errors (`npm run lint`)
- [ ] Build succeeds without warnings (`npm run build`)
- [ ] No unused imports after cleanup
- [ ] All components render in dev server
- [ ] Error Boundary catches errors in dev
- [ ] Hot module reload works with new structure
- [ ] Type checking passes (`tsc --noEmit`)
- [ ] No circular dependency warnings
- [ ] Git history is clean (no "undo" commits)

---

## Long-Term Improvements

After this refactoring, consider:

1. **Add Storybook** - Visualize UI components in isolation
2. **Add Tests** - Unit/integration tests for refactored components
3. **Add Prettier** - Auto-format code (pair with ESLint)
4. **Component Library** - Extract reusable components to `_shared/components/`
5. **Shared Hooks** - Document and standardize custom hooks
6. **API Client** - Wrap fetch calls in a proper client class

---

**Status:** Ready for implementation  
**Priority:** MEDIUM (can be done in parallel with critical fixes)  
**Impact:** High quality, maintainable codebase
