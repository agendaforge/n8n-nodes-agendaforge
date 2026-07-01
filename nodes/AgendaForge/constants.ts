/**
 * AgendaForge public API base URL — baked into the node so end users never see
 * or configure it (the credential only asks for an API key).
 *
 * Published builds must point at production. For local development against a
 * Convex dev deployment, temporarily change this to your dev host, e.g.
 * `https://<deployment>.convex.site`, and rebuild (`npm run build`).
 */
export const AGENDAFORGE_BASE_URL = "https://acrobatic-wildcat-693.convex.site";
