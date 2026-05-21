# Formspree Inquiry Form Design

## Summary

Integrate Formspree as the direct frontend submission target for the existing contact inquiry form on the Astro site. The contact form will remain on `/contact-us` and keep its current six fields. After a successful submission, the form area will be replaced in place with a success card instead of redirecting away from the page.

## Current Context

- The site is an Astro application under `packages/astro`.
- The inquiry UI lives in `packages/astro/src/components/sections/contact/ContactProjectForm.astro`.
- The contact page lives in `packages/astro/src/pages/contact-us.astro`.
- The current form is static markup only. It has no `action`, no field `name` attributes, no submit handler, and no success or error states.
- Other pages already route inquiry intent to `/contact-us` or `/contact-us#project-form`, so this work only needs to cover the contact page form.

## Goals

- Submit the existing inquiry form directly to Formspree from the browser.
- Keep the existing six fields only:
  - Name
  - Company Name
  - Email
  - WhatsApp / Phone
  - Country / Region
  - Project Details / Message
- Show a success state on the same page after submission.
- Replace the form area with a success card after a successful submission.
- Keep the right-hand contact information and next-steps panels unchanged.
- Preserve user input if submission fails so the user can retry.

## Non-Goals

- No backend route, serverless function, or CRM integration.
- No file uploads, product selectors, quantity fields, or multi-step flow.
- No reuse of the form UI on other pages. Other pages continue linking to `/contact-us`.
- No analytics or custom event tracking in this scope.

## Recommended Approach

Use Formspree's frontend AJAX flow via the official client-side integration, rather than a plain HTML redirect flow or a custom `fetch` implementation.

Reasoning:

- It matches the required same-page success behavior.
- It keeps the implementation lightweight inside the current Astro frontend.
- It avoids creating a custom submission layer when the site does not currently have a backend.
- It reduces custom error-handling code compared with a fully hand-written integration.

## User Experience

### Initial State

The page shows the existing two-column contact section:

- Left column: inquiry form
- Right column: contact details and "What Happens Next?" content

The visible form fields remain unchanged in content and order.

### Validation Rules

Required fields:

- Name
- Company Name
- Email
- Project Details / Message

Optional fields:

- WhatsApp / Phone
- Country / Region

Validation behavior:

- Use native browser validation for required fields.
- Keep `type="email"` for email validation.
- Keep `maxlength="1000"` for the message field.
- Do not introduce a custom validation framework.

### Submitting State

When the user submits:

- The submit button becomes disabled.
- The button label changes to `Submitting...`.
- Duplicate submissions are blocked while the request is in flight.
- The rest of the page layout stays stable.

### Success State

If submission succeeds:

- The left-side form container is replaced with a success card.
- The right-side contact details and next-steps cards remain visible.
- The page does not redirect.
- The success card content is:
  - Title: `Thank You For Your Inquiry`
  - Body: `We've received your project details. Our team will review them and get back to you within 24 hours on business days.`
  - Secondary note: `If your request is urgent, feel free to contact us via WhatsApp or email.`

There is no "submit another inquiry" button in this scope.

### Error State

If submission fails:

- The form remains visible.
- The user's entered values remain in place.
- A general error message is shown near the form actions.
- The submit button returns to its normal enabled state.

Recommended message:

`Something went wrong. Please try again or email us directly.`

## Technical Design

### Files in Scope

Primary file:

- `packages/astro/src/components/sections/contact/ContactProjectForm.astro`

Potential support changes:

- `packages/astro/README.md` may be updated to document `PUBLIC_FORMSPREE_FORM_ID` setup

No change is required to the page structure in `packages/astro/src/pages/contact-us.astro`.

### Form Markup Changes

Update the existing form markup to:

- Add field `name` attributes for all six visible inputs.
- Add `required` to the four required fields.
- Add a stable `id` to the `<form>`.
- Change the submit button from `type="button"` to `type="submit"`.
- Add an inline status area for submission errors.
- Add a hidden honeypot text field named `_gotcha`.

Suggested field names:

- `name`
- `company`
- `email`
- `phone`
- `country`
- `message`

### Submission Integration

Use a client-side Formspree integration that:

- Reads a public form ID from an environment variable.
- Binds submission behavior to the contact form.
- Submits asynchronously to Formspree.
- Updates local UI state for idle, submitting, success, and error.

The Formspree form ID must not be hardcoded in the component. Read it from:

- `PUBLIC_FORMSPREE_FORM_ID`

If the environment variable is missing:

- The form should fail in a recognizable way during testing rather than silently pretending to work.
- The UI should not show a false success state.

### State Model

The form needs four UI states:

- `idle`
- `submitting`
- `success`
- `error`

State transitions:

1. `idle -> submitting` when the user submits a valid form
2. `submitting -> success` when Formspree accepts the submission
3. `submitting -> error` when the request fails or returns an error
4. `error -> submitting` when the user retries

On success, render the success card instead of the form.

## Accessibility

- Keep the existing `label` elements and `sr-only` pattern.
- Ensure the submit button exposes disabled state correctly.
- Mark the success message region with `aria-live="polite"` so assistive technologies announce the state change.
- Keep the error message in an accessible text region near the form actions.
- The honeypot field should be hidden from sighted users and removed from normal keyboard flow with `tabindex="-1"` and `autocomplete="off"`.

## Spam Protection

Add a honeypot input named `_gotcha` as a low-cost bot filter.

Behavior:

- Real users should never see or fill this field.
- Simple bots that auto-fill every text input may populate it.
- Formspree treats a populated `_gotcha` field as bot-like traffic and ignores the submission.

Operational recommendation:

- Enable Formspree domain restriction so only the production site domain can submit to the form.

## Error Handling

Expected failure cases:

- Network failure
- Formspree service error
- Misconfigured or missing form ID

Handling rules:

- Never clear user input on failure.
- Never show success unless the submission actually succeeds.
- Provide a single clear retry path by restoring the enabled submit button.

## Testing Plan

Manual verification should cover:

1. Required fields block submission when empty.
2. Invalid email format is rejected by browser validation.
3. Submit button disables and changes label during submission.
4. Successful submission replaces the form with the success card.
5. Failed submission leaves the form values intact and shows the error message.
6. The right-hand contact panels remain unchanged before and after submission.
7. The message length cap still works.
8. Missing `PUBLIC_FORMSPREE_FORM_ID` is caught during setup verification.

## Acceptance Criteria

- A user can submit the inquiry form on `/contact-us` without leaving the page.
- Only the existing six fields are presented to the user.
- The form is replaced by a success card after a successful submission.
- The form remains visible after a failed submission and preserves entered data.
- Other site entry points continue routing users to `/contact-us` rather than hosting separate inquiry forms.

## Open Decisions Resolved

- Integration type: direct frontend Formspree integration
- Field scope: existing six fields only
- Success behavior: replace the form with a success card
- Inquiry entry points: keep all other pages linking to the contact page
