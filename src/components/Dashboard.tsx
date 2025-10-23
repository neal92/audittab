import { useState } from 'react';
import { Building2, Users, FileText, ClipboardList, LogOut, Gift } from 'lucide-react';
import UserManagement from './UserManagement';
import FormTemplateBuilder from './FormTemplateBuilder';
import AuditRecordCreator from './AuditRecordCreator';
import { useMockAuth } from '../contexts/MockAuthContext';

export default function Dashboard() {
  const { profile, company, signOut } = useMockAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'templates' | 'records'>('users');
  const [showTrialNotice, setShowTrialNotice] = useState(true);

  const handleSignOut = async () => {
    // Utiliser la fonction signOut du contexte mocké
    await signOut();
    // Recharger la page après déconnexion
    window.location.reload();
  };

  const getDaysRemaining = () => {
    if (!company?.trial_end_date) return 0;
    const now = new Date();
    const trialEnd = new Date(company.trial_end_date);
    const diff = trialEnd.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-8 w-8 text-slate-700" />
            <span className="text-2xl font-bold text-slate-800">Audittab</span>
          </div>
          {company && (
            <p className="text-sm text-slate-600 mt-2">{company.name}</p>
          )}
        </div>

        <nav className="flex-1 p-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'users'
                ? 'bg-slate-100 text-slate-900 font-medium'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="h-5 w-5" />
            Gestion des utilisateurs
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'templates'
                ? 'bg-slate-100 text-slate-900 font-medium'
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
                ? 'bg-slate-100 text-slate-900 font-medium'
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
            className="w-full flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {showTrialNotice && daysRemaining > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-green-900 font-semibold">
                    Essai gratuit de 15 jours
                  </p>
                  <p className="text-green-700 text-sm">
                    Il vous reste {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} pour profiter de toutes les fonctionnalités
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTrialNotice(false)}
                className="text-green-600 hover:text-green-800 font-medium text-sm"
              >
                Fermer
              </button>
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
