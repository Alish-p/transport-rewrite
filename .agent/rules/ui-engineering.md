---
trigger: always_on
---

# UI Rules

Follow these rules for all frontend/UI work.

## Architecture

- Follow the existing project architecture and patterns before introducing anything new.
- Put only genuinely reusable code in `shared/`.
- Keep components focused on one responsibility.
- Extract large or multi-responsibility components.
- Keep business logic out of JSX.

## Components

- Reuse existing components before creating new ones.
- Do not create abstractions for one-off use cases.
- Prefer simple components over overly generic components.
- Pass explicit props instead of entire objects when practical.
- Keep JSX readable; avoid deeply nested conditions.
- Use descriptive component, variable, hook, and handler names.
- Use `is*`, `has*`, `can*`, and `should*` for boolean values.

## MUI / Styling

- Use the existing MUI theme and design system.
- Prefer MUI components and `sx` over custom implementations.
- Do not introduce new styling libraries without a strong reason.
- Avoid hardcoded colors, spacing, typography, and dimensions when theme values exist.
- Follow existing spacing, typography, button, table, dialog, and form patterns.
- All new UI must work on desktop, tablet, and mobile.

## State / Data

- Keep local UI state local; do not put everything in Redux.
- Follow existing state-management patterns.
- Prefer `Component → Hook → Service → API`.
- Do not make API calls directly throughout components.
- Use existing utilities before creating new ones.
- Avoid duplicated formatting or validation logic.
- Use existing constants instead of magic strings.

## Forms

- Follow the existing React Hook Form + Zod patterns.
- Keep validation in schemas.
- Do not duplicate business rules unnecessarily between components.
- Handle loading, error, empty, and success states.

## Maintainability

- Prefer readability over cleverness.
- Prefer simple solutions over premature abstraction.
- Avoid unnecessary refactoring.
- Do not change unrelated behavior.
- Do not introduce dependencies unless necessary.
- Comments should explain **why**, not **what**.
- Do not duplicate server-side business rules for security; the backend remains authoritative.

## Accessibility

- Use semantic elements where appropriate.
- Icon-only buttons must have accessible labels.
- Forms must have labels and useful validation messages.
- Do not communicate important information through color alone.
- Consider keyboard navigation and focus states.

## Before Finishing

Check:

- Existing components/patterns were reused where appropriate.
- No unnecessary duplication or abstraction was introduced.
- Loading/error/empty states are handled.
- Responsive behavior is considered.
- No unused imports or obvious lint issues remain.
- Existing behavior was preserved.
- Relevant tests/lint/build checks pass.

## Golden Rule

**Consistency beats cleverness.**

When an existing project convention conflicts with personal preference, follow the existing project convention unless there is a strong technical reason to change it.
