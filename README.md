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
3. In n8n, create an **AgendaForge API** credential and paste the key. That is the only
   field — the API endpoint is built into the node.

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

## Compatibility

Tested against n8n 1.x. Requires Node.js >= 20.15.

## Resources

- [AgendaForge n8n guide](https://agendaforge.app/docs/n8n)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

## License

[MIT](LICENSE)
