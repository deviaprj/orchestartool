# PHASE 3: BACKLOG AGILE & DÉLÉGATION - MARKETPLACE YOOJO CLONE
# Date: 22 janvier 2026
# Timeline: 48 heures maximum

## EPIC 1: INFRASTRUCTURE & SETUP (Priorité: P0)

### User Story 1.1: Configuration Projet
**En tant que** développeur  
**Je veux** un projet Next.js configuré avec toutes les dépendances nécessaires  
**Afin de** pouvoir développer efficacement sans perdre de temps en setup

**Critères d'acceptation:**
- Projet Next.js 14 initialisé avec TypeScript
- Tailwind CSS configuré
- Prisma ORM installé et configuré
- PostgreSQL local fonctionnel
- Variables d'environnement template créé
- Git initialisé avec .gitignore approprié

**Tâches techniques:**
1. Créer projet Next.js avec App Router
   - Agent responsable: Super Codex
   - Commande: `npx create-next-app@latest marketplace-yoojo --typescript --tailwind --app --src-dir`
   - Tests: Vérifier que `npm run dev` démarre sans erreur

2. Installer dépendances essentielles
   - Agent responsable: Super Codex
   - Packages: prisma, @prisma/client, next-auth, zod, react-hook-form, zustand, stripe
   - Commande: `npm install [packages]`

3. Configurer PostgreSQL local
   - Agent responsable: Database Architect Agent
   - Créer database: `createdb marketplace_yoojo_dev`
   - Configurer DATABASE_URL dans .env

4. Initialiser Prisma
   - Agent responsable: Database Architect Agent
   - Commande: `npx prisma init`
   - Configurer provider PostgreSQL

**Estimation:** 2 heures  
**Délégation Super Codex:** Exécuter toutes commandes, vérifier que l'environnement démarre correctement

---

### User Story 1.2: Schéma Base de Données
**En tant que** développeur backend  
**Je veux** un schéma de base de données complet et optimisé  
**Afin de** stocker toutes les données de la marketplace

**Critères d'acceptation:**
- Toutes les tables créées (Users, Profiles, Services, Bookings, Reviews, Messages, Categories)
- Relations définies correctement
- Indexes créés pour optimisation
- Seed data disponible pour tests

**Tâches techniques:**
1. Créer modèle Prisma User & Profile
   - Agent responsable: Database Architect Agent
   - Inclure: email, password, role (CLIENT/PROVIDER), verification
   - Relations: User hasOne Profile

2. Créer modèle Services & Categories
   - Agent responsable: Database Architect Agent
   - Services: title, description, category, provider, price_range, availability
   - Categories: name, icon, parent (pour sous-catégories)

3. Créer modèle Bookings
   - Agent responsable: Database Architect Agent
   - Champs: service, client, provider, date, status, price, payment_status
   - Index sur: status, date, provider_id, client_id

4. Créer modèle Reviews & Messages
   - Agent responsable: Database Architect Agent
   - Reviews: booking, rating (1-5), comment, created_at
   - Messages: sender, receiver, content, read, created_at

5. Ajouter indexes géographiques
   - Agent responsable: Database Architect Agent + Geolocation Specialist
   - Index GiST sur Profile(latitude, longitude)

6. Créer script seed data
   - Agent responsable: Database Architect Agent
   - 10 catégories (Bricolage, Jardinage, Ménage, etc.)
   - 5 users providers avec services
   - 3 users clients
   - Quelques bookings et reviews

7. Générer et exécuter migration
   - Agent responsable: Database Architect Agent
   - Commande: `npx prisma migrate dev --name init`
   - Vérifier: `npx prisma studio`

**Estimation:** 3 heures  
**Délégation Super Codex:** Implémenter selon Clean Code, utiliser enum pour status, ajouter timestamps automatiques

---

## EPIC 2: AUTHENTIFICATION & AUTORISATION (Priorité: P0)

### User Story 2.1: Inscription Utilisateur
**En tant que** visiteur  
**Je veux** créer un compte (client ou prestataire)  
**Afin de** utiliser la plateforme

**Critères d'acceptation:**
- Formulaire inscription avec email, mot de passe, rôle
- Validation côté client (Zod) et serveur
- Mot de passe hashé (bcrypt)
- Email de confirmation envoyé
- Redirection vers profil après inscription

**Tâches techniques:**
1. Créer API route POST /api/auth/register
   - Agent responsable: Backend Architect Agent
   - Validation input avec Zod
   - Hash password avec bcrypt (10 rounds)
   - Créer User + Profile dans transaction
   - Générer token verification
   - Return JWT token

