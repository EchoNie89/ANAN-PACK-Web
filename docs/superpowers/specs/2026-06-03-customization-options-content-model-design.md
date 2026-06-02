# Customization Options Content Model

## Summary

Redesign the `Customization Options` content model so editors can express the different copy forms already used across product pages without forcing everything into a single `title + items[]` list.

The approved direction is:

- preserve the existing outer section structure
- keep the model editor-friendly
- support original presentation intent rather than normalizing all content into one frontend format
- use a small set of block types instead of freeform rich text or many one-off schemas

## Current Context

- `packages/astro/src/components/sections/products/ProductCustomization.astro` currently renders each group as:
  - group title
  - optional image grid
  - optional intro paragraph
  - repeated blocks rendered as `<h4> + <ul><li>`
- `packages/sanity/sanity/schemas/customizationGroup.ts` currently stores:
  - `title`
  - `intro`
  - `images`
  - `blocks`
- `packages/sanity/sanity/schemas/customizationBlock.ts` currently only supports:
  - `title`
  - `items[]`

This shape is too limited for current real content. Existing product content already includes multiple forms:

- numbered entries such as `1. Eco-Friendly Paper & Kraft`
- bullet lists
- entries with no title
- titled subgroups like `Features`, `Best For`, and `Best Applications`
- lists followed by a concluding sentence
- sections that are only a paragraph
- complex entry-by-entry explanations under one section

## Goals

- Support all currently observed `Customization Options` copy patterns.
- Let editors explicitly control bullets, numbering, or plain text display.
- Let editors omit titles where content does not need them.
- Support list groups followed by a concluding sentence.
- Keep the outer section model stable so migration stays incremental.
- Keep the number of content block types small and predictable.

## Non-Goals

- No freeform rich text editor for this module.
- No schema explosion where each visual pattern gets its own object type.
- No attempt to redesign other product page modules in the same change.
- No CMS controls for typography, spacing, colors, or other purely visual styling.

## Approved Scope

The user approved these priorities and constraints:

- highest priority is coverage of existing content forms
- the backend should be able to express different forms close to their original intent
- the solution should become the stable final recommendation for this module

## Alternatives Considered

### 1. Freeform rich text

This would support every case, but it would shift too much formatting responsibility onto editors and make frontend rendering less predictable.

Rejected because it is too loose for a repeated product-page module.

### 2. Many dedicated schema types

This would create separate types for every visible pattern, such as numbered blocks, bullet blocks, features blocks, best-for blocks, specs blocks, and so on.

Rejected because the editor experience would become confusing and the model would keep growing as new variations appear.

### 3. Recommended: small block set with explicit marker controls

Keep the existing group shell, but upgrade `blocks` into a union of a few reusable block types. Each block type expresses content intent, and marker style is stored as data rather than embedded inside strings.

Accepted because it balances coverage, clarity, and implementation cost.

## Final Data Model

Keep the existing group-level shell:

```ts
type CustomizationGroup = {
  title: string;
  intro?: string;
  images?: CustomizationImage[];
  blocks: CustomizationBlock[];
};
```

`blocks` becomes a union of three block types.

### 1. Paragraph Block

Use when a section needs a standalone paragraph and no list structure.

```ts
type ParagraphBlock = {
  _type: "paragraphBlock";
  text: string;
};
```

Use cases:

- a short introduction below the images
- a standalone explanatory paragraph between lists
- a concluding paragraph that should not be rendered as a list item

### 2. List Block

Use when the content is one list, optionally with a title and optionally followed by one concluding sentence.

```ts
type ListBlock = {
  _type: "listBlock";
  title?: string;
  markerStyle: "bullet" | "number" | "plain";
  items: string[];
  note?: string;
};
```

Use cases:

- bullet list
- numbered list
- plain stacked text items with no visible marker
- `Best Applications` style content with a list and a final explanatory sentence

### 3. Entry List Block

Use when the section contains repeated entries, each with its own title and supporting content.

```ts
type EntryListBlock = {
  _type: "entryListBlock";
  title?: string;
  markerStyle: "bullet" | "number" | "plain";
  entries: CustomizationEntry[];
};
```

Each entry is:

```ts
type CustomizationEntry = {
  title?: string;
  paragraphs?: string[];
  detailGroups?: CustomizationDetailGroup[];
  note?: string;
};
```

Each detail group is:

```ts
type CustomizationDetailGroup = {
  label?: string;
  markerStyle: "bullet" | "number" | "plain";
  items: string[];
  note?: string;
};
```

Use cases:

