/**
 * Hook personnalisé pour la page Landing
 * Cette page étant principalement statique, le hook ne gère que les props
 */
export function useLandingPage(onLogin: () => void, onRegister: () => void) {
  return {
    onLogin,
    onRegister,
  };
}