2. Créer composant UI RegisterForm
   - Agent responsable: Frontend Architect Agent
   - react-hook-form + zodResolver
   - Toggle Client/Prestataire
   - Loading states + error handling
   - Design Tailwind selon Yoojo (bleu dominant)

3. Créer page /register
   - Agent responsable: Frontend Architect Agent
   - Layout centered card
   - Link vers login
   - Redirection si déjà authentifié

4. Intégrer SendGrid pour email confirmation
   - Agent responsable: Notification Agent
   - Template email de bienvenue
   - Lien verification avec token
   - Fallback si SendGrid fail (log uniquement)

**Estimation:** 3 heures  
**Délégation Super Codex:** Suivre SOLID (séparation validation, business logic, data access), gérer erreurs avec ApiError custom

---

### User Story 2.2: Connexion Utilisateur
**En tant que** utilisateur inscrit  
**Je veux** me connecter avec email/password  
**Afin d'** accéder à mon compte

**Critères d'acceptation:**
- Formulaire login fonctionnel
- Validation credentials
- JWT token stocké (httpOnly cookie)
- Redirection vers dashboard selon rôle
- Option "Se souvenir de moi"

**Tâches techniques:**
1. Créer API route POST /api/auth/login
   - Agent responsable: Backend Architect Agent
   - Valider email + password
   - Comparer hash bcrypt
   - Générer JWT (access token 15min + refresh token 7j)
   - Return tokens + user data

2. Créer composant LoginForm
   - Agent responsable: Frontend Architect Agent
   - react-hook-form validation
   - Show/hide password
   - "Mot de passe oublié?" link
   - Error messages clairs

3. Créer page /login
   - Agent responsable: Frontend Architect Agent
   - Layout similaire /register
   - OAuth buttons (Google) préparés
   - Link vers /register

4. Implémenter middleware auth
   - Agent responsable: Backend Architect Agent
   - Vérifier JWT sur routes protégées
   - Refresh token automatique si expiré
   - Return 401 si non authentifié

**Estimation:** 2.5 heures  
**Délégation Super Codex:** Utiliser NextAuth.js pour simplifier, configurer session strategy JWT, créer hook useAuth custom

---

### User Story 2.3: OAuth Google
**En tant que** utilisateur  
**Je veux** me connecter avec Google  
**Afin de** gagner du temps sans créer mot de passe

**Critères d'acceptation:**
- Bouton "Continuer avec Google" fonctionnel
- Création compte automatique si nouveau
- Redirection correcte après auth

**Tâches techniques:**
1. Configurer Google OAuth NextAuth
   - Agent responsable: Backend Architect Agent
   - Obtenir Client ID/Secret (console.cloud.google.com)
   - Configurer callback URL
   - Mapper Google profile vers User model

2. Ajouter bouton Google sur login/register
   - Agent responsable: Frontend Architect Agent
   - Icon Google officiel
   - Click trigger signIn('google')

**Estimation:** 1.5 heures  
**Délégation Super Codex:** Suivre docs NextAuth.js, gérer cas où email Google déjà existant

---

## EPIC 3: PROFILS UTILISATEURS (Priorité: P0)

### User Story 3.1: Compléter Profil
**En tant que** utilisateur connecté  
**Je veux** compléter mon profil (nom, téléphone, adresse, photo)  
**Afin que** les autres utilisateurs me connaissent

**Critères d'acceptation:**
- Formulaire profil avec tous les champs
- Upload photo avatar (max 5MB)
- Autocomplete adresse avec Maps API
- Sauvegarde profil avec feedback succès

**Tâches techniques:**
1. Créer API route PATCH /api/users/profile
   - Agent responsable: Backend Architect Agent
   - Update Profile table
   - Validation Zod (phone format, etc.)
   - Geocoding adresse pour lat/lng

2. Créer composant ProfileForm
   - Agent responsable: Frontend Architect Agent
   - Champs: firstName, lastName, phone, bio, address
   - react-hook-form avec validation
   - Avatar upload avec preview

3. Intégrer upload image Cloudinary
   - Agent responsable: Frontend Architect Agent
   - Ou upload local si Cloudinary complexe
   - Compression image avant upload
   - Display avatar dans header

4. Intégrer Google Places Autocomplete
   - Agent responsable: Geolocation Specialist
   - Component AddressInput avec autocomplete
   - Extraire lat/lng du result
   - Fallback si API quota dépassé

