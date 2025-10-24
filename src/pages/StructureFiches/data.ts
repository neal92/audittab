import { FormTemplate } from '../../lib/types';

/**
 * Interface pour un point de contrôle défini dans le template
 */
export interface CheckpointItem {
  id: string;
  label: string;
  description: string;
}

/**
 * Interface pour une option dans une liste déroulante
 */
export interface OptionItem {
  id: string;
  label: string;
}

/**
 * Interface pour un élément de case à cocher
 */
export interface CheckboxItem {
  id: string;
  label: string;
}

/**
 * Interface pour un champ de formulaire
 */
export interface Field {
  id: string;
  type: 'text' | 'number' | 'date' | 'select' | 'duration' | 'checkbox' | 'photo' | 'checkpoints';
  label: string;
  required: boolean;
  options?: OptionItem[];
  checkboxes?: CheckboxItem[];
  checkpoints?: CheckpointItem[];
}

/**
 * Types de champs disponibles pour les formulaires
 */
export const FIELD_TYPES = [
  { value: 'text', label: 'Texte' },
  { value: 'number', label: 'Nombre' },
  { value: 'date', label: 'Date' },
  { value: 'duration', label: 'Durée' },
  { value: 'select', label: 'Liste déroulante' },
  { value: 'checkbox', label: 'Case à cocher' },
  { value: 'photo', label: 'Photo' },
  { value: 'checkpoints', label: 'Points de contrôle' },
];

/**
 * Champs par défaut pour un nouveau template
 */
export const DEFAULT_FIELDS: Field[] = [
  { id: '1', type: 'text', label: 'Projet', required: true },
  { id: '2', type: 'text', label: 'Intervention', required: true },
  { id: '3', type: 'text', label: 'Activité', required: true },
  { id: '4', type: 'duration', label: 'Durée', required: false },
  { id: '5', type: 'text', label: 'Opération', required: false },
  { id: '6', type: 'checkpoints', label: 'Points de contrôle', required: false },
];

/**
 * Données mockées pour les templates de formulaires
 */
export const MOCK_TEMPLATES: FormTemplate[] = [
  {
    id: '1',
    company_id: 'mock-company-id',
    name: 'Fiche d\'audit standard',
    description: 'Template standard pour les audits quotidiens',
    fields: [
      { id: '1', type: 'text', label: 'Projet', required: true },
      { id: '2', type: 'text', label: 'Intervention', required: true },
      { id: '3', type: 'text', label: 'Activité', required: true },
      { id: '4', type: 'duration', label: 'Durée', required: false },
      { id: '5', type: 'text', label: 'Opération', required: false },
    ],
    created_by: 'mock-user-id',
    created_at: new Date(2025, 9, 1).toISOString(),
    updated_at: new Date(2025, 9, 1).toISOString(),
  },
  {
    id: '2',
    company_id: 'mock-company-id',
    name: 'Contrôle de sécurité',
    description: 'Template pour les vérifications de sécurité',
    fields: [
      { id: '1', type: 'text', label: 'Site', required: true },
      { id: '2', type: 'checkbox', label: 'EPI présents', required: true },
      { id: '3', type: 'checkpoints', label: 'Points de contrôle', required: true },
    ],
    created_by: 'mock-user-id',
    created_at: new Date(2025, 9, 5).toISOString(),
    updated_at: new Date(2025, 9, 5).toISOString(),
  }
];
