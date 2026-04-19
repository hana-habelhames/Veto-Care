export type Animal = {
  id: string;
  name: string;
  species: string;
  breed?: string;
  sex?: "M" | "F";
  birthDate?: string;
  insured?: boolean;
  sterilized?: boolean;
  age?: string;
};

export type ClientProfile = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  animals: Animal[];
};

export type Vet = {
  id: string;
  name: string;
  clinic: string;
  city: string;
  address?: string;
  phone: string;
  emergency24: boolean;
  homeVisit?: boolean;
  walkIn?: boolean;
  referral?: boolean;
  nac?: boolean;
  open?: boolean;
  rating?: number;
  reviews?: number;
};

// Cliniques disponibles pour la prise de RDV
export const CLINICS: Vet[] = [
  { id: "v1", name: "Dr. Camille Royer", clinic: "Clinique du Parc", city: "Lyon", address: "12 rue du Parc, 69006 Lyon", phone: "+33 4 78 12 34 56", emergency24: true, homeVisit: true, walkIn: true, nac: false, open: true, rating: 4.8, reviews: 213 },
  { id: "v2", name: "Dr. Antoine Mercier", clinic: "Cabinet Veto-Santé", city: "Villeurbanne", address: "8 av. de la République, 69100 Villeurbanne", phone: "+33 4 78 98 76 54", emergency24: false, homeVisit: false, walkIn: true, nac: true, open: true, rating: 4.6, reviews: 142 },
  { id: "v3", name: "Dr. Léa Fontaine", clinic: "Clinique des Brotteaux", city: "Lyon", address: "23 cours Vitton, 69006 Lyon", phone: "+33 4 72 11 22 33", emergency24: true, homeVisit: false, referral: true, nac: false, open: true, rating: 4.9, reviews: 318 },
  { id: "v4", name: "Dr. Marc Dubreuil", clinic: "Veto Express 24h", city: "Caluire", address: "5 rue de la Gare, 69300 Caluire", phone: "+33 4 78 55 66 77", emergency24: true, homeVisit: true, walkIn: true, open: false, rating: 4.4, reviews: 87 },
  { id: "v5", name: "Dr. Sophie Lambert", clinic: "Cabinet des Acacias", city: "Bron", address: "44 rue des Acacias, 69500 Bron", phone: "+33 4 78 44 33 22", emergency24: false, homeVisit: true, nac: true, open: true, rating: 4.7, reviews: 96 },
];

export const ARTICLES = [
  { id: "a1", title: "Comment brosser les dents de son chien ?", category: "Hygiène", read: "4 min" },
  { id: "a2", title: "Les vaccins obligatoires", category: "Prévention", read: "6 min" },
  { id: "a3", title: "Alimentation senior", category: "Nutrition", read: "5 min" },
  { id: "a4", title: "Reconnaître les signes de douleur", category: "Santé", read: "3 min" },
  { id: "a5", title: "Préparer un voyage avec son chat", category: "Conseils", read: "7 min" },
  { id: "a6", title: "Lutter contre les puces et tiques", category: "Prévention", read: "4 min" },
];

export const SOINS = [
  ["Cardiologie", "Chirurgie", "Ophtalmologie"],
  ["Dermatologie", "Orthopédie", "Dentisterie"],
  ["Neurologie", "Oncologie", "Imagerie"],
];

export const CONSEILS = {
  Chats: ["Alimentation du chat", "Hygiène et toilettage", "Santé du chaton"],
  Chiens: ["Éduquer son chiot", "Nutrition du chien", "Promenades & sport"],
  NAC: ["Lapins & rongeurs", "Reptiles", "Oiseaux de compagnie"],
  Races: ["Chats de race", "Chiens de race", "Tests génétiques"],
};
