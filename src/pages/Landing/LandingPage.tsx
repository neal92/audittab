import { CheckCircle, ClipboardList, Users, TrendingUp, Shield, Sparkles, Zap, Lock, BarChart3, Globe, Smartphone, Mail, Phone, MapPin, Send } from 'lucide-react';
import { useLandingPage } from './hooks';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}


export default function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  const handlers = useLandingPage(onLogin, onRegister);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-audittab-green-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <img 
              src="/public/audittab_logo-seul.png" 
              alt="AuditTab" 
              className="h-16 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          
          {/* Menu de navigation */}
          <div className="hidden md:flex items-center gap-8">

            <a href="#qui-sommes-nous" className="text-slate-700 hover:text-audittab-green font-medium transition-colors">
              Qui sommes-nous
            </a>
            <a href="#fonctionnalites" className="text-slate-700 hover:text-audittab-green font-medium transition-colors">
              Fonctionnalités
            </a>
            <a href="#tarifs" className="text-slate-700 hover:text-audittab-green font-medium transition-colors">
              Tarifs
            </a>
            <a href="#partenaires" className="text-slate-700 hover:text-audittab-green font-medium transition-colors">
              Partenaires
            </a>
            <a href="#contact" className="text-slate-700 hover:text-audittab-green font-medium transition-colors">
              Contact
            </a>
          </div>
          
            <div className="flex gap-3">
              <button
                onClick={handlers.onLogin}
                className="px-5 py-2 text-audittab-navy hover:text-audittab-green-600 font-medium transition-colors"
              >
                Connexion
              </button>
              <button
                onClick={handlers.onRegister}
                className="px-5 py-2 bg-gradient-to-r from-audittab-green to-audittab-green-600 text-white rounded-lg hover:shadow-lg hover:scale-105 font-medium transition-all shadow-sm"
              >
                Inscription
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section avec animation */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-audittab-green-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-audittab-green-50 border border-audittab-green-200 rounded-full text-audittab-green-700 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Nouveau : Essai gratuit de 15 jours</span>
            </div>
            
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-audittab-navy to-audittab-green mb-6 leading-tight">
              Simplifiez vos audits terrain
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Audittab vous permet de créer, gérer et suivre vos audits terrain en toute simplicité.
              Une solution moderne pour des équipes performantes.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={handlers.onRegister}
                className="px-8 py-4 bg-gradient-to-r from-audittab-green to-audittab-green-600 text-white rounded-lg hover:shadow-2xl hover:scale-105 font-semibold text-lg transition-all shadow-lg flex items-center gap-2"
              >
                Commencer gratuitement
                <Zap className="h-5 w-5" />
              </button>
              <button
                onClick={handlers.onLogin}
                className="px-8 py-4 bg-white text-audittab-navy rounded-lg hover:shadow-lg font-semibold text-lg transition-all border-2 border-slate-200"
              >
                Voir une démo
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-4 flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Aucune carte bancaire requise
            </p>
          </div>
        </div>

        {/* Screenshot avec effet 3D */}
        <div className="mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-audittab-green-400 to-audittab-navy rounded-2xl blur-xl opacity-20 transform scale-105"></div>
          <img
            src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Équipe d'audit terrain"
            className="relative w-full h-96 object-cover rounded-2xl shadow-2xl border-4 border-white transform hover:scale-[1.02] transition-transform duration-300"
          />
        </div>

                {/* Section Qui sommes-nous */}
        <div id="qui-sommes-nous" className="py-20 bg-gradient-to-br from-audittab-navy-50 to-white rounded-3xl mb-20 px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-audittab-navy to-audittab-green mb-4">
                Qui sommes-nous ?
              </h2>
              <p className="text-lg text-slate-600">
                Une équipe passionnée au service de vos audits terrain
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
              <div>
                <h3 className="text-2xl font-bold text-audittab-navy mb-4">Notre mission</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  Depuis plus de 15 ans, Coppelis développe des solutions logicielles innovantes pour les entreprises. Notre expertise 
                  en gestion d’interventions terrain et en contrôle qualité nous a permis de bâtir une réputation d’excellence et de 
                  fiabilité.
                  Aujourd’hui, nous mettons notre savoir-faire au service d’un nouveau défi : devenir un acteur majeur de l’IA 
                  souveraine en France et en Europe.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Notre vision : une intelligence artificielle respectueuse des valeurs européennes, transparente et au service de la 
                  performance économique.
                  Grâce à l’intégration de l’Intelligence Artificielle, bénéficiez d’une automatisation avancée, d’analyses 
                  prédictives et d’une efficacité inégalée.
                </p>
 
              

              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-audittab-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-audittab-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-audittab-navy mb-1">Équipe dédiée</h4>
                    <p className="text-sm text-slate-600">15 experts passionnés à votre service</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-audittab-navy-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="h-6 w-6 text-audittab-navy-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-audittab-navy mb-1">Présence nationale</h4>
                    <p className="text-sm text-slate-600">Basés en France, accompagnement local</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-audittab-navy mb-1">Conformité RGPD</h4>
                    <p className="text-sm text-slate-600">Vos données sécurisées et conformes</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-audittab-navy mb-6 text-center">Nos valeurs</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-audittab-green to-audittab-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-audittab-navy mb-2">Innovation</h4>
                  <p className="text-sm text-slate-600">Toujours à la pointe de la technologie</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-audittab-navy to-audittab-navy-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-audittab-navy mb-2">Simplicité</h4>
                  <p className="text-sm text-slate-600">Des outils intuitifs et efficaces</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-audittab-navy mb-2">Proximité</h4>
                  <p className="text-sm text-slate-600">À l'écoute de vos besoins</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="text-center">
            <div className="text-4xl font-bold text-audittab-green mb-2">10k+</div>
            <div className="text-slate-600">Audits réalisés</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-audittab-green mb-2">98%</div>
            <div className="text-slate-600">Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-audittab-green mb-2">24/7</div>
            <div className="text-slate-600">Support disponible</div>
          </div>
        </div>

        {/* Features Cards avec hover effects */}
        <div id="fonctionnalites" className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-audittab-green-200 group">
            <div className="w-14 h-14 bg-gradient-to-br from-audittab-green-100 to-audittab-green-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ClipboardList className="h-7 w-7 text-audittab-green-700" />
            </div>
            <h3 className="text-xl font-semibold text-audittab-navy mb-3">
              Fiches personnalisées
            </h3>
            <p className="text-slate-600">
              Créez des structures de fiches sur mesure avec notre éditeur drag & drop intuitif.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-audittab-green-200 group">
            <div className="w-14 h-14 bg-gradient-to-br from-audittab-navy-100 to-audittab-navy-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="h-7 w-7 text-audittab-navy-700" />
            </div>
            <h3 className="text-xl font-semibold text-audittab-navy mb-3">
              Collaboration en équipe
            </h3>
            <p className="text-slate-600">
              Invitez vos collaborateurs et travaillez ensemble sur vos projets d'audit.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-audittab-green-200 group">
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-7 w-7 text-green-700" />
            </div>
            <h3 className="text-xl font-semibold text-audittab-navy mb-3">
              Suivi en temps réel
            </h3>
            <p className="text-slate-600">
              Suivez l'avancement de vos audits et exportez vos données facilement.
            </p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gradient-to-br from-audittab-green-50 to-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all border border-audittab-green-100">
            <Smartphone className="h-10 w-10 text-audittab-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-audittab-navy mb-2">
              Mobile-First
            </h3>
            <p className="text-slate-600 text-sm">
              Utilisez Audittab sur tous vos appareils, en ligne ou hors ligne
            </p>
          </div>

          <div className="bg-gradient-to-br from-audittab-navy-50 to-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all border border-audittab-navy-100">
            <Lock className="h-10 w-10 text-audittab-navy-600 mb-4" />
            <h3 className="text-lg font-semibold text-audittab-navy mb-2">
              Sécurité maximale
            </h3>
            <p className="text-slate-600 text-sm">
              Vos données sont chiffrées et hébergées en Europe (RGPD)
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all border border-green-100">
            <BarChart3 className="h-10 w-10 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-audittab-navy mb-2">
              Rapports détaillés
            </h3>
            <p className="text-slate-600 text-sm">
              Générez des rapports PDF professionnels en un clic
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 mb-20 border border-slate-100">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-audittab-green-100 rounded-full text-audittab-green-700 text-sm font-medium mb-4">
                <Shield className="h-4 w-4" />
                <span>Tout-en-un</span>
              </div>
              <h2 className="text-3xl font-bold text-audittab-navy mb-6">
                Tout ce dont vous avez besoin pour vos audits
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-audittab-green-50 hover:bg-audittab-green-100 transition-colors">
                  <CheckCircle className="h-6 w-6 text-audittab-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-audittab-navy">Gestion de projets</h4>
                    <p className="text-slate-600">Organisez vos audits par projet et entreprise</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-audittab-navy-50 hover:bg-audittab-navy-100 transition-colors">
                  <CheckCircle className="h-6 w-6 text-audittab-navy-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-audittab-navy">Points de contrôle détaillés</h4>
                    <p className="text-slate-600">Évaluez chaque point avec photos et conformité</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-audittab-navy">Interface moderne</h4>
                    <p className="text-slate-600">Une expérience utilisateur fluide et intuitive</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                  <CheckCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-audittab-navy">Sécurité garantie</h4>
                    <p className="text-slate-600">Vos données sont protégées et sécurisées</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-audittab-green-200 to-audittab-navy-200 rounded-xl blur-2xl opacity-30"></div>
              <img
                src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Audit en cours"
                className="relative rounded-xl shadow-2xl w-full h-full object-cover border-4 border-white"
              />
            </div>
          </div>
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
            <div className="bg-gradient-to-br from-audittab-green-50 to-white rounded-xl shadow-2xl overflow-hidden border-2 border-audittab-green-500 transform scale-105 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-audittab-green-200 rounded-full blur-3xl opacity-50"></div>
              <div className="bg-gradient-to-r from-audittab-green to-audittab-green-600 text-white py-2 text-center font-semibold flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" />
                RECOMMANDÉ
              </div>
              <div className="p-8 relative">
                <h3 className="text-xl font-bold text-audittab-navy mb-4">Professionnel</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-audittab-green">49€</span>
                  <span className="text-xl text-slate-600 ml-1">/mois</span>
                </div>
                <p className="text-slate-600 mb-6">Pour les équipes professionnelles avec des besoins plus avancés.</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-audittab-green-600 flex-shrink-0" />
                    <span className="text-slate-700">Jusqu'à 20 utilisateurs</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-audittab-green-600 flex-shrink-0" />
                    <span className="text-slate-700">Fiches illimitées</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-audittab-green-600 flex-shrink-0" />
                    <span className="text-slate-700">Stockage de 25 Go</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-audittab-green-600 flex-shrink-0" />
                    <span className="text-slate-700">Support prioritaire</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-audittab-green-600 flex-shrink-0" />
                    <span className="text-slate-700">Rapports avancés</span>
                  </li>
                </ul>
              </div>
              
              <div className="px-8 pb-8">
                <button
                  onClick={handlers.onRegister}
                  className="w-full py-3 bg-gradient-to-r from-audittab-green to-audittab-green-600 text-white rounded-lg hover:shadow-lg hover:scale-105 font-medium transition-all"
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
                  Contacter nos commerciaux
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section Nos Partenaires */}
        <div id="partenaires" className="py-20 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-audittab-navy to-audittab-green mb-4">
              Nos partenaires
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Ils nous font confiance pour améliorer leurs processus d'audit
            </p>
          </div>

          <div className="bg-gradient-to-br from-white to-audittab-green-50 rounded-3xl shadow-xl p-12 border border-audittab-green-100">
            {/* Logos des partenaires */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
              {/* Orange Logo */}
              <div className="flex items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <img
                  src="/public/Orange_logo.svg.png"
                  alt="Orange"
                  className="h-16 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* axione */}
              <div className="flex items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <img
                  src="/public/images.jpg"
                  alt="axione"
                  className="h-16 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* THD Bretagne */}
              <div className="flex items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <img
                  src="/public/thd bretagne logo.jpg"
                  alt="THD Bretagne"
                  className="h-16 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Zayo Group */}
              <div className="flex items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <img
                  src="/public/Zayo_Group_logo.png"
                  alt="Zayo Group"
                  className="h-16 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Images */}
              <div className="flex items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <img
                  src="/public/orange concession.png"
                  alt="Partenaire"
                  className="h-17 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Témoignages partenaires */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src="/public/Orange_logo.svg.png"
                      alt="Orange"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-audittab-navy">Responsable Qualité</p>
                    <p className="text-sm text-slate-600">Orange</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm italic">
                  "Audittab a transformé notre façon de gérer les audits terrain. Un gain de temps considérable !"
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src="/public/thd bretagne logo.jpg"
                      alt="THD Bretagne"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-audittab-navy">Directeur Technique</p>
                    <p className="text-sm text-slate-600">THD Bretagne</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm italic">
                  "Une solution complète et intuitive. Nos équipes l'ont adoptée immédiatement."
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src="/public/Zayo_Group_logo.png"
                      alt="Zayo Group"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-audittab-navy">Manager Opérations</p>
                    <p className="text-sm text-slate-600">Zayo Group</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm italic">
                  "Le meilleur outil d'audit que nous ayons utilisé. Support client exceptionnel !"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section with gradient */}
        <div className="text-center bg-gradient-to-r from-audittab-navy to-audittab-navy-700 text-white rounded-2xl p-12 shadow-xl mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-audittab-green opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-audittab-green-400 opacity-10 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <Shield className="h-16 w-16 mx-auto mb-6 text-audittab-green-300" />
            <h2 className="text-4xl font-bold mb-4">
              Prêt à transformer vos audits terrain ?
            </h2>
            <p className="text-slate-200 text-lg mb-8 max-w-2xl mx-auto">
              Rejoignez les 500+ entreprises qui font confiance à Audittab pour leurs audits.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={handlers.onRegister}
                className="px-8 py-4 bg-audittab-green text-white rounded-lg hover:bg-audittab-green-600 hover:scale-105 font-semibold text-lg transition-all shadow-lg flex items-center gap-2"
              >
                Démarrer maintenant
                <Sparkles className="h-5 w-5" />
              </button>
              <button
                onClick={handlers.onLogin}
                className="px-8 py-4 bg-white text-audittab-navy rounded-lg hover:bg-slate-100 font-semibold text-lg transition-all shadow-lg"
              >
                Planifier une démo
              </button>
            </div>
          </div>
        </div>
      
        
        {/* Section Contact */}
        <div id="contact" className="py-20 mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-audittab-navy to-audittab-green mb-4">
                Contactez-nous
              </h2>
              <p className="text-lg text-slate-600">
                Une question ? Notre équipe est là pour vous répondre
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">

              {/* Formulaire de contact */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                <h3 className="text-xl font-bold text-audittab-navy mb-6">Envoyez-nous un message</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-audittab-green focus:border-audittab-green transition-all"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-audittab-green focus:border-audittab-green transition-all"
                      placeholder="votre@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Entreprise
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-audittab-green focus:border-audittab-green transition-all"
                      placeholder="Votre entreprise"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-audittab-green focus:border-audittab-green transition-all resize-none"
                      placeholder="Décrivez votre besoin..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-audittab-green to-audittab-green-600 text-white rounded-lg hover:shadow-lg hover:scale-[1.02] font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    Envoyer le message
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>

              {/* Informations de contact */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-audittab-green-50 to-white rounded-2xl shadow-lg p-8 border border-audittab-green-100">
                  <h3 className="text-xl font-bold text-audittab-navy mb-6">Nos coordonnées</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-audittab-green rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-audittab-navy mb-1">Email</h4>
                        <a href="mailto:contact@audittab.com" className="text-slate-600 hover:text-audittab-green transition-colors">
                          contact@audittab.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-audittab-navy rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-audittab-navy mb-1">Téléphone</h4>
                        <a href="tel:+33123456789" className="text-slate-600 hover:text-audittab-green transition-colors">
                          +33 1 23 45 67 89
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-audittab-navy mb-1">Adresse</h4>
                        <p className="text-slate-600">
                          123 Avenue de l'Innovation<br />
                          75001 Paris, France
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-audittab-navy-50 to-white rounded-2xl shadow-lg p-8 border border-audittab-navy-100">
                  <h3 className="text-xl font-bold text-audittab-navy mb-4">Horaires d'ouverture</h3>
                  <div className="space-y-2 text-slate-600">
                    <div className="flex justify-between">
                      <span className="font-medium">Lundi - Vendredi</span>
                      <span>9h00 - 18h30</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Samedi</span>
                      <span>Fermé</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Dimanche</span>
                      <span>Fermé</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        

      </div>

      <footer className="bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <img 
                  src="/public/audittab_logo-seul.png" 
                  alt="AuditTab" 
                  className="h-45 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
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
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Produit</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-white">Fonctionnalités</a></li>
                <li><a href="#tarifs" className="text-slate-300 hover:text-white">Tarifs</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white">FAQ</a></li>
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