**Estimation:** 4 heures  
**Délégation Super Codex:** Créer composant FileUpload réutilisable, gérer upload states (idle, uploading, success, error)

---

### User Story 3.2: Visualiser Profil Public
**En tant que** client  
**Je veux** voir le profil public d'un prestataire  
**Afin de** décider si je le contacte

**Critères d'acceptation:**
- Page profil affiche: photo, nom, bio, note moyenne, avis, services proposés
- Badge "Vérifié" si identity verified
- Bouton "Contacter" et "Réserver"

**Tâches techniques:**
1. Créer API route GET /api/users/[id]/public
   - Agent responsable: Backend Architect Agent
   - Return: profile + services + reviews + stats
   - Ne pas exposer données sensibles (email, phone)
   - Calculer rating average

2. Créer page /profile/[id]
   - Agent responsable: Frontend Architect Agent
   - Layout: sidebar (photo, stats) + content (services, reviews)
   - Composant ReviewsList
   - Composant ServiceCard

3. Créer composant ProfileStats
   - Agent responsable: Frontend Architect Agent
   - Display: rating, total reviews, response time, total bookings
   - Icons et badges

**Estimation:** 3 heures  
**Délégation Super Codex:** Optimiser query avec Prisma include, créer composant StarRating réutilisable

---

## EPIC 4: SERVICES & RECHERCHE (Priorité: P0)

### User Story 4.1: Rechercher Services
**En tant que** client  
**Je veux** chercher des services par mot-clé et localisation  
**Afin de** trouver des prestataires près de chez moi

**Critères d'acceptation:**
- Homepage avec search bar proéminente (comme Yoojo)
- Filtres: catégorie, localisation, rayon, prix, note
- Résultats affichés en carte + liste
- Tri par: pertinence, distance, prix, note

**Tâches techniques:**
1. Créer API route GET /api/services/search
   - Agent responsable: Backend Architect Agent + Geolocation Specialist
   - Query params: q (keyword), lat, lng, radius, category, minPrice, maxPrice, minRating
   - Recherche full-text sur title + description
   - Calcul distance avec Haversine formula
   - Pagination (20 résultats/page)

2. Créer composant SearchBar (Homepage)
   - Agent responsable: Frontend Architect Agent
   - Input keyword + LocationInput (autocomplete)
   - Design bleu Yoojo style
   - Suggestions populaires

3. Créer page /search avec résultats
   - Agent responsable: Frontend Architect Agent
   - Sidebar: filtres
   - Main: résultats en grid
   - Map affichant markers
   - Empty state si aucun résultat

4. Créer composant FiltersSidebar
   - Agent responsable: Frontend Architect Agent
   - Categories (checkboxes)
   - Prix (slider range)
   - Distance (slider)
   - Note minimum (stars)
   - Apply filters button

5. Créer composant ServiceCard
   - Agent responsable: Frontend Architect Agent
   - Display: image, title, provider name, rating, price, distance
   - Hover effects
   - Click -> service detail

6. Intégrer carte interactive
   - Agent responsable: Geolocation Specialist
   - Google Maps avec markers services
   - Clustering si nombreux résultats
   - Click marker -> highlight service card

**Estimation:** 6 heures  
**Délégation Super Codex:** Utiliser URLSearchParams pour filtres, debounce search input, optimiser requête DB avec indexes

---

### User Story 4.2: Créer Service (Prestataire)
**En tant que** prestataire  
**Je veux** créer une annonce de service  
**Afin de** recevoir des demandes clients

**Critères d'acceptation:**
- Formulaire création service complet
- Upload photos service (max 5)
- Définir prix (fixe ou fourchette)
- Définir zone de service (rayon autour adresse)
- Preview avant publication

**Tâches techniques:**
1. Créer API route POST /api/services
   - Agent responsable: Backend Architect Agent
   - Validation: seuls providers peuvent créer
   - Upload multiple images
   - Create Service record
   - Return service créé

2. Créer page /dashboard/services/new
   - Agent responsable: Frontend Architect Agent
   - Formulaire multi-steps:
     * Step 1: Catégorie + titre + description
     * Step 2: Prix + disponibilité
     * Step 3: Zone de service + photos
     * Step 4: Preview + publish
   - Progress indicator

3. Créer composant MultiImageUpload
   - Agent responsable: Frontend Architect Agent
   - Drag & drop
   - Preview thumbnails
   - Delete image
   - Max 5 images

