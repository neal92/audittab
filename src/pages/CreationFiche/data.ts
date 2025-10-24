import { FormTemplate, AuditRecord, Project } from '../../lib/types';

// Interface pour les données de points de contrôle
export interface CheckpointData {
  id: string;
  label: string;
  description?: string;
  status?: 'conforme' | 'non_conforme' | null;
  value?: any; // Valeur pour les différents types de champs
  notes?: string;
}

// Mock data pour les templates
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

// Mock data pour les projets
export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    company_id: 'mock-company-id',
    name: 'Projet Paris',
    description: 'Rénovation bureaux',
    created_at: new Date(2025, 9, 1).toISOString(),
  },
  {
    id: '2',
    company_id: 'mock-company-id',
    name: 'Projet Lyon',
    description: 'Construction usine',
    created_at: new Date(2025, 9, 5).toISOString(),
  }
];

// Mock data pour les enregistrements
export const MOCK_RECORDS: AuditRecord[] = [
  {
    id: '1',
    template_id: '1',
    project_id: '1',
    created_by: 'mock-user-id',
    data: { 
      'Projet': 'Projet Paris',
      'Intervention': 'Visite de site',
      'Activité': 'Contrôle qualité'
    },
    created_at: new Date(2025, 9, 10).toISOString(),
    updated_at: new Date(2025, 9, 10).toISOString()
  }
];
