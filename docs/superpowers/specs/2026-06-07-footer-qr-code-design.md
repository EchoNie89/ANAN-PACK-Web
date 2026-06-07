# Footer QR Code In Site Settings

## Goal

Move the footer QR code image out of the local Astro asset bundle and into Sanity so content editors can replace it from the existing `siteSettings` document.

## Scope

In scope:

- Add a Sanity-managed image field at `siteSettings.footerQrCode`
- Fetch that image through the existing site settings loader
- Render the footer QR code from Sanity when present
- Keep the current local QR code image as the runtime fallback when Sanity is empty or unavailable
- Add regression coverage for the schema, query, and footer rendering path

Out of scope:

- Moving the footer QR caption copy into Sanity
- Creating a separate footer settings document
- Refactoring unrelated footer content or layout
- Removing the local QR asset fallback

## Current State

The footer QR image is hardcoded in `packages/astro/src/components/sections/Footer.astro` via:

- `getLocalImage('/images/home/qr-code.png')`
- `LocalImage`

Shared site settings already exist for:

- `contactDetails`
- `socialMedia`

Those values are defined in Sanity at `packages/sanity/sanity/schemas/siteSettings.ts` and fetched by `packages/astro/src/lib/site-settings.ts`.

## Proposed Data Model

Extend the `siteSettings` schema with one new field:

- `footerQrCode`
  - type: `image`
  - title: `Footer QR Code`
  - description: editor-facing guidance that this image appears in the footer QR slot

No nested `footer` object is needed. The approved shape is a single top-level field:

- `siteSettings.footerQrCode`

## Astro Data Contract

Extend the site settings loader to include an optional Sanity image source:

- Add `footerQrCode?: SanityImageSource | null` to the document-side type
- Add `footerQrCode?: SanityImageSource | null` to the normalized site settings return type
- Query the image as:
  - `_type`
  - `asset`
  - `asset->metadata.dimensions`

This should reuse the existing `SanityImageSource` shape from `packages/astro/src/lib/sanity.ts` instead of inventing a footer-specific image type.

## Footer Rendering

Update `packages/astro/src/components/sections/Footer.astro` so the QR image resolves in this order:

1. `siteSettings.footerQrCode` from Sanity
2. Existing local asset `/images/home/qr-code.png`

Rendering rules:

- Keep the current layout, dimensions, background, and copy unchanged
- Keep the current alt text semantics focused on the QR code purpose
- Do not make the image optional at the UI layer; the local fallback keeps the slot populated

Implementation shape:

- Continue loading `contactDetails` and `socialMedia` from `getSiteSettings()`
- Also read `footerQrCode`
- If `footerQrCode` exists, render it from a Sanity image URL path
- Otherwise render the current `LocalImage` fallback

This is intentionally a small conditional branch in the footer instead of a broader footer abstraction rewrite.

## Failure Handling

If Sanity is unavailable or the document has no `footerQrCode`:

- `getSiteSettings()` continues to resolve successfully
- The footer still renders the current local QR image
- No empty state is introduced

This preserves the existing footer behavior while allowing CMS overrides.

## Tests

Extend `packages/astro/tests/site-settings.test.mjs` to cover:

- `siteSettings` schema defines `footerQrCode`
- The site settings query requests `footerQrCode` with Sanity image dimensions
- The footer consumes `footerQrCode` from `getSiteSettings()`
- The footer preserves the local QR asset as the fallback path

Tests should stay source-based, matching the current suite style, and should not require live Sanity access.

## Authoring Workflow

After implementation:

1. Open the `Site Settings` document in Sanity Studio
2. Upload the QR image into `Footer QR Code`
3. Publish the document
4. Confirm the footer renders the Sanity image instead of the local fallback

## Risks

- If the query shape does not include dimensions, responsive image handling becomes less predictable
- If the footer removes the local fallback, empty CMS state would create a broken slot
- If the implementation introduces a new type instead of reusing `SanityImageSource`, the site settings path will drift from the rest of the codebase

## Recommendation

Implement the smallest possible extension:

- one new schema field
- one query/type update
- one conditional render branch in the footer
- one regression test update

This keeps the change aligned with the current architecture and gives editors control over the QR image without broadening the CMS surface area unnecessarily.