4. Créer composant ServiceAreaMap
   - Agent responsable: Geolocation Specialist
   - Carte avec cercle rayon service
   - Slider pour ajuster rayon
   - Preview zone couverte

**Estimation:** 5 heures  
**Délégation Super Codex:** Créer wizard steps avec state management Zustand, valider chaque step avant next

---

### User Story 4.3: Voir Détail Service
**En tant que** client  
**Je veux** voir tous les détails d'un service  
**Afin de** décider si je réserve

**Critères d'acceptation:**
- Page affiche: photos, description complète, prix, disponibilité, profil prestataire, avis
- Bouton "Réserver" proéminent
- Galerie photos responsive
- Section FAQ si disponible

**Tâches techniques:**
1. Créer API route GET /api/services/[id]
   - Agent responsable: Backend Architect Agent
   - Include: provider profile, reviews, category
   - Increment view count
   - Return service complet

2. Créer page /services/[id]
   - Agent responsable: Frontend Architect Agent
   - Layout: galerie + sidebar (price, book button)
   - Tabs: Description, Reviews, Provider
   - Breadcrumb navigation

3. Créer composant ImageGallery
   - Agent responsable: Frontend Architect Agent
   - Lightbox pour zoom images
   - Thumbnails navigation
   - Swipe sur mobile

4. Créer composant BookingCard (sidebar)
   - Agent responsable: Frontend Architect Agent
   - Prix affiché clairement
   - Date picker
   - "Réserver" CTA
   - "Contacter" button

**Estimation:** 4 heures  
**Délégation Super Codex:** Optimiser images avec Next/Image, lazy load reviews

---

## EPIC 5: SYSTÈME DE RÉSERVATION (Priorité: P0)

### User Story 5.1: Créer Réservation
**En tant que** client  
**Je veux** réserver un service pour une date spécifique  
**Afin d'** obtenir la prestation

**Critères d'acceptation:**
- Formulaire réservation avec date, heure, message
- Validation disponibilité prestataire
- Calcul prix total (avec frais plateforme)
- Confirmation affichée

**Tâches techniques:**
1. Créer API route POST /api/bookings
   - Agent responsable: Backend Architect Agent
   - Validation: client authentifié, service existe, date future
   - Check disponibilité provider
   - Create Booking (status: PENDING)
   - Send notification au provider

2. Créer page /services/[id]/book
   - Agent responsable: Frontend Architect Agent
   - Recap service
   - DateTimePicker
   - Message pour provider
   - Prix breakdown (service + frais 15%)
   - "Continuer vers paiement" button

3. Créer composant DateTimePicker
   - Agent responsable: Frontend Architect Agent
   - Calendar avec dates dispos
   - Sélection heure (créneaux 1h)
   - Bloquer dates passées

4. Créer notification email
   - Agent responsable: Notification Agent
   - Template: "Nouvelle demande de réservation"
   - Include: client name, service, date, message
   - CTA: "Accepter" ou "Refuser"

**Estimation:** 4 heures  
**Délégation Super Codex:** Gérer timezone correctement, créer enum BookingStatus (PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED)

---

### User Story 5.2: Gérer Réservations (Provider)
**En tant que** prestataire  
**Je veux** voir et gérer mes demandes de réservation  
**Afin d'** accepter ou refuser selon ma disponibilité

**Critères d'acceptation:**
- Dashboard liste toutes réservations (tabs: pending, accepted, completed)
- Actions: accepter, refuser, annuler
- Notifications temps réel
- Historique complet

**Tâches techniques:**
1. Créer API routes bookings management
   - Agent responsable: Backend Architect Agent
   - PATCH /api/bookings/[id]/accept
   - PATCH /api/bookings/[id]/reject
   - PATCH /api/bookings/[id]/cancel
   - Update status + send notifications

2. Créer page /dashboard/bookings
   - Agent responsable: Frontend Architect Agent
   - Tabs filter par status
   - Table responsive avec actions
   - Modal confirmation actions

3. Créer composant BookingsList
   - Agent responsable: Frontend Architect Agent
   - Display: service, client, date, status, actions
   - Color coding par status
   - Quick actions buttons

4. Intégrer notifications temps réel
   - Agent responsable: Backend Architect Agent
   - Socket.io pour push notifications
   - Toast notification quand nouvelle booking
   - Badge count dans header

**Estimation:** 4.5 heures  
**Délégation Super Codex:** Utiliser Server-Sent Events ou Socket.io, créer hook useNotifications

---

