import { Building2, CheckCircle, ClipboardList, Users, TrendingUp, Shield } from 'lucide-react';
import { useLandingPage } from './hooks';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

/**
 * Composant de la page d'accueil (Landing Page)
 * Utilise le hook useLandingPage pour la cohérence avec les autres pages
 */
export default function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  const handlers = useLandingPage(onLogin, onRegister);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 mb-2">
            <img 
              src="/public/audittab_logo-seul.png" 
              alt="AuditTab" 
              className="h-20 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
            <div className="flex gap-3">
              <button
                onClick={handlers.onLogin}
                className="px-5 py-2 text-audittab-navy hover:text-slate-900 font-medium transition-colors"
              >
                Connexion
              </button>
              <button
                onClick={handlers.onRegister}
                className="px-5 py-2 bg-audittab-navy text-white rounded-lg hover:bg-slate-700 font-medium transition-colors shadow-sm"
              >
                Inscription
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-audittab-navy mb-6">
            Simplifiez vos audits terrain
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Audittab vous permet de créer, gérer et suivre vos audits terrain en toute simplicité.
            Une solution moderne pour des équipes performantes.
          </p>
          <button
            onClick={handlers.onRegister}
            className="px-8 py-4 bg-audittab-navy text-white rounded-lg hover:bg-slate-700 font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
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
            <h3 className="text-xl font-semibold text-audittab-navy mb-3">
              Fiches personnalisées
            </h3>
            <p className="text-slate-600">
              Créez des structures de fiches sur mesure avec notre éditeur drag & drop intuitif.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <Users className="h-12 w-12 text-slate-700 mb-4" />
            <h3 className="text-xl font-semibold text-audittab-navy mb-3">
              Collaboration en équipe
            </h3>
            <p className="text-slate-600">
              Invitez vos collaborateurs et travaillez ensemble sur vos projets d'audit.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <TrendingUp className="h-12 w-12 text-slate-700 mb-4" />
            <h3 className="text-xl font-semibold text-audittab-navy mb-3">
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
              <h2 className="text-3xl font-bold text-audittab-navy mb-6">
                Tout ce dont vous avez besoin pour vos audits
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-audittab-navy">Gestion de projets</h4>
                    <p className="text-slate-600">Organisez vos audits par projet et entreprise</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-audittab-navy">Points de contrôle détaillés</h4>
                    <p className="text-slate-600">Évaluez chaque point avec photos et conformité</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-audittab-navy">Interface moderne</h4>
                    <p className="text-slate-600">Une expérience utilisateur fluide et intuitive</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-audittab-navy">Sécurité garantie</h4>
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
            onClick={handlers.onRegister}
            className="px-8 py-4 bg-white text-slate-800 rounded-lg hover:bg-slate-100 font-semibold text-lg transition-colors shadow-lg"
          >
            Démarrer maintenant
          </button>
        </div>
        
        {/* Section de prix */}
        <div id="tarifs" className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-audittab-navy mb-4">
              Des forfaits adaptés à vos besoins
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Choisissez la formule qui convient le mieux à votre entreprise et commencez à optimiser vos audits dès aujourd'hui.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Forfait Démarrage */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 transition-transform hover:scale-105">
              <div className="p-8">
                <h3 className="text-xl font-bold text-audittab-navy mb-4">Démarrage</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-audittab-navy">19€</span>
                  <span className="text-xl text-slate-600 ml-1">/mois</span>
                </div>
                <p className="text-slate-600 mb-6">Parfait pour les petites équipes qui débutent avec les audits terrain.</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">Jusqu'à 5 utilisateurs</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">10 structures de fiches</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">Stockage de 5 Go</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">Support par email</span>
                  </li>
                </ul>
              </div>
              
              <div className="px-8 pb-8">
                <button
                  onClick={handlers.onRegister}
                  className="w-full py-3 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                >
                  Commencer l'essai
                </button>
              </div>
            </div>
            
            {/* Forfait Pro */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-green-500 transform scale-105">
              <div className="bg-green-500 text-white py-2 text-center font-semibold">
                RECOMMANDÉ
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-audittab-navy mb-4">Professionnel</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-audittab-navy">49€</span>
                  <span className="text-xl text-slate-600 ml-1">/mois</span>
                </div>
                <p className="text-slate-600 mb-6">Pour les équipes professionnelles avec des besoins plus avancés.</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">Jusqu'à 20 utilisateurs</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">Fiches illimitées</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">Stockage de 25 Go</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">Support prioritaire</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">Rapports avancés</span>
                  </li>
                </ul>
              </div>
              
              <div className="px-8 pb-8">
                <button
                  onClick={handlers.onRegister}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors"
                >
                  Commencer l'essai
                </button>
              </div>
            </div>
            
            {/* Forfait Entreprise */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 transition-transform hover:scale-105">
              <div className="p-8">
                <h3 className="text-xl font-bold text-audittab-navy mb-4">Entreprise</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-audittab-navy">99€</span>
                  <span className="text-xl text-slate-600 ml-1">/mois</span>
                </div>
                <p className="text-slate-600 mb-6">Solution complète pour les grandes entreprises avec des besoins spécifiques.</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">Utilisateurs illimités</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">Fiches illimitées</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">Stockage de 100 Go</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">Support dédié 24/7</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">API & intégrations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">Personnalisation avancée</span>
                  </li>
                </ul>
              </div>
              
              <div className="px-8 pb-8">
                <button
                  onClick={handlers.onRegister}
                  className="w-full py-3 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                >
                  Contacter les ventes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-8 w-8 text-white" />
                <span className="text-2xl font-bold">Audittab</span>
              </div>
              <p className="text-slate-300 mb-6">
                La solution moderne pour simplifier vos audits terrain et améliorer la qualité de vos contrôles.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-300 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-slate-300 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-slate-300 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-slate-300 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Produit</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-white">Fonctionnalités</a></li>
                <li><a href="#tarifs" className="text-slate-300 hover:text-white">Tarifs</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white">Témoignages</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Ressources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-white">Centre d'aide</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white">Partenaires</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Légal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-white">Conditions d'utilisation</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white">Politique de confidentialité</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white">Mentions légales</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white">RGPD</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Audittab. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
