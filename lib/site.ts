// Site-wide constants — the single source of truth for values shared across
// multiple pages. Update the contact email here once and every reference (the
// RSVP error states and the FAQ "Still have questions?" card) picks it up.
export const CONTACT_EMAIL = "tylerstraffon@gmail.com";

// Prebuilt mailto href so callers don't re-type the scheme at each link.
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;
