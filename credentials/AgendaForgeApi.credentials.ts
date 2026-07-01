import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';
import { AGENDAFORGE_BASE_URL } from '../nodes/AgendaForge/constants';

export class AgendaForgeApi implements ICredentialType {
  name = 'agendaForgeApi';

  displayName = 'AgendaForge API';

  documentationUrl = 'https://agendaforge.app/docs/n8n';

  // Only the API key is configurable — the API host is baked into the node
  // (see AGENDAFORGE_BASE_URL) so users never see or change it.
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description:
        'Organization API key from AgendaForge → Event Settings → Integrations → n8n. Starts with "afk_live_".',
    },
  ];

  // Sends the key as a Bearer token on every request the nodes make.
  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiKey}}',
      },
    },
  };

  // Validates the key on save by calling GET /api/v1/me, which returns the org.
  test: ICredentialTestRequest = {
    request: {
      baseURL: AGENDAFORGE_BASE_URL,
      url: '/api/v1/me',
    },
  };
}
