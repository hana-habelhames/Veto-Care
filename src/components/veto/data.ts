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

// Cliniques vétérinaires en Algérie (mock data)
export const CLINICS: Vet[] = [
  { id: "dz1", name: "Dr. Karim Benali", clinic: "Clinique Vétérinaire El Biar", city: "Alger", address: "23 rue Mohamed Hadj Ahmed, El Biar, 16000 Alger", phone: "+213 21 92 14 56", emergency24: true, homeVisit: true, walkIn: true, nac: false, open: true, rating: 4.8, reviews: 187 },
  { id: "dz2", name: "Dr. Amina Cherif", clinic: "Cabinet Vétérinaire Draria", city: "Draria", address: "Cité 1000 logements, Draria, 16003 Alger", phone: "+213 23 31 22 89", emergency24: false, homeVisit: true, walkIn: true, nac: true, open: true, rating: 4.6, reviews: 124 },
  { id: "dz3", name: "Dr. Yacine Boudiaf", clinic: "Clinique Animale Hydra", city: "Alger", address: "12 chemin des Crêtes, Hydra, 16035 Alger", phone: "+213 21 60 78 90", emergency24: true, homeVisit: false, referral: true, nac: false, open: true, rating: 4.9, reviews: 256 },
  { id: "dz4", name: "Dr. Nadia Mahfoud", clinic: "Vét'Oran 24h", city: "Oran", address: "Boulevard Millenium, USTO, 31000 Oran", phone: "+213 41 58 33 21", emergency24: true, homeVisit: true, walkIn: true, open: true, rating: 4.7, reviews: 198 },
  { id: "dz5", name: "Dr. Sofiane Khaled", clinic: "Cabinet Vet Bab Ezzouar", city: "Bab Ezzouar", address: "Cité AADL, Bab Ezzouar, 16311 Alger", phone: "+213 21 24 67 12", emergency24: false, homeVisit: false, nac: true, open: true, rating: 4.5, reviews: 89 },
  { id: "dz6", name: "Dr. Leila Saidi", clinic: "Clinique Vétérinaire Constantine", city: "Constantine", address: "Avenue Aouati Mostefa, 25000 Constantine", phone: "+213 31 92 45 78", emergency24: true, homeVisit: false, walkIn: true, referral: true, open: true, rating: 4.8, reviews: 167 },
  { id: "dz7", name: "Dr. Mounir Tlemçani", clinic: "Vétérinaire Annaba", city: "Annaba", address: "12 boulevard du 1er Novembre, 23000 Annaba", phone: "+213 38 86 21 34", emergency24: false, homeVisit: true, walkIn: false, nac: true, open: true, rating: 4.4, reviews: 76 },
  { id: "dz8", name: "Dr. Samira Ouali", clinic: "Clinique Animale Sétif", city: "Sétif", address: "Cité El Hidhab, 19000 Sétif", phone: "+213 36 84 12 90", emergency24: true, homeVisit: true, walkIn: true, open: true, rating: 4.7, reviews: 142 },
  { id: "dz9", name: "Dr. Reda Hammoudi", clinic: "Vet Care Tizi Ouzou", city: "Tizi Ouzou", address: "Nouvelle ville, 15000 Tizi Ouzou", phone: "+213 26 21 78 45", emergency24: false, homeVisit: false, walkIn: true, nac: true, open: false, rating: 4.3, reviews: 64 },
  { id: "dz10", name: "Dr. Fatima Zerouki", clinic: "Clinique Vet Blida", city: "Blida", address: "Boulevard Larbi Tebessi, 09000 Blida", phone: "+213 25 41 67 23", emergency24: true, homeVisit: true, referral: true, open: true, rating: 4.9, reviews: 203 },
  { id: "dz11", name: "Dr. Hicham Benali", clinic: "Cabinet Vet Bejaia", city: "Bejaia", address: "Route de l'Université, 06000 Bejaia", phone: "+213 34 22 91 56", emergency24: false, homeVisit: false, walkIn: true, nac: false, open: true, rating: 4.5, reviews: 98 },
  { id: "dz12", name: "Dr. Karima Belkacem", clinic: "Clinique Bab El Oued", city: "Alger", address: "Rue Mohamed Belouizdad, Bab El Oued, 16016 Alger", phone: "+213 21 96 34 78", emergency24: true, homeVisit: true, walkIn: true, nac: true, open: true, rating: 4.6, reviews: 156 },
];

