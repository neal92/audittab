import { UserPlus, Copy, Check, Mail, Trash2 } from 'lucide-react';
import { useUserManagement } from './hooks';

/**
 * Composant principal pour la gestion des utilisateurs
 * Utilise le hook useUserManagement pour la logique métier
 */
export default function UserManagement() {
  const {
    profile,
    users,
    loading,
    invitationLink,
    showInvitation,
    copied,
    createInvitation,
    copyToClipboard,
    deleteUser,
  } = useUserManagement();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div id="main-content" className="transition-all duration-300">
      {/* La popup d'essai a été retirée de cette vue; elle est gérée par le Dashboard global */}
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-audittab-navy">Gestion des utilisateurs</h1>
          <p className="text-slate-600 mt-1">Gérez les membres de votre équipe</p>
        </div>
        <button
          onClick={createInvitation}
          className="flex items-center gap-2 px-4 py-2 bg-audittab-green text-white rounded-lg hover:bg-audittab-green-700 transition-colors"
        >
          <UserPlus className="h-5 w-5" />
          Inviter un utilisateur
        </button>
      </div>

      {showInvitation && (
        <div className="mb-6 p-6 bg-audittab-green-50 border border-audittab-green-200 rounded-xl">
          <h3 className="text-lg font-semibold text-audittab-navy mb-3">
            Lien d'invitation créé
          </h3>
          <p className="text-audittab-green-700 text-sm mb-4">
            Partagez ce lien avec la personne que vous souhaitez inviter. Elle sera automatiquement ajoutée à votre entreprise et projet.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={invitationLink}
              readOnly
              className="flex-1 px-4 py-2 bg-white border border-audittab-green-300 rounded-lg text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-audittab-green text-white rounded-lg hover:bg-audittab-green-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5" />
                  Copié
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  Copier
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Entreprise
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Projet
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Date d'inscription
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                      <span className="text-slate-600 font-semibold">
                        {user.first_name[0]}{user.last_name[0]}
                      </span>
                    </div>
                    <div className="font-medium text-slate-900">
                      {user.first_name} {user.last_name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                  {user.company}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                  {user.project}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin'
                      ? 'bg-audittab-green-100 text-audittab-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {user.id !== profile?.id && user.role !== 'admin' && (
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            Aucun utilisateur trouvé
          </div>
        )}
      </div>
    </div>
  );
}
