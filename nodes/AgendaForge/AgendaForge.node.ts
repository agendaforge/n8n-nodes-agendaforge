import { INodeType, INodeTypeDescription, NodeConnectionTypes } from 'n8n-workflow';
import { AGENDAFORGE_BASE_URL } from './constants';

/**
 * Declarative AgendaForge node — "Create" actions for Contact, Session and
 * Sponsor. Each operation routes to the existing public REST API
 * (POST /api/v1/contacts|sessions|sponsors); auth (Bearer key) and the base URL
 * come from the AgendaForge API credential.
 */
export class AgendaForge implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'AgendaForge',
    name: 'agendaForge',
    icon: { light: 'file:agendaForge.light.svg', dark: 'file:agendaForge.dark.svg' },
    group: ['transform'],
    version: 1,
    usableAsTool: true,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Create records in AgendaForge',
    defaults: { name: 'AgendaForge' },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [{ name: 'agendaForgeApi', required: true }],
    requestDefaults: {
      baseURL: `${AGENDAFORGE_BASE_URL}/api/v1`,
      headers: {
        'Content-Type': 'application/json',
      },
    },
    properties: [
      // ----- Resource ------------------------------------------------------
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        default: 'contact',
        options: [
          { name: 'Contact', value: 'contact' },
          { name: 'Session', value: 'session' },
          { name: 'Sponsor', value: 'sponsor' },
        ],
      },

      // ----- Operation (one Create per resource) ---------------------------
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'create',
        displayOptions: { show: { resource: ['contact'] } },
        options: [
          {
            name: 'Create',
            value: 'create',
            action: 'Create a contact',
            description: 'Create a new contact',
            routing: { request: { method: 'POST', url: '/contacts?source=n8n' } },
          },
        ],
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'create',
        displayOptions: { show: { resource: ['session'] } },
        options: [
          {
            name: 'Create',
            value: 'create',
            action: 'Create a session',
            description: 'Create a new session',
            routing: { request: { method: 'POST', url: '/sessions?source=n8n' } },
          },
        ],
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'create',
        displayOptions: { show: { resource: ['sponsor'] } },
        options: [
          {
            name: 'Create',
            value: 'create',
            action: 'Create a sponsor',
            description: 'Create a new sponsor',
            routing: { request: { method: 'POST', url: '/sponsors?source=n8n' } },
          },
        ],
      },

      // ----- Contact fields ------------------------------------------------
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
        routing: { send: { type: 'body', property: 'firstName' } },
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
        routing: { send: { type: 'body', property: 'lastName' } },
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
        routing: { send: { type: 'body', property: 'email' } },
      },
      {
        displayName: 'Additional Fields',
        name: 'contactAdditionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
        options: [
          {
            displayName: 'Type',
            name: 'type',
            type: 'options',
            default: 'attendee',
            options: [
              { name: 'Attendee', value: 'attendee' },
              { name: 'Exhibitor', value: 'exhibitor' },
              { name: 'Other', value: 'other' },
              { name: 'Partner', value: 'partner' },
              { name: 'Speaker', value: 'speaker' },
              { name: 'Sponsor', value: 'sponsor' },
              { name: 'Vendor', value: 'vendor' },
            ],
            routing: { send: { type: 'body', property: 'type' } },
          },
          {
            displayName: 'Phone',
            name: 'phone',
            type: 'string',
            default: '',
            routing: { send: { type: 'body', property: 'phone' } },
          },
          {
            displayName: 'Company',
            name: 'company',
            type: 'string',
            default: '',
            routing: { send: { type: 'body', property: 'company' } },
          },
          {
            displayName: 'Job Title',
            name: 'jobTitle',
            type: 'string',
            default: '',
            routing: { send: { type: 'body', property: 'jobTitle' } },
          },
        ],
      },

      // ----- Session fields ------------------------------------------------
      {
        displayName: 'Event ID',
        name: 'eventId',
        type: 'string',
        required: true,
        default: '',
        description:
          'ID of the event the session belongs to. Must be in the same organization as your API key.',
        displayOptions: { show: { resource: ['session'], operation: ['create'] } },
        routing: { send: { type: 'body', property: 'eventId' } },
      },
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['session'], operation: ['create'] } },
        routing: { send: { type: 'body', property: 'title' } },
      },
      {
        displayName: 'Additional Fields',
        name: 'sessionAdditionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['session'], operation: ['create'] } },
        options: [
          {
            displayName: 'Description',
            name: 'description',
            type: 'string',
            typeOptions: { rows: 3 },
            default: '',
            routing: { send: { type: 'body', property: 'description' } },
          },
          {
            displayName: 'Duration (Minutes)',
            name: 'duration',
            type: 'number',
            default: 0,
            routing: { send: { type: 'body', property: 'duration' } },
          },
          {
            displayName: 'End Time',
            name: 'endTime',
            type: 'dateTime',
            default: '',
            routing: { send: { type: 'body', property: 'endTime' } },
          },
          {
            displayName: 'Is Public',
            name: 'isPublic',
            type: 'boolean',
            default: false,
            routing: { send: { type: 'body', property: 'isPublic' } },
          },
          {
            displayName: 'Max Attendees',
            name: 'maxAttendees',
            type: 'number',
            default: 0,
            routing: { send: { type: 'body', property: 'maxAttendees' } },
          },
          {
            displayName: 'Start Time',
            name: 'startTime',
            type: 'dateTime',
            default: '',
            routing: { send: { type: 'body', property: 'startTime' } },
          },
          {
            displayName: 'Tags',
            name: 'tags',
            type: 'string',
            default: '',
            description: 'Comma-separated list of tags',
            routing: {
              send: {
                type: 'body',
                property: 'tags',
                value:
                  '={{ $value ? $value.split(",").map(t => t.trim()).filter(t => t) : undefined }}',
              },
            },
          },
          {
            displayName: 'Type',
            name: 'type',
            type: 'options',
            default: 'talk',
            options: [
              { name: 'Break', value: 'break' },
              { name: 'Keynote', value: 'keynote' },
              { name: 'Lightning', value: 'lightning' },
              { name: 'Networking', value: 'networking' },
              { name: 'Other', value: 'other' },
              { name: 'Panel', value: 'panel' },
              { name: 'Placeholder', value: 'placeholder' },
              { name: 'Social', value: 'social' },
              { name: 'Talk', value: 'talk' },
              { name: 'Workshop', value: 'workshop' },
            ],
            routing: { send: { type: 'body', property: 'type' } },
          },
        ],
      },

      // ----- Sponsor fields ------------------------------------------------
      {
        displayName: 'Event ID',
        name: 'eventId',
        type: 'string',
        required: true,
        default: '',
        description:
          'ID of the event the sponsor belongs to. Must be in the same organization as your API key.',
        displayOptions: { show: { resource: ['sponsor'], operation: ['create'] } },
        routing: { send: { type: 'body', property: 'eventId' } },
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['sponsor'], operation: ['create'] } },
        routing: { send: { type: 'body', property: 'name' } },
      },
      {
        displayName: 'Additional Fields',
        name: 'sponsorAdditionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['sponsor'], operation: ['create'] } },
        options: [
          {
            displayName: 'Website',
            name: 'website',
            type: 'string',
            default: '',
            routing: { send: { type: 'body', property: 'website' } },
          },
          {
            displayName: 'Description',
            name: 'description',
            type: 'string',
            typeOptions: { rows: 3 },
            default: '',
            routing: { send: { type: 'body', property: 'description' } },
          },
          {
            displayName: 'Has Booth',
            name: 'hasBooth',
            type: 'boolean',
            default: false,
            routing: { send: { type: 'body', property: 'hasBooth' } },
          },
          {
            displayName: 'Tier ID',
            name: 'tierId',
            type: 'string',
            default: '',
            description: 'ID of the sponsor tier to assign',
            routing: { send: { type: 'body', property: 'tierId' } },
          },
        ],
      },
    ],
  };
}
