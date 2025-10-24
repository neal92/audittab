import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useMockAuth } from '../../contexts/MockAuthContext';
import { Profile, MOCK_USERS } from './data';

/**
 * Hook personnalisé pour gérer la logique de gestion des utilisateurs
 */
export function useUserManagement() {
  const { profile } = useMockAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [invitationLink, setInvitationLink] = useState('');
  const [showInvitation, setShowInvitation] = useState(false);
  const [copied, setCopied] = useState(false);

  // Charger les utilisateurs
  useEffect(() => {
    setUsers(MOCK_USERS);
    setLoading(false);
  }, []);

  // Créer un lien d'invitation
  const createInvitation = async () => {
    const mockToken = uuidv4();
    const link = `${window.location.origin}?invitation=${mockToken}`;
    setInvitationLink(link);
    setShowInvitation(true);
  };

  // Copier le lien dans le presse-papier
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  // Supprimer un utilisateur
  const deleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    setUsers(users.filter(user => user.id !== userId));
  };

  return {
    // State
    profile,
    users,
    loading,
    invitationLink,
    showInvitation,
    copied,
    
    // Actions
    createInvitation,
    copyToClipboard,
    deleteUser,
  };
}
