import { useState } from 'react';
import { Building2, Mail, Lock, User, FolderOpen, X, Sparkles, CheckCircle } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative my-8 overflow-hidden">
        {/* Background gradient decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-audittab-green-100 to-audittab-green-200 rounded-full blur-3xl opacity-30 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-audittab-navy-100 to-audittab-navy-200 rounded-full blur-3xl opacity-30 -z-10"></div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors hover:bg-slate-100 rounded-lg p-2"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <img 
            src="/public/audittab_logo-seul.png" 
            alt="AuditTab" 
            className="h-10 w-auto"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-audittab-navy to-audittab-green mb-2">
          {invitationToken ? "Rejoignez l'équipe" : "Commencez gratuitement"}
        </h2>
        <p className="text-slate-600 mb-6">
          {invitationToken
            ? "Créez votre compte pour rejoindre votre équipe"
            : (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-audittab-green" />
                15 jours d'essai gratuit, sans carte bancaire
              </span>
            )}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
            <span className="font-medium">⚠️</span>
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
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-audittab-green-500" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-audittab-green focus:border-audittab-green transition-all"
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
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-audittab-green-500" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-audittab-green focus:border-audittab-green transition-all"
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
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-audittab-green-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-audittab-green focus:border-audittab-green transition-all"
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
                  <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-audittab-green-500" />
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-audittab-green focus:border-audittab-green transition-all"
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
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-audittab-green-500" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-audittab-green focus:border-audittab-green transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Au moins 6 caractères</p>
          </div>

          {!invitationToken && (
            <div className="bg-audittab-green-50 border border-audittab-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-audittab-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-slate-700">
                  <p className="font-medium mb-1">Inclus dans votre essai gratuit :</p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    <li>✓ 5 utilisateurs</li>
                    <li>✓ Structures illimitées</li>
                    <li>✓ Support par email</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-audittab-green to-audittab-green-600 text-white rounded-lg hover:shadow-lg hover:scale-[1.02] font-semibold transition-all disabled:bg-slate-400 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onSwitchToLogin}
            className="text-slate-600 hover:text-audittab-green text-sm transition-colors"
          >
            Déjà un compte ? <span className="font-semibold text-audittab-navy">Se connecter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
