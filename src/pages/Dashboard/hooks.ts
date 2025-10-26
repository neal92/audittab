import { useState, useEffect } from 'react';
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
  const [showTrialPopup, setShowTrialPopup] = useState(false);

  // Vérifier si on doit afficher le popup d'essai après connexion
  useEffect(() => {
    const recentlyLoggedIn = localStorage.getItem('recentlyLoggedIn');
    const trialPopupShown = localStorage.getItem('trialPopupShown');

    if (recentlyLoggedIn === 'true' && !trialPopupShown && company?.trial_end_date) {
      const daysRemaining = getDaysRemaining();
      if (daysRemaining > 0) {
        setShowTrialPopup(true);
        // Marquer que le popup a été affiché
        localStorage.setItem('trialPopupShown', 'true');
        // Supprimer le flag de connexion récente
        localStorage.removeItem('recentlyLoggedIn');
      }
    }
  }, [company]);

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

  /**
   * Ferme le popup d'essai
   */
  const closeTrialPopup = () => {
    setShowTrialPopup(false);
  };

  const daysRemaining = getDaysRemaining();

  return {
    // État
    profile,
    company,
    activeTab,
    showTrialNotice,
    showTrialPopup,
    daysRemaining,

    // Actions
    setActiveTab,
    setShowTrialNotice,
    handleSignOut,
    handleSubscribe,
    closeTrialPopup,
  };
}
