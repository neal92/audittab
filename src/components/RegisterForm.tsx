import { useState } from 'react';
import { Building2, Mail, Lock, User, FolderOpen, X } from 'lucide-react';
import { useMockAuth } from '../contexts/MockAuthContext';

interface RegisterFormProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
  invitationToken?: string;
}

export default function RegisterForm({ onClose, onSwitchToLogin, invitationToken }: RegisterFormProps) {
  const { signUp } = useMockAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    projectName: '',
    password: '',
    companyName: 'À compléter',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Utiliser le système d'authentification mocké
      await signUp(formData);
      
      // Recharger la page pour accéder au dashboard
      window.location.reload();
    } catch (error) {
      setError('Une erreur est survenue lors de l\'inscription');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <Building2 className="h-8 w-8 text-slate-700" />
          <span className="text-2xl font-bold text-slate-800">Audittab</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">Inscription</h2>
        <p className="text-slate-600 mb-6">
          {invitationToken
            ? "Rejoignez l'équipe"
            : "Créez votre compte et bénéficiez de 15 jours d'essai gratuit"}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Prénom
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="Jean"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nom
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="Dupont"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          {!invitationToken && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Projet
                </label>
                <div className="relative">
                  <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="Nom du projet"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-semibold transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onSwitchToLogin}
            className="text-slate-600 hover:text-slate-800 text-sm"
          >
            Déjà un compte ? <span className="font-semibold">Se connecter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