export type Article = {
  id: string;
  title: string;
  category: string;
  read: string;
  excerpt: string;
  image: string;
  paragraphs: { heading: string; body: string }[];
  summary: string;
};

export const ARTICLES: Article[] = [
  {
    id: "a1",
    title: "Comment brosser les dents de son chien ?",
    category: "Hygiène",
    read: "4 min",
    excerpt: "Une routine simple pour préserver la santé bucco-dentaire de votre compagnon et éviter le tartre.",
    image: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=1200&q=80",
    paragraphs: [
      { heading: "Pourquoi c'est essentiel", body: "Plus de 80% des chiens de plus de 3 ans souffrent de problèmes dentaires. Le tartre cause mauvaise haleine, inflammation des gencives, et peut entraîner des infections graves touchant le cœur ou les reins." },
      { heading: "Le matériel nécessaire", body: "Procurez-vous une brosse à dents adaptée (à doigt ou à long manche) et un dentifrice spécial chien. N'utilisez JAMAIS de dentifrice humain : le fluor est toxique pour les animaux." },
      { heading: "La technique étape par étape", body: "Habituez progressivement votre chien : laissez-le d'abord goûter le dentifrice, puis touchez ses dents avec votre doigt. Brossez ensuite par petits mouvements circulaires en commençant par les incisives, puis les molaires. Concentrez-vous sur la face externe des dents." },
      { heading: "À quelle fréquence", body: "L'idéal est un brossage quotidien, mais 2 à 3 fois par semaine suffisent à prévenir le tartre. Complétez avec des lamelles dentaires et un détartrage annuel chez le vétérinaire." },
    ],
    summary: "Un brossage régulier dès le plus jeune âge évite des soins coûteux et douloureux. 5 minutes par jour pour ajouter des années de qualité de vie à votre chien.",
  },
  {
    id: "a2",
    title: "Les vaccins obligatoires de votre animal",
    category: "Prévention",
    read: "6 min",
    excerpt: "Tour d'horizon complet du calendrier vaccinal et des protocoles à respecter pour chiens et chats.",
    image: "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=1200&q=80",
    paragraphs: [
      { heading: "Les vaccins essentiels du chien", body: "Maladie de Carré, Hépatite, Parvovirose et Leptospirose forment le socle CHPL. La vaccination antirabique est obligatoire pour les voyages à l'étranger et fortement recommandée." },
      { heading: "Les vaccins essentiels du chat", body: "Le typhus et le coryza sont incontournables. Pour les chats sortant, ajoutez la leucose féline (FeLV). La rage est obligatoire pour les déplacements internationaux." },
      { heading: "Le calendrier vaccinal", body: "Première injection vers 8 semaines, rappel 4 semaines plus tard, puis rappel à 1 an. Ensuite : rappels annuels ou triennaux selon le vaccin et le mode de vie." },
      { heading: "Les vaccins facultatifs", body: "Selon la région et les risques : maladie de Lyme (zones à tiques), piroplasmose, toux du chenil pour les chiens fréquentant pensions ou parcs canins." },
    ],
    summary: "Un protocole vaccinal adapté à votre animal est la meilleure protection contre des maladies souvent mortelles. Discutez du calendrier idéal avec votre vétérinaire.",
  },
  {
    id: "a3",
    title: "Alimentation senior : adapter les besoins",
    category: "Nutrition",
    read: "5 min",
    excerpt: "À partir de 7 ans, le métabolisme change. Voici comment ajuster les repas de votre animal vieillissant.",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&q=80",
    paragraphs: [
      { heading: "Quand commencer", body: "Un animal est considéré senior à partir de 7-8 ans pour les chiens de petite taille, dès 5-6 ans pour les grands chiens. Pour le chat, la transition s'opère vers 10 ans." },
      { heading: "Les besoins qui évoluent", body: "Diminution de l'activité = besoins caloriques réduits de 20%. En revanche, les besoins en protéines de qualité augmentent pour préserver la masse musculaire." },
      { heading: "Que privilégier", body: "Croquettes ou pâtées formulées 'senior', riches en oméga-3 (santé articulaire), antioxydants (vitalité cellulaire), et avec une teneur réduite en phosphore (protection rénale)." },
      { heading: "Les pièges à éviter", body: "Ne réduisez pas drastiquement les portions : surveillez le poids hebdomadairement. Hydratez davantage (favorisez la pâtée). Adaptez la texture si dents fragilisées." },
    ],
    summary: "L'âge n'est pas une maladie : avec une alimentation pensée pour les seniors, votre compagnon peut vivre des années heureuses et en pleine forme.",
  },
  {
    id: "a4",
    title: "Reconnaître les signes de douleur",
    category: "Santé",
    read: "3 min",
    excerpt: "Les animaux masquent souvent leur douleur par instinct de survie. Apprenez à détecter les signaux discrets.",
    image: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=1200&q=80",
    paragraphs: [
      { heading: "Les changements de comportement", body: "Animal qui s'isole, devient agressif, refuse les caresses, gémit la nuit, ou au contraire devient anormalement collant : tous ces signes doivent alerter." },
      { heading: "Les signes physiques", body: "Boiterie, posture voûtée, refus de sauter ou monter les escaliers, halètement excessif au repos, tremblements, pupilles dilatées, baisse d'appétit." },
      { heading: "Les signes spécifiques au chat", body: "Le chat masque davantage : surveillez le toilettage excessif d'une zone, le regard fixe, l'arrêt du ronronnement, ou l'évitement de la litière." },
      { heading: "Quand consulter en urgence", body: "Toute douleur aiguë soudaine, refus total de s'alimenter pendant 24h, vocalises de souffrance, plaie ouverte ou impossibilité de se déplacer doivent mener chez le véto immédiatement." },
    ],
    summary: "Faites confiance à votre intuition : vous connaissez votre animal mieux que personne. Au moindre doute, une consultation vaut mieux qu'une attente risquée.",
  },
  {
    id: "a5",
    title: "Préparer un voyage avec son chat",
    category: "Conseils",
    read: "7 min",
    excerpt: "Voyager avec un chat demande de l'anticipation. Tous nos conseils pour un trajet sans stress.",
    image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=1200&q=80",
    paragraphs: [
      { heading: "Le choix de la caisse", body: "Optez pour une caisse de transport rigide, suffisamment grande pour que le chat puisse se tenir debout et se retourner. Habituez-le plusieurs semaines avant en la laissant ouverte avec une couverture familière." },
      { heading: "Avant le départ", body: "Visite vétérinaire pour vérifier l'aptitude au voyage. Mise à jour des vaccins, vermifuge, traitement antiparasitaire. Prévoyez carnet de santé et passeport européen si voyage international." },
      { heading: "Pendant le trajet", body: "Évitez de le nourrir 4h avant le départ pour limiter le mal des transports. Couvrez partiellement la caisse avec un linge pour le rassurer. Diffuseur de phéromones (Feliway) très efficace." },
      { heading: "À l'arrivée", body: "Installez-le d'abord dans une seule pièce calme avec litière, eau et nourriture. Laissez-le explorer le reste du logement à son rythme sur 2-3 jours." },
    ],
    summary: "Avec une bonne préparation, voyager avec un chat est tout à fait possible. La clé : anticiper, rassurer et respecter son rythme d'adaptation.",
  },
  {
    id: "a6",
    title: "Lutter contre les puces et tiques",
    category: "Prévention",
    read: "4 min",
    excerpt: "Ces parasites externes sont une menace pour la santé. Voici les bonnes pratiques de prévention.",
    image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=1200&q=80",
    paragraphs: [
      { heading: "Les risques pour votre animal", body: "Au-delà des démangeaisons, puces et tiques transmettent des maladies graves : piroplasmose, maladie de Lyme, ehrlichiose, allergie aux piqûres de puces." },
      { heading: "Les solutions de protection", body: "Pipettes spot-on (1 mois), comprimés oraux (1 à 3 mois), colliers longue durée (8 mois). Demandez conseil à votre vétérinaire pour le produit adapté à votre animal et à son mode de vie." },
      { heading: "Le traitement de l'environnement", body: "95% des puces vivent dans l'environnement (tapis, paniers, fissures). Aspirez fréquemment, lavez les couchages à 60°C, traitez la maison avec un spray adapté en cas d'infestation." },
      { heading: "Comment retirer une tique", body: "Utilisez un crochet à tiques (jamais les doigts ou de l'éther). Tournez doucement sans tirer. Désinfectez la zone. Surveillez pendant 3 semaines : tout symptôme nécessite une consultation." },
    ],
    summary: "Une prévention toute l'année est plus efficace et moins coûteuse qu'un traitement curatif. Protégez votre animal et votre foyer.",
  },
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