### User Story 5.3: Suivre Réservation (Client)
**En tant que** client  
**Je veux** voir l'état de mes réservations  
**Afin de** savoir si acceptées/refusées

**Critères d'acceptation:**
- Page mes réservations avec statuts clairs
- Possibilité annuler si non acceptée
- Voir détails booking
- Contacter prestataire

**Tâches techniques:**
1. Créer page /dashboard/my-bookings
   - Agent responsable: Frontend Architect Agent
   - Liste bookings avec status badges
   - Filters: upcoming, past, cancelled
   - Actions selon status

2. Créer composant BookingDetail
   - Agent responsable: Frontend Architect Agent
   - Modal ou page dédiée
   - Affiche: service, provider, date, price, status, messages
   - Actions: cancel, contact, review (si completed)

**Estimation:** 2.5 heures  
**Délégation Super Codex:** Partager components entre provider/client dashboards, DRY principle

---

## EPIC 6: PAIEMENT (Priorité: P0)

### User Story 6.1: Payer Réservation
**En tant que** client  
**Je veux** payer ma réservation de manière sécurisée  
**Afin de** confirmer la prestation

**Critères d'acceptation:**
- Page checkout avec recap booking
- Formulaire carte bancaire sécurisé (Stripe)
- Paiement en mode escrow (argent bloqué)
- Redirection vers page succès
- Email confirmation

**Tâches techniques:**
1. Setup Stripe Connect account
   - Agent responsable: Payment Integration Specialist
   - Créer compte Stripe test mode
   - Configurer webhooks endpoint
   - Get API keys (publishable + secret)

2. Créer API route POST /api/payments/create-intent
   - Agent responsable: Payment Integration Specialist
   - Create Stripe PaymentIntent
   - Amount = booking price + fees
   - Metadata: booking_id, client_id, provider_id
   - Return client_secret

3. Créer page /checkout/[bookingId]
   - Agent responsable: Frontend Architect Agent
   - Stripe Elements integration
   - Card input component
   - Summary sidebar (booking details, price breakdown)
   - Loading states pendant payment

4. Créer API route POST /api/webhooks/stripe
   - Agent responsable: Payment Integration Specialist
   - Handle payment_intent.succeeded
   - Update Booking payment_status = PAID
   - Release escrow après service completed
   - Send email confirmation

5. Créer pages success/cancel
   - Agent responsable: Frontend Architect Agent
   - /checkout/success: confetti animation, booking details
   - /checkout/cancel: retry option

**Estimation:** 5 heures  
**Délégation Super Codex:** Suivre docs Stripe, gérer 3D Secure, créer tests avec cartes test Stripe (4242 4242 4242 4242)

---

### User Story 6.2: Recevoir Paiement (Provider)
**En tant que** prestataire  
**Je veux** recevoir le paiement après service rendu  
**Afin d'** être rémunéré

**Critères d'acceptation:**
- Argent transféré automatiquement après booking completed
- Dashboard affiche gains
- Possibilité retrait vers compte bancaire

**Tâches techniques:**
1. Configurer Stripe Connect Express
   - Agent responsable: Payment Integration Specialist
   - Onboarding prestataires vers Stripe
   - Vérification identité via Stripe
   - Link bank account

2. Créer flow onboarding paiement
   - Agent responsable: Frontend Architect Agent
   - Page /dashboard/payments/setup
   - Redirect vers Stripe Connect onboarding
   - Handle return + refresh

3. Implémenter transfer automatique
   - Agent responsable: Payment Integration Specialist
   - Quand booking status = COMPLETED
   - Create Transfer vers provider (prix - commission)
   - Update Booking payout_status = TRANSFERRED

4. Créer page earnings dashboard
   - Agent responsable: Frontend Architect Agent
   - Stats: total earned, pending, transferred
   - Chart historique
   - Liste transactions

**Estimation:** 4 heures  
**Délégation Super Codex:** Gérer cas où provider n'a pas setup paiement, bloquer completion booking si non configuré

---

## EPIC 7: MESSAGERIE (Priorité: P1)

### User Story 7.1: Envoyer Messages
**En tant que** utilisateur  
**Je veux** communiquer avec un autre utilisateur  
**Afin de** poser des questions ou discuter détails

**Critères d'acceptation:**
- Interface chat temps réel
- Messages groupés par conversation
- Notifications nouveaux messages
- Historique persistant

**Tâches techniques:**
1. Setup Socket.io server
   - Agent responsable: Backend Architect Agent
   - Create WebSocket server dans API route
   - Handle events: join_room, send_message, typing
   - Authentification socket avec JWT

