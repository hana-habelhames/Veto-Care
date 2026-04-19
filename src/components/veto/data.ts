export type Animal = { id: string; name: string; species: string; age: string };

export type ClientProfile = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  animals: Animal[];
};

export type Vet = {
  id: string;
  name: string;
  clinic: string;
  city: string;
  phone: string;
  emergency24: boolean;
};

// Cliniques disponibles pour la prise de RDV
export const CLINICS: Vet[] = [
  { id: "v1", name: "Dr. Camille Royer", clinic: "Clinique du Parc", city: "Lyon", phone: "+33 4 78 12 34 56", emergency24: true },
  { id: "v2", name: "Dr. Antoine Mercier", clinic: "Cabinet Veto-Santé", city: "Villeurbanne", phone: "+33 4 78 98 76 54", emergency24: false },
  { id: "v3", name: "Dr. Léa Fontaine", clinic: "Clinique des Brotteaux", city: "Lyon", phone: "+33 4 72 11 22 33", emergency24: true },
  { id: "v4", name: "Dr. Marc Dubreuil", clinic: "Veto Express 24h", city: "Caluire", phone: "+33 4 78 55 66 77", emergency24: true },
  { id: "v5", name: "Dr. Sophie Lambert", clinic: "Cabinet des Acacias", city: "Bron", phone: "+33 4 78 44 33 22", emergency24: false },
];

export const ARTICLES = [
  { id: "a1", title: "Comment brosser les dents de son chien ?", category: "Hygiène", read: "4 min" },
  { id: "a2", title: "Les vaccins obligatoires", category: "Prévention", read: "6 min" },
  { id: "a3", title: "Alimentation senior", category: "Nutrition", read: "5 min" },
  { id: "a4", title: "Reconnaître les signes de douleur", category: "Santé", read: "3 min" },
  { id: "a5", title: "Préparer un voyage avec son chat", category: "Conseils", read: "7 min" },
  { id: "a6", title: "Lutter contre les puces et tiques", category: "Prévention", read: "4 min" },
];
