# Sanity Product Pages Migration

## Summary

Move the product detail page content source from local Astro data toward Sanity so that:

- existing product pages can be migrated without changing current content, images, or page structure
- newly created published products in Sanity automatically generate a product detail page
- newly created published products automatically appear in the desktop top Products dropdown
- the desktop top Products dropdown scrolls internally when the product count exceeds eight items

This is an incremental migration, not a full rewrite. During migration, the frontend should prefer Sanity data but keep local fallbacks for existing products until the migrated content is verified.

## Current Context

- Product pages are generated from `packages/astro/src/pages/products/[slug].astro`.
- The local source of truth today is `packages/astro/src/data/products.ts`.
- The main product page renderer is `packages/astro/src/components/sections/products/ProductPage.astro`.
- Some product modules are already partially Sanity-backed:
  - showcase groups
  - applications
  - customization groups
- The desktop Products dropdown is still local-data driven through `packages/astro/src/components/sections/ProductsMegaMenu.astro`.
- The existing Sanity product schema already supports a subset of product content under `packages/sanity/sanity/schemas/product.ts`.

## Goals

- Manage product detail page content in Sanity for the approved modules.
- Preserve the current page output for existing migrated products.
- Upload migrated module images to Sanity instead of relying only on local asset paths.
- Generate product pages from published Sanity products.
- Populate the desktop Products dropdown from published Sanity products.
- Keep new products append-only in menu order by creation time.
- Support internal scrolling for the desktop dropdown when more than eight products exist.

## Non-Goals

- No migration of the home page Products section.
- No Sanity management for `Why Choose Us` at this stage.
- No custom manual product ordering UI in Sanity.
- No mobile menu redesign or custom scroll treatment beyond current behavior.
- No broad restructuring of all product page components.
- No CMS-driven styling controls for hero alignment, overlays, or other visual-only presentation knobs.

## Approved Scope

The user approved the following scope and constraints:

- Existing products should be migrated into Sanity in batch.
- Existing local content must be preserved exactly during migration.
- A local baseline document must be generated before migration and used for later comparison.
- Images for newly migrated modules should be uploaded into Sanity.
- Product detail pages and the desktop top Products dropdown should only show published Sanity products.
- During migration, the frontend should use a double-track approach:
  - prefer Sanity data
  - fall back to local product data when needed for existing products
- New products created in Sanity should use Sanity for:
  - hero
  - what are custom
  - case study
  - faq
  - showcase
  - applications
  - customization
- New products should keep non-migrated sections on current shared defaults.
- Product names should be used for menu labels.
- Product slugs should be generated automatically from product names rather than manually maintained by editors.
- Products in the desktop top dropdown should be ordered by creation time, with newer products appended to the end.

## Recommended Approach

Use an incremental extension of the existing Sanity product document and Astro product rendering flow.

This approach is preferred because the project already has partial product integration with Sanity. Extending the current schema and data-fetch layer keeps the migration surface small, allows controlled validation against current local content, and avoids a risky cutover where one import mistake would immediately break production page output.

The migration should proceed in this order:

1. export a local baseline document from current product data
2. extend the existing Sanity product schema to match approved module structures
3. batch-import existing products and upload related images to Sanity
4. compare imported Sanity data against the local baseline
5. update Astro to read product lists and product page sections from Sanity first, with local fallback for existing products
6. switch the desktop Products dropdown to Sanity-backed published products with internal scrolling when needed

## Data Model Design

### Product Document

Keep a single `product` document type in Sanity and extend it. Do not introduce a second product content type.

### Required Base Fields

- `name`
  - product display name
  - used in the desktop Products dropdown
- `slug`
  - auto-generated from `name`
  - stored in Sanity for route and query stability
  - not manually maintained by editors
- `pageTitle`
  - product page main title
- `seoTitle`
  - browser title and SEO title
- `metaDescription`
  - search result summary copy

Published state should continue to be controlled by Sanity's document publish flow rather than a separate custom boolean.

### Hero Fields

Only the following hero fields should be managed in Sanity:

- `title`
- `description`
- `image`

The following current local presentation controls remain frontend-owned and should not move into Sanity:

- `heroTone`
- `heroAlign`
- `heroOverlay`
- `heroButtonPlacement`
- `heroTitleLines`

### What Are Custom Fields

The current local data shape should be preserved conceptually:

- `title` optional
  - if absent, the frontend should continue generating `What Are Custom ${name}?`
- `overview`

No image field is needed for this section.

### Case Study Fields

This section should follow the current local structure closely to reduce migration loss:

- `title`
- `description`
- `image`
- `bullets[]`
- `quote` optional
- `quoteAuthor` optional
- `challenge` optional
- `solutionIntro` optional
- `solutionPoints[]` optional
- `resultPoints[]`
- `gallery[]` optional

### FAQ Fields

The FAQ section only needs:

- `items[]`
  - `question`
  - `answer`

The section title remains fixed in the frontend and should not be stored in Sanity.

### Existing Sanity-Backed Product Fields

Continue to use the current Sanity-backed areas for:

- `showcaseGroups`
- `applications`
- `customizationGroups`

Where these fields already exist, preserve their current structure rather than redesigning them during this migration.

### Non-Migrated Shared Sections

These remain driven by current shared local defaults:

- `Why Choose Us`
- other shared product-page sections that the user did not include in this migration

For newly created Sanity products, these sections should continue rendering from the shared frontend defaults without requiring CMS data entry.

## Migration Design

### Phase 1: Local Baseline Export