2. Créer API routes messages
   - Agent responsable: Backend Architect Agent
   - GET /api/messages/[userId]: get conversation history
   - POST /api/messages: send message (+ emit socket)
   - PATCH /api/messages/[id]/read: mark as read

3. Créer page /messages
   - Agent responsable: Frontend Architect Agent
   - Layout: sidebar (conversations list) + chat area
   - Composant ConversationsList
   - Composant ChatWindow

4. Créer composant ChatWindow
   - Agent responsable: Frontend Architect Agent
   - Messages bubbles (sent vs received)
   - Input avec emoji picker
   - Auto-scroll to bottom
   - Typing indicator

5. Intégrer Socket.io client
   - Agent responsable: Frontend Architect Agent
   - Connect socket on mount
   - Listen new messages
   - Emit typing events
   - Update UI en temps réel

**Estimation:** 5 heures  
**Délégation Super Codex:** Gérer reconnection socket, persist messages en DB, créer hook useChat custom

---

## EPIC 8: AVIS & NOTES (Priorité: P1)

### User Story 8.1: Laisser Avis
**En tant que** client  
**Je veux** noter et commenter un prestataire après service  
**Afin de** partager mon expérience

**Critères d'acceptation:**
- Formulaire review avec note (1-5 étoiles) + commentaire
- Validation: seuls clients ayant booking completed peuvent reviewer
- Review visible sur profil provider
- Update note moyenne provider

**Tâches techniques:**
1. Créer API route POST /api/reviews
   - Agent responsable: Backend Architect Agent
   - Validation: booking exists, status=COMPLETED, pas déjà reviewé
   - Create Review
   - Recalculate provider average rating
   - Send notification provider

2. Créer composant ReviewForm
   - Agent responsable: Frontend Architect Agent
   - Star rating selector (interactive)
   - Textarea commentaire (min 20 chars)
   - Submit button

3. Créer page /bookings/[id]/review
   - Agent responsable: Frontend Architect Agent
   - Recap booking
   - ReviewForm
   - Submit -> success message

4. Créer composant ReviewsList
   - Agent responsable: Frontend Architect Agent
   - Affiche reviews avec: avatar client, rating, comment, date
   - Pagination si nombreux avis
   - Filtres: plus récents, meilleurs notes

**Estimation:** 3 heures  
**Délégation Super Codex:** Créer composant StarRating interactif réutilisable, aggregation rating avec Prisma

---

## EPIC 9: DASHBOARDS (Priorité: P1)

### User Story 9.1: Dashboard Client
**En tant que** client  
**Je veux** voir mes statistiques et activités  
**Afin de** gérer facilement mes réservations

**Critères d'acceptation:**
- Widgets: bookings actives, favorites services, recent searches
- Stats: total spent, total bookings
- Quick actions: search, view bookings, messages

**Tâches techniques:**
1. Créer page /dashboard/client
   - Agent responsable: Frontend Architect Agent
   - Grid layout avec widgets
   - Composants: StatsCard, RecentBookings, FavoriteServices

2. Créer API route GET /api/dashboard/client
   - Agent responsable: Backend Architect Agent
   - Aggregate data: count bookings, sum total spent
   - Recent bookings (5 derniers)
   - Return dashboard data

**Estimation:** 2.5 heures  
**Délégation Super Codex:** Créer layout dashboard réutilisable, composants widgets modulaires

---

### User Story 9.2: Dashboard Prestataire
**En tant que** prestataire  
**Je veux** voir mes performances et activités  
**Afin de** optimiser mes services

**Critères d'acceptation:**
- Stats: total earnings, bookings count, average rating
- Chart revenus par mois
- Liste pending bookings
- Quick actions: manage services, view messages

**Tâches techniques:**
1. Créer page /dashboard/provider
   - Agent responsable: Frontend Architect Agent
   - Stats cards
   - Chart.js pour graphiques
   - Liste actions requises

2. Créer API route GET /api/dashboard/provider
   - Agent responsable: Backend Architect Agent
   - Aggregate: earnings, bookings count, rating
   - Group earnings by month
   - Pending bookings count

3. Créer composant EarningsChart
   - Agent responsable: Frontend Architect Agent
   - Chart.js line chart
   - Responsive
   - Tooltip avec détails

**Estimation:** 3 heures  
**Délégation Super Codex:** Utiliser react-chartjs-2, cache dashboard data avec SWR

---

