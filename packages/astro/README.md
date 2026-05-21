# Astro Site

## Commands

Run all commands from `packages/astro`:

| Command | Action |
| :--- | :--- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start the Astro dev server at `http://localhost:4321` |
| `pnpm build` | Build the production site |
| `pnpm preview` | Preview the production build locally |

## Inquiry Form Setup

The `/contact-us` inquiry form submits directly to Formspree with the public form id from your environment.

1. Create `packages/astro/.env`.
2. Add your Formspree form id:

```dotenv
PUBLIC_FORMSPREE_FORM_ID=your_form_id_here
```

3. Start the site from `packages/astro`:

```sh
pnpm dev
```

If `PUBLIC_FORMSPREE_FORM_ID` is missing, the contact form stays on the page and shows a configuration error instead of a false success state.
