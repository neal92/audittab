import { Users, FileText, ClipboardList, LogOut, Gift } from 'lucide-react';
import UserManagement from '../GestionUtilisateurs/UserManagement';
import FormTemplateBuilder from '../StructureFiches/FormTemplateBuilder';
import AuditRecordCreator from '../CreationFiche/AuditRecordCreator';
import { useDashboard } from './hooks';

/**
 * Composant principal du Dashboard
 * Utilise le hook useDashboard pour la logique métier
 */
export default function Dashboard() {
  const {
    profile,
    company,
    activeTab,
    showTrialNotice,
    daysRemaining,
    setActiveTab,
    setShowTrialNotice,
    handleSignOut,
    handleSubscribe,
  } = useDashboard();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <img 
              src="/public/audittab_logo-seul.png" 
              alt="AuditTab" 
              className="h-15 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        <nav className="flex-1 p-4">
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
            onClick={() => setActiveTab('templates')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'templates'
                ? 'bg-slate-100 text-audittab-navy font-medium'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="h-5 w-5" />
            Structure des fiches
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
            Création de fiche
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200">
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
          {activeTab === 'templates' && <FormTemplateBuilder />}
          {activeTab === 'records' && <AuditRecordCreator />}
        </div>
      </main>
    </div>
  );
}