## EPIC 10: INTÉGRATIONS AVANCÉES (Priorité: P2)

### User Story 10.1: Notifications Email
**En tant qu'** utilisateur  
**Je veux** recevoir des emails pour événements importants  
**Afin de** rester informé

**Critères d'acceptation:**
- Emails: bienvenue, booking created, booking accepted, payment success, review received
- Templates responsive
- Unsubscribe option

**Tâches techniques:**
1. Setup SendGrid
   - Agent responsable: Notification Agent
   - Create account SendGrid
   - Verify sender email
   - Get API key

2. Créer service email
   - Agent responsable: Notification Agent
   - lib/email/sendEmail.ts
   - Templates HTML avec variables
   - Send via SendGrid API

3. Créer templates emails
   - Agent responsable: Notification Agent
   - Welcome email
   - Booking confirmation
   - Payment receipt
   - Use MJML pour responsive

4. Intégrer envois email
   - Agent responsable: Backend Architect Agent
   - Trigger après events (user created, booking created, etc.)
   - Use job queue (Bull) pour async

**Estimation:** 3 heures  
**Délégation Super Codex:** Créer templates avec MJML, gérer retry si SendGrid fail

---

### User Story 10.2: Vérification Identité
**En tant que** prestataire  
**Je veux** vérifier mon identité  
**Afin de** gagner la confiance des clients

**Critères d'acceptation:**
- Upload photo ID
- Review manuel (ou automatique si Stripe Identity)
- Badge "Vérifié" sur profil

**Tâches techniques:**
1. Créer flow vérification
   - Agent responsable: Identity Verification Specialist
   - Page /dashboard/verification
   - Upload ID front + back
   - Submit pour review

2. Créer API routes verification
   - Agent responsable: Backend Architect Agent
   - POST /api/verification/submit
   - PATCH /api/verification/[id]/approve (admin)
   - Update user verified status

3. Créer admin panel review
   - Agent responsable: Frontend Architect Agent
   - Liste verifications pending
   - View uploaded documents
   - Actions: approve, reject

**Estimation:** 3.5 heures (simplifié sans AI)  
**Délégation Super Codex:** Version MVP sans AI, review manuel admin uniquement

---

## EPIC 11: UI/UX POLISH (Priorité: P1)

### User Story 11.1: Design System Cohérent
**En tant que** utilisateur  
**Je veux** une interface moderne et cohérente  
**Afin d'** avoir une expérience agréable

