/**
 * Point d'entrée principal du service IA
 * Exporte toutes les fonctionnalités nécessaires
 */

export { AiService } from './service';
export { AiApiClient } from './api';
export { AI_CONFIG } from './config';
export type { GeneratedResult, AiServiceOptions, AiApiOptions } from './types';

// Export principal pour la génération depuis prompt
export { generateStructureFromPrompt } from './service';