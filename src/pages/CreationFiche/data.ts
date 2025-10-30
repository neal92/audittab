// Interface pour les données des projets
export interface Project {
  id: string;
  company_id: string;
  name: string;
  description: string;
  created_at: string;
}

// Données mockées pour les projets
export const MOCK_PROJECTS: Project[] = [
  { id: '1', company_id: 'mock-company', name: 'Projet Paris', description: 'Rénovation bureaux', created_at: new Date().toISOString() },
  { id: '2', company_id: 'mock-company', name: 'Projet Lyon', description: 'Construction usine', created_at: new Date().toISOString() },
  { id: '3', company_id: 'mock-company', name: 'Projet Marseille', description: 'Extension entrepôt', created_at: new Date().toISOString() },
];

// Interfaces pour les données des fiches
export interface RecordData {
  [operationId: string]: {
    [fieldId: string]: any;
  };
}

export interface FieldComments {
  [operationId: string]: {
    [fieldId: string]: string;
  };
}

export interface AuditRecord {
  id: string;
  intervention_id: string;
  intervention_name: string;
  project_id?: string;
  project_name?: string;
  created_by: string;
  data: RecordData;
  comments?: FieldComments; // Commentaires pour les checkpoints
  conclusion?: string;
  nonConformites?: string;
  signature?: string;
  created_at: string;
  completed: boolean;
}