**Critères d'acceptation:**
- Palette couleurs Yoojo-like (bleu #1E3A8A dominant)
- Typography cohérente (Inter ou Poppins)
- Composants shadcn/ui stylés
- Animations fluides

**Tâches techniques:**
1. Configurer Tailwind theme
   - Agent responsable: Frontend Architect Agent
   - Custom colors, fonts, spacing
   - Dark mode support (optionnel)

2. Créer composants UI base
   - Agent responsable: Frontend Architect Agent
   - Button variants (primary, secondary, outline)
   - Input, Textarea, Select
   - Modal, Toast, Tooltip
   - Card, Badge

3. Créer layout components
   - Agent responsable: Frontend Architect Agent
   - Header avec navigation
   - Footer
   - Sidebar
   - Container, Section

4. Ajouter animations
   - Agent responsable: Frontend Architect Agent
   - Page transitions
   - Hover effects
   - Loading skeletons

**Estimation:** 4 heures  
**Délégation Super Codex:** Utiliser shadcn/ui CLI pour générer base, customizer selon Yoojo design

---

### User Story 11.2: Responsive Design
**En tant qu'** utilisateur mobile  
**Je veux** utiliser la plateforme sur smartphone  
**Afin de** réserver en déplacement

**Critères d'acceptation:**
- Mobile-first approach
- Tous pages responsive (320px à 1920px)
- Touch-friendly (boutons min 44px)
- Menu mobile burger

**Tâches techniques:**
1. Créer navigation mobile
   - Agent responsable: Frontend Architect Agent
   - Burger menu
   - Slide-in sidebar
   - Bottom navigation alternative

2. Tester toutes pages responsive
   - Agent responsable: Frontend Architect Agent
   - Chrome DevTools responsive mode
   - Fix breakpoints issues

3. Optimiser images mobile
   - Agent responsable: Frontend Architect Agent
   - Next/Image avec sizes
   - WebP format
   - Lazy loading

**Estimation:** 3 heures  
**Délégation Super Codex:** Utiliser Tailwind breakpoints (sm, md, lg, xl), tester sur vrais devices si possible

---

## EPIC 12: DOCUMENTATION (Priorité: P0)

### User Story 12.1: Documentation Installation
**En tant que** nouveau développeur  
**Je veux** installer le projet facilement  
**Afin de** contribuer rapidement

**Critères d'acceptation:**
- README.md complet avec étapes installation
- Variables environnement documentées
- Commandes utiles listées
- Troubleshooting section

**Tâches techniques:**
1. Créer README.md
   - Agent responsable: Super Codex
   - Description projet
   - Prérequis (Node, PostgreSQL)
   - Installation steps
   - Run dev server
   - Build production

2. Créer .env.example
   - Agent responsable: Super Codex
   - Lister toutes variables nécessaires
   - Commentaires explicatifs
   - Valeurs exemple (non sensibles)

3. Créer CONTRIBUTING.md
   - Agent responsable: Super Codex
   - Code style guide
   - Git workflow (branches, commits)
   - Pull request template

**Estimation:** 2 heures  
**Délégation Super Codex:** Documentation claire, exemples concrets, captures d'écran si pertinent

---

### User Story 12.2: Documentation API
**En tant que** développeur frontend  
**Je veux** une doc API complète  
**Afin de** consommer les endpoints correctement

**Critères d'acceptation:**
- Tous endpoints documentés (méthode, params, body, response)
- Exemples curl
- Schemas Zod exportés

**Tâches techniques:**
1. Créer API.md
   - Agent responsable: Backend Architect Agent
   - Lister tous endpoints par feature
   - Request/Response examples
   - Error codes

2. Optionnel: Setup Swagger
   - Agent responsable: Backend Architect Agent
   - Generate OpenAPI spec
   - Serve /api/docs

**Estimation:** 2 heures  
**Délégation Super Codex:** Format markdown simple, prioriser clarté sur exhaustivité

---

## RÉCAPITULATIF TIMELINE

### Jour 1 (24h):
- **0-2h**: EPIC 1 - Setup projet
- **2-5h**: EPIC 1 - Database schema
- **5-10h**: EPIC 2 - Auth complète
- **10-14h**: EPIC 3 - Profils
- **14-20h**: EPIC 4 - Services & Search
- **20-24h**: EPIC 5 - Système réservation

### Jour 2 (24h):
- **24-29h**: EPIC 6 - Paiement Stripe
- **29-34h**: EPIC 7 - Messagerie
- **34-37h**: EPIC 8 - Reviews
- **37-42h**: EPIC 9 - Dashboards
- **42-44h**: EPIC 11 - UI polish
- **44-46h**: EPIC 12 - Documentation
- **46-48h**: Buffer tests & debug

### Priorités si retard:
- **Couper**: EPIC 10 (Notifications email simplifiées, pas de vérification identité)
- **Simplifier**: Messagerie (sans Socket.io, polling simple)
- **Garder absolument**: Auth, Search, Booking, Payment

## DÉLÉGATION FINALE SUPER CODEX

Le Super Codex doit:
1. **Suivre l'ordre des Epics** pour éviter dépendances bloquantes
2. **Commit régulièrement** (au moins toutes les 2h) avec messages clairs
3. **Tester chaque feature** après implémentation avant de passer à la suivante
4. **Logger tout blocage** dans TROUBLESHOOTING.md
5. **Prioriser fonctionnalité** sur perfection (MVP mindset)
6. **Documenter au fil de l'eau** (pas à la fin)

**Standards qualité obligatoires:**
- ✅ TypeScript strict mode
- ✅ Aucun any (sauf cas exceptionnel documenté)
- ✅ Zod validation toutes entrées utilisateur
- ✅ Error handling sur toutes API routes
- ✅ Loading states sur toutes actions async
- ✅ Responsive toutes pages
- ✅ Accessibility basics (alt texts, aria-labels, keyboard navigation)

**Commandes à exécuter:**
```bash
# Démarrage projet
npm run dev  # Port 3000
npx prisma studio  # Port 5555

# Tests
npm run build  # Vérifier compilation
npm run lint  # Vérifier code quality
```

**Checklist finale avant livraison:**
- [ ] Toutes pages accessibles sans erreur console
- [ ] Flow complet booking + payment fonctionne
- [ ] Responsive vérifié (mobile + desktop)
- [ ] README.md installation testé
- [ ] .env.example à jour
- [ ] Seed data génère utilisateurs de test
- [ ] Aucune clé API en dur dans code (seulement .env)
