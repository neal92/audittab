import { useState } from 'react';
import { useMockAuth } from '../../contexts/MockAuthContext';

/**
 * Type pour les onglets du Dashboard
 */
export type DashboardTab = 'users' | 'interventions' | 'records';

/**
 * Hook personnalisé pour la gestion du Dashboard
 */
export function useDashboard() {
  const { profile, company, signOut } = useMockAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('users');
  const [showTrialNotice, setShowTrialNotice] = useState(true);

  /**
   * Calcule le nombre de jours restants dans la période d'essai
   */
  const getDaysRemaining = () => {
    if (!company?.trial_end_date) return 0;
    const now = new Date();
    const trialEnd = new Date(company.trial_end_date);
    const diff = trialEnd.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  /**
   * Gère la déconnexion de l'utilisateur
   */
  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  /**
   * Gère le clic sur le bouton d'abonnement
   */
  const handleSubscribe = () => {
    alert("Redirection vers la page d'abonnement");
  };

  const daysRemaining = getDaysRemaining();

  return {
    // État
    profile,
    company,
    activeTab,
    showTrialNotice,
    daysRemaining,
    
    // Actions
    setActiveTab,
    setShowTrialNotice,
    handleSignOut,
    handleSubscribe,
  };
}
