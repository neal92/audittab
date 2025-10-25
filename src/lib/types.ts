// Types for the application without importing from supabase

// NOUVELLE STRUCTURE : Intervention contient des Opérations, et chaque Opération contient des Champs
export interface Intervention {
  id: string;
  company_id: string;
  name: string;
  description: string;
  project_id?: string; // Projet associé à cette intervention
  operations: Operation[]; // Liste des opérations
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Operation {
  id: string;
  name: string;
  description?: string;
  fields: OperationField[]; // Les champs de l'opération (points de contrôle, cases à cocher, etc.)
}

// Types de champs disponibles dans la boîte à outils
export type FieldType = 'checkpoint' | 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'rating' | 'date' | 'photo';

export interface OperationField {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  required?: boolean;
  options?: { id: string; label: string }[]; // Pour les champs select
}

// Ancien type FormTemplate gardé pour compatibilité (sera supprimé plus tard)
export interface FormTemplate {
  id: string;
  company_id: string;
  name: string;
  description: string;
  fields: any[];
  project_id?: string;
  intervention?: string;
  operations?: Operation[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface OperationCheckpoint {
  id: string;
  label: string;
  description?: string;
  type?: 'conforme' | 'text' | 'number' | 'select' | 'checkbox';
  options?: { id: string; label: string }[];
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