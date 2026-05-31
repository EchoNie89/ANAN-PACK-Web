# Home Trusted By Logos Update

## Summary

Append two new partner logos to the home page `Trusted By` marquee. Use the supplied `TWELVElittle` source as-is because it is already a WebP image, and convert the supplied `Sanrio` PNG source into WebP before adding it. Keep the change limited to the existing home page logo asset pipeline and the `logos` array order.

## Current Context

- The home page `Trusted By` section is implemented in `packages/astro/src/components/sections/TrustReasons.astro`.
- The marquee content is driven by the `logos` array in `packages/astro/src/data/home.ts`.
- Home page images are resolved through `getLocalImage()` from `packages/astro/src/lib/local-images.ts`, which reads from `packages/astro/src/assets/**`.
- The current `logos` array contains eight entries and the component duplicates that array to create the marquee loop.

## Goals

- Add `TWELVElittle` and `Sanrio` to the end of the home page `Trusted By` logos list.
- Ensure the newly added `Sanrio` asset is stored as WebP.
- Keep the existing marquee layout, animation, sizing, spacing, and duplication behavior unchanged.

## Non-Goals

- No redesign of the `Trusted By` section.
- No changes to the existing eight logo assets.
- No refactor of the marquee component or image loading helper.
- No changes to any non-home-page logo usage.

## Approved Scope

The user approved these boundaries:

- Append the two new logos directly to the end of the existing `logos` array.
- Use the minimal-change approach: keep existing assets untouched, but convert the new `Sanrio` image to WebP for consistency with the new additions.

## Recommended Approach

Copy the provided `TWELVElittle` WebP file into `packages/astro/src/assets/home` with a repo-friendly name. Convert the provided `Sanrio` PNG into a WebP asset and place the converted file in the same directory. Then append both file names to the `logos` array in `packages/astro/src/data/home.ts`.

This approach works with the current Astro image loading flow without any component changes, because `homeImage()` already maps `/images/home/<file>` paths onto assets stored under `src/assets/home`.

## Technical Design

### Files In Scope

Production files:

- `packages/astro/src/assets/home/logo-10-twelvelittle.webp`
- `packages/astro/src/assets/home/logo-11-sanrio.webp`
- `packages/astro/src/data/home.ts`

Test file:

- `packages/astro/tests/motion-foundation.test.mjs`

### Asset Strategy

- Add one new WebP asset for `TWELVElittle`.
- Add one converted WebP asset for `Sanrio`.
- Use stable lowercase kebab-case file names so the assets match the existing home asset naming style.

### Data Strategy

Append two new `homeImage(...)` entries to the `logos` array in this order:

1. `TWELVElittle`
2. `Sanrio`

Nothing else in `home.ts` should change.

### Testing Strategy

Add a focused regression assertion in `packages/astro/tests/motion-foundation.test.mjs` that proves the `logos` array includes the two new WebP asset names. Follow TDD:

1. write the failing assertion first
2. run the targeted test to verify it fails for the expected reason
3. add the assets and array entries
4. rerun the targeted test and then the broader Astro test command

## Risks And Constraints

- The supplied logo source files live outside the repository, so the implementation must copy or convert them into tracked repo assets.
- Logo aspect ratios vary, so the existing marquee tile and `object-contain` behavior must remain unchanged to avoid layout churn.
- Because the marquee duplicates the array for scrolling, every added logo increases both the visible and duplicated track length; the current implementation should absorb this without code changes.

## Verification Plan

Implementation verification should include:

1. a failing targeted test before production edits
2. the same targeted test passing after the new assets and `logos` entries are added
3. the existing Astro test suite still passing
4. a quick visual check of the home page marquee to confirm both new logos appear and the layout remains stable

## Acceptance Criteria

- The `Trusted By` section on the home page shows two additional logos at the end of the existing sequence.
- The new `TWELVElittle` asset is stored as WebP in the repo.
- The new `Sanrio` asset is converted from PNG to WebP before being stored in the repo.
- The marquee component code and visual structure remain unchanged.
- A regression test exists to guard the two new logo entries.
