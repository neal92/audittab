import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Profile, Company } from '../lib/types';

interface MockAuthContextType {
  user: any | null;
  profile: Profile | null;
  company: Company | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// Créer un contexte d'authentification simulé
const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si nous avons un utilisateur mocké dans localStorage
    const storedUser = localStorage.getItem('mockAuthUser');
    
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Créer un profil mocké
      setProfile({
        id: userData.id || 'mock-user-id',
        first_name: userData.firstName || 'Utilisateur',
        last_name: userData.lastName || 'Démonstration',
        email: userData.email || 'demo@example.com',
        role: 'admin',
        company_id: 'mock-company-id',
        created_at: new Date().toISOString()
      });
      
      // Créer une entreprise mockée
      setCompany({
        id: 'mock-company-id',
        name: 'Entreprise Démo',
        trial_end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 jours à partir de maintenant
        is_active: true,
        created_at: new Date().toISOString()
      });
    }
    
    // Toujours définir loading à false après la vérification initiale
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    // Simuler une connexion réussie
    const mockUser = { 
      id: 'mock-user-id', 
      email: email || 'demo@example.com' 
    };
    localStorage.setItem('mockAuthUser', JSON.stringify(mockUser));
    
    // Définir un flag pour indiquer une connexion récente
    localStorage.setItem('recentlyLoggedIn', 'true');
    localStorage.setItem('lastLoginTime', new Date().toISOString());
    
    // Note: La popup de rappel d'essai s'affiche maintenant automatiquement 
    // lors du montage du composant UserManagement, donc pas besoin de forcer ici
    
    window.location.reload();
  };

  const signUp = async (data: any): Promise<void> => {
    // Simuler une inscription réussie
    const mockUser = { 
      id: 'mock-user-id', 
      email: data.email || 'demo@example.com',
      firstName: data.firstName || 'Utilisateur',
      lastName: data.lastName || 'Démonstration'
    };
    localStorage.setItem('mockAuthUser', JSON.stringify(mockUser));
    
    // Définir un flag pour indiquer une inscription récente
    localStorage.setItem('recentlyLoggedIn', 'true');
    localStorage.setItem('lastLoginTime', new Date().toISOString());
    
    // Supprimer la date du dernier affichage du rappel pour forcer l'affichage à la connexion
    localStorage.removeItem('trialReminderLastShown');
    
    window.location.reload();
  };

  const signOut = async (): Promise<void> => {
    // Supprimer l'utilisateur mocké de localStorage
    localStorage.removeItem('mockAuthUser');
    localStorage.removeItem('trialPopupShown');
    setUser(null);
    setProfile(null);
    setCompany(null);
    window.location.reload();
  };

  const refreshProfile = async (): Promise<void> => {
    // Ne rien faire dans la version mockée
    return Promise.resolve();
  };

  return (
    <MockAuthContext.Provider
      value={{
        user,
        profile,
        company,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile
      }}
    >
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockAuth() {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
}