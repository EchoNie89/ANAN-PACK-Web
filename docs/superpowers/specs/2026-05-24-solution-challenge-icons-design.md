# Solution Challenge Icons Redesign

## Summary

Replace the four icons used in the second module of every solution detail page so they match the approved Figma visual direction more closely. This is a controlled visual refresh only. The work should update the line-art icon shapes while keeping the current data mapping, card structure, copy, spacing, and circular icon container unchanged.

## Current Context

- The solution detail pages are rendered from shared Astro components under `packages/astro/src/components/sections/solutions`.
- The second module is implemented in `packages/astro/src/components/sections/solutions/SolutionChallenges.astro`.
- The icon artwork is currently defined inline in `packages/astro/src/components/ui/SolutionLineIcon.astro`.
- The icon names consumed by each page are stored in `packages/astro/src/data/solutions.ts`.
- Multiple solution pages reuse the same `SolutionLineIcon` component, so updating the shared icon definitions will propagate site-wide.

## Goals

- Replace the visual design of the four challenge icons in the shared solution challenges module.
- Apply the updated icon set across all solution detail pages automatically.
- Keep the existing icon keys and data wiring intact.
- Match the approved Figma direction closely enough that the module reads as the new design rather than the current generic line icon set.

## Non-Goals

- No changes to challenge titles or descriptions.
- No changes to card count, order, spacing, typography, or responsive layout.
- No changes to the circular white icon background or its shadow treatment.
- No conversion to external SVG assets or a new icon delivery system.
- No changes to other icon systems elsewhere on the site.

## Approved Scope

The user approved the following boundaries:

- Update all solution detail pages, not just the cosmetics page.
- Keep the existing module layout and copy exactly as-is.
- Implement the change by directly editing the shared inline SVG definitions in `SolutionLineIcon.astro`.

## Recommended Approach

Update the shared inline SVG paths for the four icon variants already used by the solution challenges data:

- `stack`
- `sample`
- `refresh`
- `chat`

Do not change the icon names or add page-specific overrides. The current architecture already has the correct reuse boundary: one shared icon component feeding one shared section pattern used by multiple pages. Replacing the SVG path definitions inside that component gives the smallest possible change surface while preserving the site's existing data model.

## Visual Design Direction

The updated icons should follow the approved Figma direction:

- `stack`: layered horizontal cards rather than the current boxed list treatment
- `sample`: a compact logistics-style box/truck mark with a currency/check-style precision signal
- `refresh`: a more open circular alignment mark with cleaner calibration motion
- `chat`: overlapping speech bubbles rather than the current single chat box

The exact vector path data may be adapted to fit the current implementation constraints, but the result should remain recognizably aligned to the Figma artwork.

## Technical Design

### Files In Scope

Primary implementation file:

- `packages/astro/src/components/ui/SolutionLineIcon.astro`

Read-only context files:

- `packages/astro/src/components/sections/solutions/SolutionChallenges.astro`
- `packages/astro/src/data/solutions.ts`

Test file to add:

- `packages/astro/tests/solution-line-icon.test.mjs`

### Component Strategy

Keep `SolutionLineIcon.astro` as a single inline SVG component with conditional branches per icon key. The component already provides a stable public interface:

- input: `icon: SolutionIconName`
- output: inline SVG sized to the current circular container

Only the path definitions for the four approved variants should change. The component wrapper, shared `viewBox`, shared stroke configuration, and class wiring should remain stable unless a minimal adjustment is required for visual fidelity.

### Data Strategy

Do not modify the `SolutionIconName` union or the icon assignments in `solutions.ts`.

That means the existing page-to-icon mapping stays:

- solution challenge content remains unchanged
- icon names remain unchanged
- all solution pages receive the new icon visuals automatically through the shared component

### Testing Strategy

Add a focused source-level test for `SolutionLineIcon.astro`.

The test should:

- read the icon component source
- assert that the four icon branches still exist
- assert that each of the four updated icons contains one or more new path signatures that distinguish the redesigned SVGs from the old ones

This is intentionally a small regression guard, not a rendering snapshot system. The goal is to lock the approved icon change in place without introducing unnecessary testing complexity.

## Risks And Constraints

- The Figma screenshot is a visual reference, not a directly exported SVG set, so the inline paths will need to be interpreted rather than copied mechanically.
- The existing `48x48` SVG view box and icon container size constrain how closely the artwork can mirror the Figma composition.
- Because the same component is shared across all solution pages, any mistake in the icon component affects every solution detail page at once. The change should therefore stay narrow and test-backed.

## Verification Plan

Implementation verification should cover:

1. the new icon regression test failing before the icon update
2. the same test passing after the SVG paths are replaced
3. the existing Astro test suite continuing to pass
4. a manual visual check of at least one solution page to confirm the module layout remains unchanged while the icons match the new direction

## Acceptance Criteria

- All solution detail pages use the redesigned challenge icons.
- The second module layout, copy, and circular icon container remain unchanged.
- `solutions.ts` icon keys and page content remain untouched.
- The inline icon component is the only production code path changed for the visual refresh.
- A regression test exists to guard the new icon definitions from accidental rollback.
