import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile, Company } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  company: Company | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string;
  projectName: string;
  invitationToken?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileData) {
      setProfile(profileData);

      const { data: companyData } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profileData.company_id)
        .maybeSingle();

      if (companyData) {
        setCompany(companyData);
      }
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadProfile(session.user.id);
      } else {
        setProfile(null);
        setCompany(null);
      }
      setLoading(false);
    }));

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (data: SignUpData) => {
    let companyId: string | null = null;
    let projectId: string | null = null;

    if (data.invitationToken) {
      const { data: invitation } = await supabase
        .from('invitation_tokens')
        .select('*, projects(id, name)')
        .eq('token', data.invitationToken)
        .is('used_at', null)
        .maybeSingle();

      if (!invitation || new Date(invitation.expires_at) < new Date()) {
        throw new Error('Invalid or expired invitation');
      }

      companyId = invitation.company_id;
      projectId = invitation.project_id;
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // Si l'utilisateur n'a pas d'invitation, créer une entreprise temporaire
    if (!data.invitationToken) {
      const { data: newCompany, error: companyError } = await supabase
        .from('companies')
        .insert({ 
          name: data.companyName,
          created_by: authData.user.id
        })
        .select()
        .single();

      if (companyError) throw companyError;
      companyId = newCompany.id;

      const { data: newProject, error: projectError } = await supabase
        .from('projects')
        .insert({
          company_id: companyId,
          name: data.projectName,
          description: 'Projet principal'
        })
        .select()
        .single();

      if (projectError) throw projectError;
      projectId = newProject.id;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        company_id: companyId,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        role: data.invitationToken ? 'user' : 'admin',
        needs_company_setup: !data.invitationToken, // Indicateur que l'utilisateur doit configurer son entreprise
      });

    if (profileError) throw profileError;

    if (projectId) {
      await supabase
        .from('project_members')
        .insert({
          project_id: projectId,
          user_id: authData.user.id,
        });
    }

    if (data.invitationToken) {
      await supabase
        .from('invitation_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('token', data.invitationToken);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      company,
      loading,
      signIn,
      signUp,
      signOut,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
