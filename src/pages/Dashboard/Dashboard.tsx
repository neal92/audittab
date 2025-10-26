import { Users, FileText, ClipboardList, LogOut, Gift, X } from 'lucide-react';
import UserManagement from '../GestionUtilisateurs/UserManagement';
import InterventionCreator from '../CreationIntervention/InterventionCreator';
import RecordCreator from '../CreationFiche/RecordCreator';
import { useDashboard } from './hooks';

/**
 * Composant principal du Dashboard
 * Utilise le hook useDashboard pour la logique métier
 */
export default function Dashboard() {
  const {
    profile,
    activeTab,
    showTrialNotice,
    showTrialPopup,
    daysRemaining,
    setActiveTab,
    setShowTrialNotice,
    handleSignOut,
    handleSubscribe,
    closeTrialPopup,
  } = useDashboard();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <img 
              src="/public/audittab_logo-seul.png" 
              alt="AuditTab" 
              className="h-16 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'users'
                ? 'bg-slate-100 text-audittab-navy font-medium'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Utilisateurs</span>
          </button>

          <button
            onClick={() => setActiveTab('interventions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'interventions'
                ? 'bg-slate-100 text-audittab-navy font-medium'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="h-5 w-5" />
            <span>Mes interventions</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'records'
                ? 'bg-slate-100 text-audittab-navy font-medium'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ClipboardList className="h-5 w-5" />
            <span>Création de fiche</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200 flex-shrink-0">
          {profile && (
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-900">
                {profile.first_name} {profile.last_name}
              </p>
              <p className="text-xs text-slate-500">{profile.email}</p>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2 font-bold text-audittab-navy hover:bg-slate-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {showTrialNotice && daysRemaining > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 border-b border-audittab-green-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-audittab-green-100 p-2 rounded-full flex-shrink-0">
                  <Gift className="h-6 w-6 text-audittab-green" />
                </div>
                <div>
                  <p className="text-audittab-navy font-semibold">
                    Essai gratuit de 15 jours
                  </p>
                  <p className="text-audittab-green-700 text-sm">
                    {daysRemaining < 6 ? (
                      <span className="font-medium text-audittab-green-700">
                        Plus que {daysRemaining} jour{daysRemaining > 1 ? 's' : ''}! 
                      </span>
                    ) : (
                      <span>
                        Il vous reste {daysRemaining} jour{daysRemaining > 1 ? 's' : ''}
                      </span>
                    )}
                    {' '}pour profiter de toutes les fonctionnalités
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSubscribe}
                  className="bg-audittab-green hover:bg-audittab-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Passer à un abonnement
                </button>
                <button
                  onClick={() => setShowTrialNotice(false)}
                  className="text-audittab-green hover:text-audittab-green-800 font-medium text-sm"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'interventions' && <InterventionCreator />}
          {activeTab === 'records' && <RecordCreator />}
        </div>
      </main>

      {/* Popup de période d'essai */}
      {showTrialPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-audittab-green-100 p-3 rounded-full">
                  <Gift className="h-8 w-8 text-audittab-green" />
                </div>
                <button
                  onClick={closeTrialPopup}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-audittab-navy mb-2">
                  Période d'essai
                </h3>
                <p className="text-slate-600 mb-4">
                  Vous disposez de <span className="font-semibold text-audittab-green">{daysRemaining} jour{daysRemaining > 1 ? 's' : ''}</span> de période d'essai
                </p>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleSubscribe}
                    className="bg-audittab-green hover:bg-audittab-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Passer à un abonnement
                  </button>
                  <button
                    onClick={closeTrialPopup}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Continuer l'essai
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
