import { useState, useEffect } from 'react';
import { UserPlus, Copy, Check, Mail, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // Vous devrez peut-être installer uuid: npm install uuid @types/uuid
import { useMockAuth } from '../contexts/MockAuthContext';

// Interface pour les données des utilisateurs (version frontend uniquement)
interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  company: string;
  project: string;
  created_at: string;
}

// La popup de rappel d'essai a été retirée de ce fichier : elle est gérée par le Dashboard

// Nous utilisons maintenant le contexte d'authentification (useMockAuth)
// au lieu d'un objet mockCurrentUser directement

// Données mockées pour les utilisateurs
const mockUsers: Profile[] = [
  {
    id: "current-user-id",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    role: "admin",
    company: "Entreprise Démo",
    project: "Projet Paris",
    created_at: new Date(2025, 9, 1).toISOString()
  },
  {
    id: "user-2",
    first_name: "Marie",
    last_name: "Dubois",
    email: "marie.dubois@example.com",
    role: "user",
    company: "Entreprise Démo",
    project: "Projet Lyon",
    created_at: new Date(2025, 9, 10).toISOString()
  },
  {
    id: "user-3",
    first_name: "Pierre",
    last_name: "Martin",
    email: "pierre.martin@example.com",
    role: "user",
    company: "Entreprise Démo",
    project: "Projet Paris",
    created_at: new Date(2025, 9, 15).toISOString()
  }
];

export default function UserManagement() {
  // Utiliser notre contexte d'authentification mocké
  const { profile } = useMockAuth();
  
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [invitationLink, setInvitationLink] = useState('');
  const [showInvitation, setShowInvitation] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Simuler un chargement des données
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  
  // Note: la popup de rappel d'essai est gérée globalement (Dashboard);
  // ce composant n'affiche plus la popup localement.

  const createInvitation = async () => {
    // Simuler la création d'un lien d'invitation
    const mockToken = uuidv4();
    const link = `${window.location.origin}?invitation=${mockToken}`;
    setInvitationLink(link);
    setShowInvitation(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    
    // Simuler la suppression d'un utilisateur
    setUsers(users.filter(user => user.id !== userId));
  };

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
          <h1 className="text-3xl font-bold text-slate-900">Gestion des utilisateurs</h1>
          <p className="text-slate-600 mt-1">Gérez les membres de votre équipe</p>
        </div>
        <button
          onClick={createInvitation}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <UserPlus className="h-5 w-5" />
          Inviter un utilisateur
        </button>
      </div>

      {showInvitation && (
        <div className="mb-6 p-6 bg-orange-50 border border-orange-200 rounded-xl">
          <h3 className="text-lg font-semibold text-orange-900 mb-3">
            Lien d'invitation créé
          </h3>
          <p className="text-orange-700 text-sm mb-4">
            Partagez ce lien avec la personne que vous souhaitez inviter. Elle sera automatiquement ajoutée à votre entreprise et projet.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={invitationLink}
              readOnly
              className="flex-1 px-4 py-2 bg-white border border-orange-300 rounded-lg text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
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
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {user.id !== profile?.id && (
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
