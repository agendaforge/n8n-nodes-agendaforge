# n8n-nodes-agendaforge

This is an n8n community node. It lets you use [AgendaForge](https://agendaforge.app) — an
AI-native event management CRM — in your n8n workflows.

AgendaForge manages the full lifecycle of your events: contacts, sessions, speakers,
sponsors, applications, and registrations.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/)
workflow automation platform.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) ·
[Triggers](#triggers) · [Compatibility](#compatibility) · [Resources](#resources)

## Installation

Follow the
[installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the
n8n community nodes documentation. Search for `n8n-nodes-agendaforge`.

## Credentials

You need an AgendaForge **API key**:

1. In AgendaForge, open **Event Settings → Integrations → n8n**.
2. Click **Generate key** and copy the value (starts with `afk_live_`, shown once).
3. In n8n, create an **AgendaForge API** credential and paste the key. Leave **Base URL** as
   the default (`https://api.agendaforge.com`) unless you are on a dedicated/self-hosted
   deployment.

The credential is validated against `GET /api/v1/me`, which labels it with your
organization name.

> API keys are **organization-wide** and **shared with Zapier and Make.com**. Revoking a
> key disconnects all of them. Owners/Admins only.

## Operations

The **AgendaForge** node supports these actions:

| Resource | Operation | Required             | Optional                                                                                       |
| -------- | --------- | -------------------- | ---------------------------------------------------------------------------------------------- |
| Contact  | Create    | First Name, Last Name, Email | Type, Phone, Company, Job Title                                                         |
| Session  | Create    | Event ID, Title      | Type, Description, Duration (min), Start/End Time, Max Attendees, Is Public, Tags               |
| Sponsor  | Create    | Event ID, Name       | Website, Description, Has Booth, Tier ID                                                        |

> **Event ID** for sessions/sponsors must belong to the same organization as your API key.
> Map it from an upstream AgendaForge Trigger or copy it from the event in the app.

A record created via an action also fires the matching "added" trigger.

## Triggers

The **AgendaForge Trigger** node starts a workflow when an event occurs. On activation it
registers this node's webhook with AgendaForge automatically; on deactivation it
unsubscribes. AgendaForge delivers signed POSTs (retried up to 3×).

Events: `contact.added/updated/removed`, `session.added/updated/removed`,
`sponsor.added/updated/removed`.

The delivered body is `{ event, payload, timestamp }` — the record fields live under
`payload`.

## Repository & publishing

This package currently lives inside the AgendaForge monorepo at
`integrations/n8n-nodes-agendaforge/`, **outside** the Turborepo workspaces
(`apps/*`, `packages/*`) so it has an independent build/lint/publish lifecycle and is not
pulled into the app's type-check or CI.

**Before publishing, split this folder into its own public Git repository** (n8n
verification requires a public repo whose source matches the npm package). The bundled
[`.github/workflows/publish.yml`](.github/workflows/publish.yml) is written for that
standalone repo — it sits at the repo root there and runs `npm publish --provenance` on a
GitHub Release. While the folder remains nested in the monorepo, that workflow is **inert**
(GitHub only reads workflows from the repository-root `.github/workflows/`). Do not move it
to the monorepo root — we do not want the app's CI publishing this package; it gets its own
repo + CI.

## Compatibility

Tested against n8n 1.x. Requires Node.js >= 20.15.

## Resources

- [AgendaForge n8n guide](https://agendaforge.app/docs/n8n)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

## License

[MIT](LICENSE)
