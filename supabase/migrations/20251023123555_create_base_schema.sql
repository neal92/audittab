/*
  # Création du schéma de base Audittab

  ## Tables créées
  
  ### 1. companies (entreprises)
    - id (uuid, primary key)
    - name (text) - Nom de l'entreprise
    - created_at (timestamptz)
    - trial_end_date (timestamptz) - Date de fin d'essai gratuit (15 jours)
    - is_active (boolean) - Statut actif/inactif
  
  ### 2. projects (projets)
    - id (uuid, primary key)
    - company_id (uuid, foreign key)
    - name (text) - Nom du projet
    - description (text)
    - created_at (timestamptz)
  
  ### 3. profiles (profils utilisateurs étendus)
    - id (uuid, primary key, references auth.users)
    - company_id (uuid, foreign key)
    - first_name (text)
    - last_name (text)
    - email (text)
    - role (text) - admin, user, etc.
    - created_at (timestamptz)
  
  ### 4. project_members (membres des projets)
    - id (uuid, primary key)
    - project_id (uuid, foreign key)
    - user_id (uuid, foreign key)
    - created_at (timestamptz)
  
  ### 5. form_templates (structures de fiches)
    - id (uuid, primary key)
    - company_id (uuid, foreign key)
    - name (text) - Nom du template
    - description (text)
    - fields (jsonb) - Structure des champs en JSON
    - created_by (uuid, foreign key to profiles)
    - created_at (timestamptz)
    - updated_at (timestamptz)
  
  ### 6. audit_records (fiches d'audit)
    - id (uuid, primary key)
    - template_id (uuid, foreign key)
    - project_id (uuid, foreign key)
    - created_by (uuid, foreign key to profiles)
    - data (jsonb) - Données de la fiche
    - status (text) - draft, completed, etc.
    - created_at (timestamptz)
    - updated_at (timestamptz)
  
  ### 7. invitation_tokens (tokens d'invitation)
    - id (uuid, primary key)
    - token (text, unique)
    - company_id (uuid, foreign key)
    - project_id (uuid, foreign key)
    - created_by (uuid, foreign key to profiles)
    - email (text) - Email de l'invité (optionnel)
    - expires_at (timestamptz)
    - used_at (timestamptz)
    - created_at (timestamptz)

  ## Sécurité
  - RLS activé sur toutes les tables
  - Policies créées pour l'accès authentifié basé sur l'entreprise
*/

-- Création de la table companies
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  trial_end_date timestamptz DEFAULT (now() + interval '15 days'),
  is_active boolean DEFAULT true
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Création de la table projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Création de la table profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Création de la table project_members
CREATE TABLE IF NOT EXISTS project_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, user_id)
);

ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- Création de la table form_templates
CREATE TABLE IF NOT EXISTS form_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  fields jsonb DEFAULT '[]'::jsonb,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE form_templates ENABLE ROW LEVEL SECURITY;

-- Création de la table audit_records
CREATE TABLE IF NOT EXISTS audit_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES form_templates(id) ON DELETE SET NULL,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  data jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE audit_records ENABLE ROW LEVEL SECURITY;

-- Création de la table invitation_tokens
CREATE TABLE IF NOT EXISTS invitation_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'base64'),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  email text,
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE invitation_tokens ENABLE ROW LEVEL SECURITY;

-- Policies pour companies
CREATE POLICY "Users can view their own company"
  ON companies FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own company"
  ON companies FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies pour projects
CREATE POLICY "Users can view projects in their company"
  ON projects FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create projects in their company"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update projects in their company"
  ON projects FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete projects in their company"
  ON projects FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies pour profiles
CREATE POLICY "Users can view profiles in their company"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Policies pour project_members
CREATE POLICY "Users can view project members in their company"
  ON project_members FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE company_id IN (
        SELECT company_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can add project members"
  ON project_members FOR INSERT
  TO authenticated
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE company_id IN (
        SELECT company_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can remove project members"
  ON project_members FOR DELETE
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE company_id IN (
        SELECT company_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- Policies pour form_templates
CREATE POLICY "Users can view templates in their company"
  ON form_templates FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create templates in their company"
  ON form_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update templates in their company"
  ON form_templates FOR UPDATE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete templates in their company"
  ON form_templates FOR DELETE
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policies pour audit_records
CREATE POLICY "Users can view audit records in their company"
  ON audit_records FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE company_id IN (
        SELECT company_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create audit records"
  ON audit_records FOR INSERT
  TO authenticated
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE company_id IN (
        SELECT company_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update their own audit records"
  ON audit_records FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete their own audit records"
  ON audit_records FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Policies pour invitation_tokens
CREATE POLICY "Users can view invitations from their company"
  ON invitation_tokens FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create invitations for their company"
  ON invitation_tokens FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view invitation by token"
  ON invitation_tokens FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can update invitation used_at"
  ON invitation_tokens FOR UPDATE
  TO authenticated
  USING (used_at IS NULL)
  WITH CHECK (true);