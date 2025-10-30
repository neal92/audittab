/**
 * Configuration pour les services IA
 * Centralise les URLs, tokens et autres paramètres
 */

export const AI_CONFIG = {
  DEFAULT_WEBHOOK_URL: 'https://n8n.coppelis.com/webhook/generate_stucture',

  // Récupération des variables d'environnement Vite
  get webhookUrl(): string {
    return (import.meta as any).env?.VITE_AI_WEBHOOK_URL || this.DEFAULT_WEBHOOK_URL;
  },

  get token(): string {
    return (import.meta as any).env?.VITE_AI_TOKEN || '';
  },

  get isMockEnabled(): boolean {
    return (import.meta as any).env?.VITE_AI_MOCK === 'true';
  }
} as const;