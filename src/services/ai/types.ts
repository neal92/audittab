import { Operation } from '../../lib/types';

export interface GeneratedResult {
  recordDetails?: any;
  operations?: Operation[];
  [key: string]: any;
}

export interface AiWebhookResponse {
  output?: string;
  result?: string;
  data?: string;
  [key: string]: any;
}

export interface AiApiOptions {
  webhookUrl?: string;
  token?: string;
}

export interface AiServiceOptions extends AiApiOptions {
  // Options supplémentaires pour le service
}