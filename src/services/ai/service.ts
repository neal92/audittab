/**
 * Service IA - Logique métier pour le traitement des réponses
 * Gère le parsing, la transformation et la validation des données
 */

import { GeneratedResult, AiServiceOptions } from './types';
import { AiApiClient } from './api';

export class AiService {
  /**
   * Extrait la sortie d'une réponse webhook
   */
  private static extractOutputFromResponse(responseJson: any): string | undefined {
    if (!responseJson) return undefined;
    if (Array.isArray(responseJson) && responseJson.length > 0) {
      return responseJson[0]?.output;
    }
    if (typeof responseJson.output !== 'undefined') return responseJson.output;
    // Essayer d'autres clés communes
    return responseJson.output || responseJson.result || responseJson.data;
  }

  /**
   * Nettoie et parse un JSON potentiellement imbriqué/double-encodé
   */
  private static cleanAndParsePossiblyNestedJson(maybeString: any): any {
    if (typeof maybeString !== 'string') return maybeString;

    let candidate: any = maybeString;

    // Essayer plusieurs fois pour gérer les JSON imbriqués/double-encodés
    for (let i = 0; i < 6 && typeof candidate === 'string'; i++) {
      // Remplacer les sauts de ligne littéraux par des échappés pour éviter les erreurs JSON.parse
      const cleaned = candidate.replace(/\r?\n/g, '\\n').trim();

      try {
        candidate = JSON.parse(cleaned);
        break;
      } catch (e) {
        // Essayer un nettoyage permissif pour les guillemets simples
        try {
          const cleanedQuotes = cleaned.replace(/'/g, '"');
          candidate = JSON.parse(cleanedQuotes);
          break;
        } catch (e2) {
          // Dernière tentative : si c'est la dernière itération, retourner la chaîne nettoyée
          if (i === 5) {
            return cleaned;
          }
          // Sinon continuer avec la chaîne nettoyée
          candidate = cleaned;
        }
      }
    }

    return candidate;
  }

  /**
   * Transforme l'état IA brut vers le format interne
   */
  private static transformAiState(aiState: any): GeneratedResult {
    const mapResponseTypeToFieldType = (workUnitType: any, responseType: any): string => {
      if (workUnitType === "0") return 'checkpoint';
      if (workUnitType === "1") {
        switch (String(responseType)) {
          case '1': return 'text';
          case '2': return 'number';
          case '3': return 'select';
          case '4': return 'checkbox';
          case '5': return 'date';
          case '6': return 'select'; // choix multiples traité comme select
          case '7': return 'rating';
          default: return 'text';
        }
      }
      return 'text';
    };

    const parseSelectOptions = (responseValue: any): { id: string; label: string }[] | undefined => {
      if (!responseValue || typeof responseValue !== 'string') return undefined;
      return responseValue.split(',').map((option: string, index: number) => ({
        id: `option-${index}`,
        label: option.trim()
      }));
    };

    const recordDetails = {
      name: aiState.recordDetails?.label || 'Nouvelle Fiche',
      functionalId: aiState.recordDetails?.identifiant || `FNC-${Date.now()}`,
      duration: aiState.recordDetails?.duration || '',
      active: aiState.recordDetails?.active !== undefined ? aiState.recordDetails.active : true,
    };

    const operations = (aiState.listOperations || []).map((op: any, opIndex: number) => {
      // Générer un ID unique même si l'IA retourne le même identifiant
      const uniqueId = `${op.operationIdentifiant || 'op'}-${Date.now()}-${opIndex}`;

      return {
        id: uniqueId,
        name: op.operationLabel || `Opération ${opIndex + 1}`,
        description: op.operationLabel,
        fields: (op.listUnitWorks || []).map((unit: any, unitIndex: number) => {
          // Générer un ID unique pour chaque champ aussi
          const uniqueFieldId = `${unit.workUnitIdentifiant || 'field'}-${Date.now()}-${opIndex}-${unitIndex}`;

          return {
            id: uniqueFieldId,
            type: mapResponseTypeToFieldType(unit.workUnitType, unit.responseType),
            label: unit.workUnitLabel || `Champ ${unitIndex + 1}`,
            description: unit.workUnitInfo,
            required: unit.obligatoire || false,
            options: parseSelectOptions(unit.responseValue)
          };
        })
      };
    });

    return { recordDetails, operations };
  }

  /**
   * Génère une structure depuis un prompt texte
   */
  static async generateStructureFromPrompt(
    prompt: string,
    currentState?: any,
    options: AiServiceOptions = {}
  ): Promise<GeneratedResult> {
    // Appel API
    const apiResponse = await AiApiClient.generateFromPrompt(prompt, currentState, options);

    // Extraction et parsing de la sortie
    const outputStr = this.extractOutputFromResponse(apiResponse);
    if (!outputStr) {
      throw new Error('Réponse inattendue du webhook : clé "output" manquante');
    }

    const parsed = this.cleanAndParsePossiblyNestedJson(outputStr);

    // Transformation selon le format IA
    if (parsed && parsed.listOperations) {
      return this.transformAiState(parsed);
    }

    return (parsed as GeneratedResult) || { operations: [] };
  }

}

/**
 * Fonction d'export principal pour générer une structure depuis un prompt
 */
export async function generateStructureFromPrompt(
  prompt: string,
  currentState?: any,
  options: AiServiceOptions = {}
): Promise<GeneratedResult> {
  return AiService.generateStructureFromPrompt(prompt, currentState, options);
}