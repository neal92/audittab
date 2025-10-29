// Small AI utilities: send prompt or file to an n8n webhook and toggle a global loading indicator.
// Configure your webhook URL via Vite env: VITE_AI_WEBHOOK_URL or replace the default below.

export const AI_WEBHOOK_URL = typeof import.meta !== 'undefined' &&
  (import.meta as any).env?.VITE_AI_WEBHOOK_URL
  ? (import.meta as any).env.VITE_AI_WEBHOOK_URL
  : 'https://votre-n8n-instance/webhook/generate-ai';

/**
 * Toggle a minimal global loading indicator by adding/removing `.ai-loading` on <body>.
 * Adapt this function to integrate with your app's UI (context, state, spinner component...)
 */
export function toggleAiLoading(flag: boolean) {
  const body = typeof document !== 'undefined' ? document.querySelector('body') : null;
  if (!body) return;
  if (flag) body.classList.add('ai-loading');
  else body.classList.remove('ai-loading');
}

/**
 * Send a JSON prompt to the AI webhook. Returns parsed JSON from the webhook response.
 * - prompt: the text prompt to send
 * - ficheId: optional ID to associate the generated result with a fiche/intervention
 */
export async function handlePromptGeneration(prompt: string, ficheId?: string): Promise<any> {
  toggleAiLoading(true);
  try {
    const payload = { prompt, ficheId };
    const res = await fetch(AI_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI webhook error ${res.status}: ${text}`);
    }
    const data = await res.json();
    return data;
  } finally {
    toggleAiLoading(false);
  }
}

/**
 * Send a file (multipart/form-data) to the AI webhook. Returns parsed JSON from the webhook.
 * - file: File instance from an <input type="file"> or drag-drop
 * - ficheId: optional ID to associate the uploaded file with a fiche/intervention
 */
export async function handleFileGeneration(file: File, ficheId?: string): Promise<any> {
  toggleAiLoading(true);
  try {
    const form = new FormData();
    form.append('file', file);
    if (ficheId) form.append('ficheId', ficheId);

    const res = await fetch(AI_WEBHOOK_URL, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI webhook error ${res.status}: ${text}`);
    }
    const data = await res.json();
    return data;
  } finally {
    toggleAiLoading(false);
  }
}

// Example usage (commented):
// import { handlePromptGeneration } from './lib/ai';
// handlePromptGeneration('Génère une proposition d\'intervention pour ...').then(console.log).catch(console.error);