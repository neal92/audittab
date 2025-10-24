// Interface pour les données des utilisateurs
export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  company: string;
  project: string;
  created_at: string;
}

// Données mockées pour les utilisateurs
export const MOCK_USERS: Profile[] = [
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
