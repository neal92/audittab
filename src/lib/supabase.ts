import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export interface FormTemplate {
  id: string;
  company_id: string;
  name: string;
  description: string;
  fields: any[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AuditRecord {
  id: string;
  template_id: string;
  project_id: string;
  created_by: string;
  data: any;
  status: string;
  created_at: string;
  updated_at: string;
}