- `1. Eco-Friendly Paper & Kraft` plus explanation
- `Features` and `Best For` under one entry
- content that has a small title, multiple supporting paragraphs, and one or more grouped lists
- content where some entries are simple and others are more detailed

## Field Semantics

### `markerStyle`

`markerStyle` controls presentation intent and replaces hardcoded prefixes inside content strings.

- `bullet`
  - render a bulleted list
- `number`
  - render an ordered list
- `plain`
  - render stacked items with no visible marker

Editors should not manually type `1.` or `•` into the text when the marker is part of the list structure.

### `title`

Titles are optional at block and entry level because current content includes both titled and untitled patterns.

### `note`

`note` is for the common pattern where a list is followed by one concluding sentence that should stay visually attached to that list, but should not become another list item.

This field is needed both on:

- `ListBlock`
- `CustomizationDetailGroup`

It is also allowed on `CustomizationEntry` for entry-level closing remarks.

### `paragraphs`

`paragraphs` supports entries that need more than one explanatory sentence without forcing those sentences into list items.

## Validation Rules

The schema and runtime types should enforce these minimum content rules:

- `CustomizationGroup.blocks` must contain at least one block
- `ParagraphBlock.text` must be non-empty
- `ListBlock.items` must contain at least one item
- `EntryListBlock.entries` must contain at least one entry
- each `CustomizationDetailGroup.items` must contain at least one item
- each `CustomizationEntry` must contain at least one of:
  - `title`
  - `paragraphs`
  - `detailGroups`
  - `note`

Optional fields remain optional, but empty placeholder objects should not be allowed.

## Editor Mental Model

Editors should only need to understand three content blocks:

- `Paragraph`
- `List`
- `Entry List`

And one display control:

- `Marker Style`
  - bullet
  - number
  - plain

This keeps the backend understandable while still covering the observed content formats.

## Rendering Design

### Group Rendering

The outer rendering pattern remains the same:

1. section heading
2. optional image grid
3. optional group intro
4. content blocks rendered in order

This preserves the current page layout and limits the change surface.

### Block Rendering

- `paragraphBlock`
  - render as paragraph text
- `listBlock`
  - render optional block title
  - render list according to `markerStyle`
  - render `note` as a paragraph directly below the list if present
- `entryListBlock`
  - render optional block title
  - render entries according to the block `markerStyle`
  - within each entry:
    - render optional entry title
    - render zero or more paragraphs
    - render zero or more detail groups
    - render optional entry note

### Presentation Rules

- numbering must come from structured list rendering, not hardcoded text prefixes
- bullet, number, and plain rendering should share one visual system so entries feel consistent
- missing optional titles should not leave empty spacing placeholders
- `note` content should always render as body text, not as a list item

## Migration Strategy

This should be introduced incrementally.

### Schema Migration

- keep `customizationGroup`
- keep the `blocks` field name
- replace the current single `customizationBlock` object shape with a union of:
  - `paragraphBlock`
  - `listBlock`
  - `entryListBlock`

Keeping the `blocks` field name reduces migration churn in the surrounding group structure and frontend props.

### Content Migration

Map existing content into the new structure using the simplest matching block:

- pure list content becomes `listBlock`
- entry-by-entry content becomes `entryListBlock`
- loose explanatory text becomes `paragraphBlock`

Any existing hardcoded numbering or bullet prefixes should be removed during migration when they are represented by `markerStyle`.

### Frontend Compatibility

The renderer should support the new block union. If a temporary compatibility path is needed during rollout, it should translate legacy `title + items[]` content into `listBlock` at the data layer rather than duplicating rendering logic deep in the component.

## Validation and Testing

The implementation plan should include coverage for these cases:

- list block with title and bullets
- list block with numbering
- list block with no title
- list block with trailing `note`
- entry list block with numbered entries
- entry with title and one paragraph
- entry with no title
- entry with multiple detail groups
- detail group with `note`
- paragraph block between other blocks
- mixed block ordering inside one group

Testing should verify both:

- schema typing and data normalization
- frontend rendering behavior for each supported structure

## Explicitly Rejected Additions

The final recommendation intentionally does not add:

- a dedicated `featuresBlock`
- a dedicated `bestForBlock`
- a dedicated `bestApplicationsBlock`
- a dedicated `specsBlock`
- a general-purpose rich text block

Those patterns are expected to fit inside the approved block model through `title`, `detailGroups`, `markerStyle`, and `note`.

## Recommended Next Step

The next step after approval of this spec is to create an implementation plan for:

1. Sanity schema updates
2. Astro runtime type updates
3. data normalization and optional legacy compatibility
4. `ProductCustomization` rendering changes
5. migration of one representative product page as a reference sample
