# OrchestarTool - Multi-Agent System Orchestrator

**OrchestarTool** est un système d'orchestration multi-agents conçu pour analyser les besoins de développement d'applications web et mobiles, générer automatiquement des user stories suivant la méthodologie Agile, et créer une architecture complète avec des agents spécialisés pour piloter un Super Codex Autonome.

## 🎯 Fonctionnalités Principales

### 1. **Analyse des Besoins (Requirement Analyst Agent)**
- Questionnaire complet pour les objectifs business
- Questions sur les utilisateurs finaux et l'échelle du projet
- Collecte des contraintes techniques (langages, frameworks, APIs)
- Analyse automatique et identification des risques

### 2. **Génération de User Stories (User Story Agent)**
- Création automatique de user stories en format Agile
- Décomposition en tâches avec estimations d'effort
- Critères d'acceptance pour chaque story
- Priorisation et calcul de story points

### 3. **Architecture Multi-Agents (Architecture Designer Agent)**
- Conception d'architecture technique complète
- Définition de 8 agents spécialisés :
  - **Frontend Development Agent** - Interface utilisateur
  - **Backend Development Agent** - API et logique métier
  - **Mobile Development Agent** - Applications iOS/Android
  - **DevOps Agent** - Infrastructure et déploiement
  - **QA & Testing Agent** - Qualité et tests
  - **Security Agent** - Sécurité et conformité
  - **Data & Analytics Agent** - Données et analytics
  - **Orchestration Coordinator Agent** - Coordination et supervision

### 4. **Exportation des Configurations**
- Génération de fichiers de configuration JSON pour chaque agent
- Spécification complète du projet exportable
- Assignation automatique des agents aux user stories

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/deviaprj/orchestartool.git
cd orchestartool

# Installer les dépendances (Python 3.8+)
pip install -r requirements.txt
```

## 📖 Utilisation

### Mode Exemple (Démonstration)

Exécutez l'outil avec un exemple pré-configuré d'une plateforme E-commerce :

```bash
python src/cli.py
```

Ce mode :
- Analyse les besoins d'une plateforme e-commerce
- Génère des user stories détaillées
- Conçoit l'architecture multi-agents
- Exporte tous les fichiers de configuration dans `output/`

### Mode Interactif

Pour utiliser vos propres réponses :

```bash
python src/cli.py --interactive
```

Ce mode affiche toutes les questions du questionnaire pour que vous puissiez les analyser.

### Utilisation Programmatique

```python
from src.orchestrator import SuperCodexOrchestrator

# Initialiser l'orchestrateur
orchestrator = SuperCodexOrchestrator()

# Démarrer une session
session_id = orchestrator.start_new_session("Mon Projet")

# Obtenir le questionnaire
questionnaire = orchestrator.get_questionnaire()

# Analyser les réponses
responses = {
    "B1": "E-commerce",
    "B2": ["Grand public (B2C)"],
    # ... autres réponses
}
analysis = orchestrator.analyze_requirements(responses)

# Générer les user stories
user_stories = orchestrator.generate_user_stories()

# Concevoir l'architecture
architecture = orchestrator.design_architecture()

# Exporter la spécification complète
orchestrator.export_complete_spec("specification.json")
orchestrator.export_agent_configs("agent_configs/")
```

## 📋 Questionnaire

### Questions Business (6 questions)
- **B1**: Objectif principal de l'application
- **B2**: Utilisateurs finaux cibles
- **B3**: Nombre d'utilisateurs attendu
- **B4**: Principales fonctionnalités
- **B5**: Délai de livraison souhaité
- **B6**: Budget approximatif

### Questions Techniques (8 questions)
- **T1**: Plateforme mobile ciblée
- **T2**: Framework frontend web
- **T3**: Langage/framework backend
- **T4**: Type de base de données
- **T5**: Intégrations services externes
- **T6**: Infrastructure d'hébergement
- **T7**: Contraintes de sécurité
- **T8**: Fonctionnalités temps réel

## 📁 Structure du Projet

```
orchestartool/
├── src/
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── base_agent.py              # Classe de base pour tous les agents
│   │   ├── requirement_analyst_agent.py   # Agent d'analyse des besoins
│   │   ├── user_story_agent.py        # Agent de génération de user stories
│   │   └── architecture_agent.py      # Agent de conception d'architecture
│   ├── orchestrator.py                # Orchestrateur principal
│   └── cli.py                         # Interface en ligne de commande
├── output/                            # Fichiers générés (créé automatiquement)
│   ├── complete_specification.json
│   └── agent_configs/
│       ├── codex_frontend_001_config.json
│       ├── codex_backend_001_config.json
│       └── ...
├── requirements.txt
└── README.md
```

## 🔧 Fichiers Générés

### complete_specification.json
Contient la spécification complète du projet :
- Métadonnées de session
- Réponses au questionnaire
- Analyse des besoins
- User stories avec tâches
- Architecture technique
- Assignation des agents

### agent_configs/*.json
Un fichier de configuration pour chaque agent spécialisé contenant :
- Identifiant unique de l'agent
- Rôle et responsabilités
- Technologies utilisées
- Livrables attendus

## 🎯 Cas d'Usage

### 1. Planification de Projet
- Utilisez l'outil en début de projet pour structurer vos besoins
- Générez automatiquement le backlog initial
- Identifiez les risques techniques dès le départ

### 2. Architecture Multi-Agents
- Définissez clairement les responsabilités de chaque agent
- Configurez le Super Codex avec les fichiers générés
- Déléguez les tâches de développement aux agents spécialisés

### 3. Méthode Agile
- Utilisez les user stories générées pour le sprint planning
- Estimations d'effort déjà calculées
- Priorisation basée sur l'analyse des besoins

## 🌟 Exemple de Sortie

L'outil génère des user stories détaillées comme :

```
[US-001] Authentification utilisateur (Priorité: Haute, Points: 8)
Description: En tant qu'utilisateur, je veux pouvoir créer un compte et 
me connecter pour accéder à l'application

Critères d'acceptance:
  ✓ L'utilisateur peut créer un compte avec email/mot de passe
  ✓ L'utilisateur peut se connecter avec ses identifiants
  ✓ L'utilisateur peut réinitialiser son mot de passe
  ✓ Les sessions sont sécurisées avec tokens JWT

Tâches (6 tâches, ~36h):
  [T-001-1] Créer modèle utilisateur en base de données (4h)
  [T-001-2] Implémenter API d'inscription (6h)
  [T-001-3] Implémenter API de connexion avec JWT (6h)
  [T-001-4] Créer interface d'inscription/connexion (8h)
  [T-001-5] Implémenter reset mot de passe par email (6h)
  [T-001-6] Tests unitaires et d'intégration (6h)
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir des issues ou des pull requests.

## 📄 Licence

Ce projet est open source et disponible sous licence MIT.

## 👥 Auteurs

Développé comme un outil d'orchestration multi-agents pour faciliter la conception et le développement d'applications web et mobiles.
