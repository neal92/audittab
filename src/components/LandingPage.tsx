import { Building2, CheckCircle, ClipboardList, Users, TrendingUp, Shield } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

export default function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-slate-700" />
              <span className="text-2xl font-bold text-slate-800">Audittab</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onLogin}
                className="px-5 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                Connexion
              </button>
              <button
                onClick={onRegister}
                className="px-5 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-medium transition-colors shadow-sm"
              >
                Inscription
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Simplifiez vos audits terrain
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Audittab vous permet de créer, gérer et suivre vos audits terrain en toute simplicité.
            Une solution moderne pour des équipes performantes.
          </p>
          <button
            onClick={onRegister}
            className="px-8 py-4 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Commencer gratuitement
          </button>
          <p className="text-sm text-slate-500 mt-3">Essai gratuit de 15 jours, sans carte bancaire</p>
        </div>

        <div className="mb-20">
          <img
            src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Équipe d'audit terrain"
            className="w-full h-96 object-cover rounded-2xl shadow-2xl"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <ClipboardList className="h-12 w-12 text-slate-700 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Fiches personnalisées
            </h3>
            <p className="text-slate-600">
              Créez des structures de fiches sur mesure avec notre éditeur drag & drop intuitif.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Users className="h-12 w-12 text-slate-700 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Collaboration en équipe
            </h3>
            <p className="text-slate-600">
              Invitez vos collaborateurs et travaillez ensemble sur vos projets d'audit.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <TrendingUp className="h-12 w-12 text-slate-700 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Suivi en temps réel
            </h3>
            <p className="text-slate-600">
              Suivez l'avancement de vos audits et exportez vos données facilement.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Tout ce dont vous avez besoin pour vos audits
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Gestion de projets</h4>
                    <p className="text-slate-600">Organisez vos audits par projet et entreprise</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Points de contrôle détaillés</h4>
                    <p className="text-slate-600">Évaluez chaque point avec photos et conformité</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Interface moderne</h4>
                    <p className="text-slate-600">Une expérience utilisateur fluide et intuitive</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Sécurité garantie</h4>
                    <p className="text-slate-600">Vos données sont protégées et sécurisées</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Audit en cours"
                className="rounded-xl shadow-lg w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="text-center bg-slate-800 text-white rounded-2xl p-12 shadow-xl">
          <Shield className="h-16 w-16 mx-auto mb-6 text-slate-300" />
          <h2 className="text-3xl font-bold mb-4">
            Prêt à transformer vos audits terrain ?
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez les entreprises qui font confiance à Audittab pour leurs audits.
          </p>
          <button
            onClick={onRegister}
            className="px-8 py-4 bg-white text-slate-800 rounded-lg hover:bg-slate-100 font-semibold text-lg transition-colors shadow-lg"
          >
            Démarrer maintenant
          </button>
        </div>
      </div>

      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600">
            <p>&copy; 2025 Audittab. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
