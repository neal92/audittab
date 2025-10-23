import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';

import { useMockAuth } from './contexts/MockAuthContext';

function AppContent() {
  const { user, loading } = useMockAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [invitationToken, setInvitationToken] = useState<string | undefined>();

  useEffect(() => {
    // Vérifier si nous avons un token d'invitation dans l'URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('invitation');
    if (token) {
      setInvitationToken(token);
      setShowRegister(true);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Chargement...</div>
      </div>
    );
  }

  // Si nous avons un utilisateur, afficher le dashboard
  if (user) {
    return <Dashboard />;
  }

  return (
    <>
      <LandingPage
        onLogin={() => setShowLogin(true)}
        onRegister={() => setShowRegister(true)}
      />

      {showLogin && (
        <LoginForm
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {showRegister && (
        <RegisterForm
          onClose={() => {
            setShowRegister(false);
            setInvitationToken(undefined);
          }}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
          invitationToken={invitationToken}
        />
      )}
    </>
  );
}

import { MockAuthProvider } from './contexts/MockAuthContext';

function App() {
  return (
    <MockAuthProvider>
      <AppContent />
    </MockAuthProvider>
  );
}

export default App;
