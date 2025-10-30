/**
 * Gère uniquement les appels HTTP, pas la logique métier
 */

import { AiWebhookResponse, AiApiOptions } from './types';
import { AI_CONFIG } from './config';

export class AiApiClient {
  /**
   * Appel générique au webhook avec gestion d'erreur
   */
  private static async callWebhook(
    url: string,
    options: RequestInit
  ): Promise<AiWebhookResponse> {
    const response = await fetch(url, options);

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      try {
        const parsed = JSON.parse(text);
        throw new Error(parsed.message || parsed.error || response.statusText);
      } catch {
        throw new Error(text || `Erreur serveur: ${response.status} ${response.statusText}`);
      }
    }

    return await response.json().catch(() => ({}));
  }

  /**
   * Génère une structure depuis un prompt texte
   */
  static async generateFromPrompt(
    prompt: string,
    currentState?: any,
    options: AiApiOptions = {}
  ): Promise<AiWebhookResponse> {
    if (!prompt || !prompt.trim()) {
      throw new Error('Prompt vide');
    }

    const url = options.webhookUrl || AI_CONFIG.webhookUrl;
    const token = options.token || AI_CONFIG.token;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : token;
    }

    const body = JSON.stringify({ prompt, currentState });

    return this.callWebhook(url, {
      method: 'POST',
      headers,
      body
    });
  }
}