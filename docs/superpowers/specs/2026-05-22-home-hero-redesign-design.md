# Home Hero Redesign

## Summary

Redesign the Home page hero to match the approved Figma direction for both presentation and content. This is not a cosmetic tweak. The hero should be rebuilt so the visual hierarchy, copy, spacing, overlay treatment, button styling, and responsive behavior all align with the design while still fitting the site's existing Astro and Tailwind component system.

## Current Context

- The Home page entry lives at `packages/astro/src/pages/home.astro`.
- The current hero implementation lives at `packages/astro/src/components/sections/Hero.astro`.
- `/` redirects to `/home`, so the work should target the `/home` hero only.
- The current hero already uses the site's image, button, container, and font stack.
- The project already defines the required visual foundations in `packages/astro/src/styles/global.css`:
  - `--font-display` for Montserrat-based headings
  - `--font-sans` for Inter-based body copy
  - brand warm neutrals and existing button radii

## Goals

- Match the approved Figma hero layout and content direction on the Home page.
- Update the hero copy to the Figma version.
- Rebuild the visual hierarchy so the eyebrow, headline, description, and CTA row read like the design.
- Rework the overlay and image presentation so the product image remains visible on the right while the text stays readable on the left.
- Fix responsive issues instead of scaling the desktop layout down mechanically.
- Preserve the existing CTA destinations:
  - `Request a Quote` -> `/contact-us#project-form`
  - `Explore Solutions` -> `#solutions`

## Non-Goals

- No changes to the site header.
- No changes to sections below the hero.
- No CMS work or new content model.
- No new animation system, video background, or carousel.
- No global button redesign outside the hero unless a small local adjustment is required for fidelity.

## Approved Content

### Eyebrow

`PACKAGING & TRIMS SOURCING PARTNER`

### Headline

`One-Stop Packaging & Trims Supply Chain Partner For Fashion, Home Textile, And Lifestyle Brands.`

The implementation should preserve the design's intentional multi-line headline treatment instead of leaving line breaks entirely to chance.

### Body Copy

`From hang tags and woven labels to bags, stickers, and tissue paper, we coordinate sourcing, development, sampling, and quality control for your brand.`

### CTA Labels

- `REQUEST A QUOTE`
- `EXPLORE SOLUTIONS`

## Recommended Approach

Keep the current `Hero.astro` entry point, but rebuild the component structure internally around clearly separated layers:

1. background image layer
2. gradient overlay layer
3. content column
4. CTA row

Within the component, move hero copy into local constants or a small structured object so the layout is easier to reason about and future hero adjustments do not require editing long inline text blocks inside markup.

This keeps the homepage wiring stable while making the hero itself deliberate instead of patch-like.

## Visual Design

### Overall Composition

- Keep a full-width image hero.
- Maintain a left-aligned content block and right-emphasized product imagery.
- Use a softer, warmer presentation than the current heavy dark overlay.
- Set the section height and top/bottom padding deliberately rather than relying on a single `min-h` value.

### Overlay

- Replace the current heavier black overlay with a softer left-to-right diagonal gradient.
- The left side should provide enough contrast for white text.
- The right side should remain bright enough to preserve product visibility and premium detail.
- The overlay should feel warm and atmospheric, not cold or opaque.

### Typography

- Eyebrow should read as a compact all-caps label with stronger tracking and lighter visual weight than the headline.
- Headline should use the display font and feel substantially larger and bolder than the current implementation.
- Description should be narrower and calmer than the headline, with readable line-height and less visual spread.
- Desktop line breaks should be guided to match the design intent closely.

### CTA Treatment

- Keep two side-by-side CTAs on larger screens.
- Buttons should be shorter, rounder, and visually closer to the Figma styling than the current generic section CTA look.
- Primary and secondary CTAs may share the same warm brand family if that is needed to stay faithful to the approved design.
- On small screens, buttons may stack if horizontal compression would damage readability or tap targets.

## Responsive Design

The Figma node is a desktop composition, so mobile behavior must be interpreted rather than copied directly.

### Desktop

- Hero should align closely to the Figma composition.
- Content block should sit higher than it does today.
- Headline, copy, and buttons should maintain a clear vertical rhythm.

### Tablet

- Keep left-aligned copy.
- Reduce headline width and font size before allowing awkward wrapping.
- Preserve image visibility on the right as long as possible.

### Mobile

- Prioritize legibility over exact desktop composition.
- Reduce headline size and line-length significantly.
- Rebalance overlay density so the text remains readable without crushing the image.
- Allow CTA stacking when needed.
- Avoid cropped layouts where the content feels vertically trapped.

## Technical Design

### Files in Scope

Primary implementation target:

- `packages/astro/src/components/sections/Hero.astro`

Potential supporting files only if strictly necessary:

- `packages/astro/src/components/ui/Button.astro`
- `packages/astro/src/data/home.ts`

The default path should be to keep this redesign self-contained in `Hero.astro`.

### Component Structure

The hero component should be reorganized into explicit logical regions:

- image source setup
- copy data setup
- background media
- overlay
- content wrapper
- text group
- CTA group

This should improve readability without introducing a broader abstraction layer for unrelated pages.

### Copy Handling

Do not leave the new hero copy as an unstructured block of inline text only.

Use either:

- top-level constants, or
- a small `heroContent` object

This makes future updates safer, especially for controlled desktop line breaks.

### Styling Strategy

- Reuse existing project tokens, fonts, spacing scale, and radii wherever possible.
- Add only local utility classes or local class combinations needed for fidelity.
- Avoid introducing one-off global CSS unless Astro or Tailwind utility composition genuinely cannot express the layout.

## Problem Fixes Included In Scope

This redesign must fix the current hero's practical issues in addition to matching the Figma direction:

- headline hierarchy is too weak relative to the desired design
- content sits too low in the section
- overlay is too dark and flattens the right-side product imagery
- description width is too loose
- buttons feel generic rather than hero-specific
- mobile layout risks oversized headline wrapping and cramped CTA presentation

## Testing Plan

Manual verification should cover:

1. `/home` loads the redesigned hero with the new eyebrow, headline, description, and CTA labels.
2. `Request a Quote` still links to `/contact-us#project-form`.
3. `Explore Solutions` still links to `#solutions`.
4. Desktop layout preserves the intended left-text/right-image balance.
5. Tablet layout does not produce awkward headline wrapping or CTA collisions.
6. Mobile layout remains readable, with acceptable image crop and usable button sizing.
7. Text contrast remains strong enough across the overlay.
8. The change does not regress the rest of the Home page layout.

## Acceptance Criteria

- The Home hero visually aligns with the approved Figma direction instead of the previous generic overlay layout.
- The hero copy is updated to the approved content.
- CTA behavior is unchanged in destination.
- The hero behaves intentionally across desktop, tablet, and mobile.
- The implementation stays within the existing Astro site patterns and does not trigger unrelated refactors.
