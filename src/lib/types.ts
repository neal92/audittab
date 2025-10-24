// Types for the application without importing from supabase
export interface FormTemplate {
  id: string;
  company_id: string;
  name: string;
  description: string;
  fields: any[];
  project_id?: string; // Projet associé à cette structure
  intervention?: string; // Intervention associée à cette structure
  operations?: Operation[]; // Liste des opérations avec leurs points de contrôle
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Operation {
  id: string;
  name: string;
  checkpoints: OperationCheckpoint[];
}

export interface OperationCheckpoint {
  id: string;
  label: string;
  description?: string;
  type?: 'conforme' | 'text' | 'number' | 'select' | 'checkbox'; // Type de champ pour ce point de contrôle
  options?: { id: string; label: string }[]; // Options pour les champs select
}

export interface Profile {
  id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  trial_end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  company_id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface AuditRecord {
  id: string;
  template_id: string;
  project_id: string;
  created_by: string;
  data: any;
  created_at: string;
  updated_at: string;
}