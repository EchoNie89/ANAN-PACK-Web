# Product Import Manifests

Product import manifests describe the Sanity-owned content extracted from Figma for product pages while keeping the Astro site responsible for presentation.

## Ownership

- Astro owns page structure, layout, responsive behavior, and Tailwind CSS implementation.
- Sanity owns selected product content:
  - Product Showcase groups and cards
  - Applications title, description, and cards
  - Image assets
  - Alt text
  - Card titles
  - Card descriptions

## Figma MCP Workflow

1. Select the product section in Figma and provide the selection link.
2. Codex reads the selection through Figma MCP.
3. Codex extracts visible business text from the selected product section.
4. Codex exports each image-bearing node or, when needed, a screenshot of the card image area.
5. Codex saves images under `sanity-studio/import-assets/products/<product-slug>/`.
6. Codex writes or updates the product import manifest.
7. Run the product import script in dry-run mode.
8. Run the real product import after reviewing the dry-run output.

## Source Keys

Use stable semantic `sourceKey` values. Do not use Figma layer names as source keys because layer names can change during design cleanup without changing the business meaning of the content.

## Import Behavior

The seed script updates images on every run. It preserves non-empty Sanity text by default, including titles, descriptions, and alt text. Pass `--force-text` only when the manifest text should overwrite existing non-empty Sanity text.
