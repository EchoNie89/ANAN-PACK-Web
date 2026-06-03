# About Us Hero Dropdown Menu

## Summary

Redesign the `About Us` page hero section menu so it behaves and looks like the `Header` `About Us` dropdown pattern instead of a permanently visible three-link stack.

The change should apply to both desktop and mobile layouts while preserving the current page-section navigation behavior based on hash links.

## Current Context

- The About page entry lives at `packages/astro/src/pages/about-us.astro`.
- The hero section menu lives at `packages/astro/src/components/sections/about/AboutHero.astro`.
- The current hero menu is a static three-item block rendered directly in the hero:
  - `Our Story`
  - `Why Choose Us`
  - `Contact Us`
- Active state is currently synced in a small inline script by comparing `window.location.hash`, defaulting to `#our-story`.
- The site `Header` already defines the interaction and visual language the user wants to match:
  - desktop dropdown panels in `packages/astro/src/components/sections/Header.astro`
  - mobile collapsed `details/summary` navigation sections in the same file

## Goals

- Change the hero section menu to an `About Us` dropdown pattern consistent with the site header.
- Apply the updated pattern on both desktop and mobile.
- Preserve the existing section-link destinations and active hash syncing.
- Keep the change scoped to the About page hero menu only.

## Non-Goals

- No change to the actual site header navigation structure.
- No change to the destination anchors or section order.
- No refactor of other dropdown menus unless a tiny shared helper is clearly justified.
- No CMS or content-model work.

## Approved Direction

The approved direction is to reuse the `Header` `About Us` dropdown visual treatment, but keep the hero menu implemented as page-local section navigation.

This means:

- desktop should feel like a real dropdown panel anchored from an `About Us` trigger
- mobile should collapse into an `About Us` expandable block
- section items should still navigate with hash links on the same page
- the default active item should remain `Our Story` when no hash is present

## Alternatives Considered

### 1. Restyle the existing three-link stack only

This would be the cheapest implementation, but it would not actually match the requested dropdown behavior.

Rejected because the user explicitly asked for the header dropdown pattern.

### 2. Fully extract a shared global dropdown component

This would maximize reuse, but it broadens the change into shared header infrastructure and increases regression risk.

Rejected for now because the hero menu is page-local anchor navigation, not global navigation.

### 3. Recommended: local hero dropdown that mirrors header patterns

Keep the implementation inside `AboutHero.astro`, but model the desktop and mobile presentation after the header dropdown styles and interaction expectations.

Accepted because it matches the requested UX while keeping risk contained.

## UX Design

## Desktop

- Replace the always-visible right-side menu stack with a compact `About Us` trigger in the hero.
- Activating the trigger should reveal a white dropdown panel containing:
  - `Our Story`
  - `Why Choose Us`
  - `Contact Us`
- Menu item hover, active background, active text color, and panel surface should visually match the existing header dropdown treatment as closely as practical.
- The panel should remain clearly associated with the hero menu trigger rather than the sticky site header.

## Mobile

- Replace the current stacked links with a collapsed `About Us` block.
- Use a `details/summary` style interaction similar to the mobile header navigation.
- Expanded content should show the same three section links.
- The currently active item should still be visually distinguishable after expansion.

## Interaction Rules

- Clicking a menu item navigates to the corresponding page section hash.
- The current active item is derived from `window.location.hash`.
- When there is no hash, `#our-story` remains the implicit default active item.
- Desktop open/close behavior should be lightweight and local:
  - open on trigger click
  - close when clicking outside
  - close on `Escape`
  - close after selecting a menu item
- Mobile uses native `details/summary` behavior unless a small script adjustment is needed for active-state polish.

## Technical Design

## Files in Scope

Primary implementation target:

- `packages/astro/src/components/sections/about/AboutHero.astro`

Potential secondary scope only if needed for test updates:

- `packages/astro/tests/seo-foundation.test.mjs`

## Component Structure

`AboutHero.astro` should be reorganized so the section menu has two responsive variants:

- desktop dropdown trigger + panel
- mobile collapsible menu

Both variants should render from the same menu item data source to avoid label or href drift.

## State Handling

Keep the existing hash-sync concept, but extend the script so it can:

- sync active states across both desktop and mobile menu items
- track desktop open/closed state
- close the desktop panel on outside click and `Escape`

Do not introduce a framework dependency for this behavior.

## Styling Strategy

- Reuse the same utility classes and visual tokens already used by header dropdown links whenever possible.
- Keep styling local to `AboutHero.astro`.
- Avoid introducing new global CSS unless there is no practical utility-class alternative.

## Accessibility

- Desktop trigger must expose `aria-expanded`.
- Desktop dropdown relationship should use appropriate labeling or control attributes.
- Mobile `summary` must remain keyboard accessible.
- Focus styles should remain consistent with existing site controls.

## Testing Plan

Manual verification should cover:

1. `/about-us` shows an `About Us` trigger instead of the old permanent menu stack.
2. Desktop trigger opens a dropdown panel with the three expected section links.
3. Mobile layout shows a collapsed `About Us` control that expands correctly.
4. Clicking each menu item navigates to the correct section.
5. Active item styling updates correctly when the hash changes.
6. With no hash present, `Our Story` is treated as active.
7. Desktop dropdown closes on outside click and `Escape`.
8. The hero layout remains stable and readable across desktop and mobile.

## Acceptance Criteria

- The About page hero menu matches the requested header-style dropdown direction on both desktop and mobile.
- Existing anchor navigation still works for all three section links.
- Active-state syncing still defaults to `Our Story` when no hash is present.
- The change stays isolated to the About page hero menu and does not alter unrelated site navigation.
