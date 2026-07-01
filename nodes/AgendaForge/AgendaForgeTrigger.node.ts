import {
  IDataObject,
  IHookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookFunctions,
  IWebhookResponseData,
} from 'n8n-workflow';
import { AGENDAFORGE_BASE_URL } from './constants';

/**
 * AgendaForge trigger — starts a workflow when a contact/session/sponsor event
 * fires. Implements n8n's REST-hook lifecycle: on activation it registers this
 * node's webhook URL with AgendaForge (POST /api/v1/hooks?source=n8n) and on
 * deactivation it unsubscribes (DELETE /api/v1/hooks/:id). AgendaForge then
 * pushes signed POSTs to the URL via its delivery engine (3x retry).
 */
export class AgendaForgeTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'AgendaForge Trigger',
    name: 'agendaForgeTrigger',
    icon: 'file:agendaForge.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Starts the workflow when an AgendaForge event occurs',
    defaults: { name: 'AgendaForge Trigger' },
    inputs: [],
    outputs: ['main'],
    credentials: [{ name: 'agendaForgeApi', required: true }],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        required: true,
        default: 'contact.added',
        description: 'The AgendaForge event that should start the workflow',
        options: [
          { name: 'Contact Added', value: 'contact.added' },
          { name: 'Contact Removed', value: 'contact.removed' },
          { name: 'Contact Updated', value: 'contact.updated' },
          { name: 'Session Added', value: 'session.added' },
          { name: 'Session Removed', value: 'session.removed' },
          { name: 'Session Updated', value: 'session.updated' },
          { name: 'Sponsor Added', value: 'sponsor.added' },
          { name: 'Sponsor Removed', value: 'sponsor.removed' },
          { name: 'Sponsor Updated', value: 'sponsor.updated' },
        ],
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');
        return webhookData.hookId !== undefined;
      },

      async create(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default') as string;
        const event = this.getNodeParameter('event') as string;

        const response = (await this.helpers.httpRequestWithAuthentication.call(
          this,
          'agendaForgeApi',
          {
            method: 'POST',
            url: `${AGENDAFORGE_BASE_URL}/api/v1/hooks?source=n8n`,
            body: { event, targetUrl: webhookUrl },
            json: true,
          },
        )) as { id?: string };

        if (response.id === undefined) {
          return false;
        }

        const webhookData = this.getWorkflowStaticData('node');
        webhookData.hookId = response.id;
        return true;
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');
        if (webhookData.hookId === undefined) {
          return true;
        }

        try {
          await this.helpers.httpRequestWithAuthentication.call(
            this,
            'agendaForgeApi',
            {
              method: 'DELETE',
              url: `${AGENDAFORGE_BASE_URL}/api/v1/hooks/${webhookData.hookId}`,
              json: true,
            },
          );
        } catch (error) {
          return false;
        }

        delete webhookData.hookId;
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const bodyData = this.getBodyData();
    return {
      workflowData: [this.helpers.returnJsonArray(bodyData as IDataObject)],
    };
  }
}