Generate a baseline artifact from current local product data before any Sanity migration work begins.

The baseline should capture, per product:

- `name`
- `slug`
- effective page title values
- effective SEO title values
- `metaDescription`
- hero text and image path
- what-are-custom text values
- full case study text fields
- case study image paths
- faq items
- current data-source notes for showcase, applications, and customization
- notes for sections still driven by shared defaults

This artifact is a migration control document, not editorial content. Its job is to make regressions and import mismatches visible.

### Phase 2: Batch Import Into Sanity

Use a script-based batch import rather than manual entry.

The import should:

- create or update one Sanity product document per current local product
- auto-generate slug values from product names
- populate approved content fields
- upload and attach:
  - hero images
  - case study main images
  - case study gallery images
  - images for approved migrated modules that still live only in local assets
- preserve existing compatible Sanity data for showcase, applications, and customization when already present

### Phase 3: Post-Import Comparison

Do not switch frontend behavior immediately after import.

Instead, export the resulting Sanity product data and compare it against the local baseline at field level:

- product count
- product identity fields
- text field equality
- image presence and counts
- expected empty or optional field handling

Any unresolved differences must be corrected before the frontend starts treating Sanity as the primary source for that content.

### Phase 4: Frontend Preference Shift

Once comparison passes, change the frontend to:

- read published products from Sanity for listing and route generation
- hydrate approved content modules from Sanity
- fall back to local data only for legacy migration gaps on existing products

This order minimizes the risk that a bad import immediately changes visible output.

## Frontend Design

### Product Detail Page Assembly

The runtime product page object should remain close to the current `ProductPageData` shape so existing section components can be reused.

At render time, product page data should be composed from:

- Sanity-managed product fields for migrated modules
- current shared frontend defaults for non-migrated modules
- local fallback data for existing products when Sanity content is absent during migration

### Product List Source

The published Sanity product collection should become the primary source for:

- static route generation
- desktop Products dropdown entries

Unpublished products should not generate pages and should not appear in the menu.

### Slug Handling

Although editors will not manually manage slug values, the system should still persist slugs in Sanity because:

- Astro routes need stable path keys
- Sanity queries need stable identifiers
- future name changes should not create ambiguous behavior

### New Product Behavior

For a newly created and published product in Sanity:

- a product detail page should be generated automatically
- the product should appear automatically in the desktop Products dropdown
- the page should read these sections from Sanity:
  - hero
  - what are custom
  - case study
  - faq
  - showcase
  - applications
  - customization
- non-migrated sections should continue using existing shared defaults

No local code edit should be required to add the new product page.

## Desktop Products Dropdown Design

The desktop top Products dropdown should become Sanity-backed and keep current menu semantics wherever possible.

Rules:

- use published Sanity products only
- use `name` as the menu label
- order products by creation time ascending
- append newly created products to the bottom of the list

Behavior:

- if product count is eight or fewer, render the dropdown normally
- if product count exceeds eight, the dropdown panel should scroll internally
- only the desktop dropdown panel should scroll
- the page body should not become the primary scroll target for this behavior

Mobile behavior should remain unchanged. The mobile expanded list can continue flowing naturally below without additional scroll treatment.

## Error Handling And Fallbacks

- Existing migrated products with missing Sanity fields during rollout should fall back to local content where available.
- Newly created Sanity-only products should render the minimum valid page structure from Sanity plus shared defaults. If a required Sanity field is missing, the system should fail in a controlled way rather than rendering corrupt content silently.
- Unpublished Sanity products should never enter the site or the menu.
- Duplicate or conflicting slug generation should be blocked or surfaced clearly in the CMS workflow.
- Sanity query failures should not cause avoidable full-site breakage when local fallback is available for existing products.

## Testing And Verification Strategy

### Data Verification

Verify that:

- every current product is present in Sanity
- base fields match the local baseline
- hero, what-are-custom, case-study, and faq content match exactly
- migrated images are uploaded and attached correctly
- existing showcase, applications, and customization content remains intact

### Frontend Verification

Verify that:

- current product URLs remain correct
- current product content still renders as before
- migrated modules prefer Sanity content
- non-migrated modules still render from shared defaults
- old products do not break if a migrated Sanity field is temporarily absent

Coverage should include at least:

- one product with a complex case study
- one product with multiple case study gallery images
- one product with a long FAQ section

### New Product Flow Verification

Create a test product in Sanity and confirm that, after publish:

- the page is generated
- the product appears in the desktop Products dropdown
- Sanity-backed modules render correctly
- no local code addition is required

### Dropdown Verification

Verify the desktop dropdown with:

- 8 products
- 9 products
- 10 products

Confirm:

- internal dropdown scrolling only starts above 8
- all items remain reachable and clickable
- newly created products appear at the bottom

### Fallback Verification

Verify that:

- existing products still render via fallback when Sanity data is incomplete
- unpublished products do not appear
- slug conflicts are caught
- temporary Sanity read failures do not cause avoidable breakage for legacy pages

## Acceptance Criteria

- A baseline document exists for the current local product content before migration.
- Existing products are imported into Sanity with approved text fields and images.
- Approved product modules render from Sanity for published products.
- Existing products can continue rendering correctly through local fallback during migration.
- New published Sanity products generate product detail pages without local code changes.
- The desktop top Products dropdown is driven by published Sanity products.
- Desktop dropdown internal scrolling activates when the product count exceeds eight items.
- Mobile product menu behavior remains unchanged.
- Current product page content and imagery remain consistent with the pre-migration pages after migration.
