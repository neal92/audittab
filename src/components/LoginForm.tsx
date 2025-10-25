import { useState } from 'react';
import { Building2, Mail, Lock, X, Sparkles } from 'lucide-react';
import { useMockAuth } from '../contexts/MockAuthContext';

interface LoginFormProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onClose, onSwitchToRegister }: LoginFormProps) {
  const { signIn } = useMockAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Utiliser le système d'authentification mocké
      await signIn(email, password);
      
      // Recharger la page pour accéder au dashboard
      window.location.reload();
    } catch (error) {
      setError('Une erreur est survenue lors de la connexion');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
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
            className="h-12  w-auto"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.innerHTML = '<div class="h-8 w-8 bg-gradient-to-br from-audittab-green to-audittab-navy rounded-lg"></div>';
            }}
          />
        </div>

        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-audittab-navy to-audittab-green mb-2">
          Bon retour !
        </h2>
        <p className="text-slate-600 mb-6">Connectez-vous pour accéder à votre espace d'audit</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
            <span className="font-medium">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-audittab-green-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-audittab-green focus:border-audittab-green transition-all"
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-audittab-green-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-audittab-green focus:border-audittab-green transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-audittab-green to-audittab-green-600 text-white rounded-lg hover:shadow-lg hover:scale-[1.02] font-semibold transition-all disabled:bg-slate-400 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onSwitchToRegister}
            className="text-slate-600 hover:text-audittab-green text-sm transition-colors"
          >
            Pas encore de compte ? <span className="font-semibold text-audittab-navy">S'inscrire</span>
          </button>
        </div>
      </div>
    </div>
  );
}
