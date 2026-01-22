"""
User Story Generator Agent - Creates detailed user stories from requirements
"""

from typing import Dict, List, Any
from .base_agent import BaseAgent


class UserStoryAgent(BaseAgent):
    """
    Agent specialized in generating user stories and tasks following Agile methodology.
    """
    
    def __init__(self):
        super().__init__(
            agent_id="user_story_001",
            name="User Story Generator Agent",
            description="Expert en génération de user stories selon la méthode Agile",
            capabilities=[
                "Génération de user stories",
                "Décomposition en tâches",
                "Estimation de complexité",
                "Priorisation backlog"
            ]
        )
    
    def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate user stories from requirements analysis.
        
        Args:
            input_data: Contains 'analysis' from RequirementAnalystAgent
            
        Returns:
            Dictionary with user stories and tasks
        """
        analysis = input_data.get('analysis', {})
        project_type = analysis.get('project_type', 'Custom Application')
        features = input_data.get('features', [])
        
        user_stories = self._generate_user_stories(project_type, features, analysis)
        
        return {
            "status": "success",
            "user_stories": user_stories,
            "message": f"Généré {len(user_stories)} user stories"
        }
    
    def _generate_user_stories(self, project_type: str, features: List[str], analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate user stories based on project type and features."""
        stories = []
        
        # Core authentication story (always needed)
        if any('Authentification' in f for f in features):
            stories.append({
                "id": "US-001",
                "title": "Authentification utilisateur",
                "description": "En tant qu'utilisateur, je veux pouvoir créer un compte et me connecter pour accéder à l'application",
                "acceptance_criteria": [
                    "L'utilisateur peut créer un compte avec email/mot de passe",
                    "L'utilisateur peut se connecter avec ses identifiants",
                    "L'utilisateur peut réinitialiser son mot de passe",
                    "Les sessions sont sécurisées avec tokens JWT"
                ],
                "priority": "Haute",
                "story_points": 8,
                "tasks": [
                    {"id": "T-001-1", "title": "Créer modèle utilisateur en base de données", "estimated_hours": 4},
                    {"id": "T-001-2", "title": "Implémenter API d'inscription", "estimated_hours": 6},
                    {"id": "T-001-3", "title": "Implémenter API de connexion avec JWT", "estimated_hours": 6},
                    {"id": "T-001-4", "title": "Créer interface d'inscription/connexion", "estimated_hours": 8},
                    {"id": "T-001-5", "title": "Implémenter reset mot de passe par email", "estimated_hours": 6},
                    {"id": "T-001-6", "title": "Tests unitaires et d'intégration", "estimated_hours": 6}
                ]
            })
        
        # E-commerce specific stories
        if "E-commerce" in project_type:
            stories.extend(self._generate_ecommerce_stories(features))
        
        # Social network specific stories
        elif "Social Network" in project_type:
            stories.extend(self._generate_social_stories(features))
        
        # General features
        if any('Paiement' in f for f in features):
            stories.append({
                "id": f"US-{len(stories)+1:03d}",
                "title": "Intégration paiement en ligne",
                "description": "En tant qu'utilisateur, je veux pouvoir effectuer des paiements sécurisés",
                "acceptance_criteria": [
                    "Intégration avec Stripe/PayPal",
                    "Paiements par carte bancaire",
                    "Historique des transactions",
                    "Confirmations par email"
                ],
                "priority": "Haute",
                "story_points": 13,
                "tasks": [
                    {"id": f"T-{len(stories)+1:03d}-1", "title": "Intégrer SDK Stripe", "estimated_hours": 8},
                    {"id": f"T-{len(stories)+1:03d}-2", "title": "Créer API de paiement", "estimated_hours": 10},
                    {"id": f"T-{len(stories)+1:03d}-3", "title": "Interface de paiement frontend", "estimated_hours": 12},
                    {"id": f"T-{len(stories)+1:03d}-4", "title": "Webhooks et confirmations", "estimated_hours": 6}
                ]
            })
        
        if any('Notifications' in f for f in features):
            stories.append({
                "id": f"US-{len(stories)+1:03d}",
                "title": "Système de notifications push",
                "description": "En tant qu'utilisateur, je veux recevoir des notifications pour rester informé",
                "acceptance_criteria": [
                    "Notifications push sur mobile",
                    "Notifications web (browser)",
                    "Centre de notifications dans l'app",
                    "Préférences de notification personnalisables"
                ],
                "priority": "Moyenne",
                "story_points": 8,
                "tasks": [
                    {"id": f"T-{len(stories)+1:03d}-1", "title": "Configurer Firebase Cloud Messaging", "estimated_hours": 6},
                    {"id": f"T-{len(stories)+1:03d}-2", "title": "API d'envoi de notifications", "estimated_hours": 8},
                    {"id": f"T-{len(stories)+1:03d}-3", "title": "Interface notifications frontend", "estimated_hours": 10}
                ]
            })
        
        if any('Analytics' in f or 'Reporting' in f for f in features):
            stories.append({
                "id": f"US-{len(stories)+1:03d}",
                "title": "Tableau de bord analytics",
                "description": "En tant qu'administrateur, je veux visualiser les statistiques d'utilisation",
                "acceptance_criteria": [
                    "Dashboard avec métriques clés",
                    "Graphiques d'évolution",
                    "Export de données",
                    "Filtres par période"
                ],
                "priority": "Basse",
                "story_points": 13,
                "tasks": [
                    {"id": f"T-{len(stories)+1:03d}-1", "title": "Implémenter tracking d'événements", "estimated_hours": 8},
                    {"id": f"T-{len(stories)+1:03d}-2", "title": "Créer agrégations et métriques", "estimated_hours": 10},
                    {"id": f"T-{len(stories)+1:03d}-3", "title": "Interface dashboard avec graphiques", "estimated_hours": 16}
                ]
            })
        
        return stories
    
    def _generate_ecommerce_stories(self, features: List[str]) -> List[Dict[str, Any]]:
        """Generate E-commerce specific user stories."""
        return [
            {
                "id": "US-E01",
                "title": "Catalogue produits",
                "description": "En tant qu'utilisateur, je veux parcourir le catalogue de produits",
                "acceptance_criteria": [
                    "Liste de produits avec images et prix",
                    "Filtrage par catégorie",
                    "Recherche de produits",
                    "Tri par prix/popularité"
                ],
                "priority": "Haute",
                "story_points": 8,
                "tasks": [
                    {"id": "T-E01-1", "title": "Modèle produit et catégorie", "estimated_hours": 4},
                    {"id": "T-E01-2", "title": "API CRUD produits", "estimated_hours": 8},
                    {"id": "T-E01-3", "title": "Interface catalogue avec filtres", "estimated_hours": 12},
                    {"id": "T-E01-4", "title": "Recherche et tri", "estimated_hours": 8}
                ]
            },
            {
                "id": "US-E02",
                "title": "Panier d'achat",
                "description": "En tant qu'utilisateur, je veux ajouter des produits à mon panier",
                "acceptance_criteria": [
                    "Ajout/suppression de produits",
                    "Modification des quantités",
                    "Calcul du total",
                    "Persistance du panier"
                ],
                "priority": "Haute",
                "story_points": 5,
                "tasks": [
                    {"id": "T-E02-1", "title": "API gestion panier", "estimated_hours": 6},
                    {"id": "T-E02-2", "title": "Interface panier", "estimated_hours": 8},
                    {"id": "T-E02-3", "title": "Calculs et validations", "estimated_hours": 4}
                ]
            },
            {
                "id": "US-E03",
                "title": "Processus de commande",
                "description": "En tant qu'utilisateur, je veux finaliser ma commande",
                "acceptance_criteria": [
                    "Saisie adresse de livraison",
                    "Choix mode de livraison",
                    "Confirmation de commande",
                    "Email de confirmation"
                ],
                "priority": "Haute",
                "story_points": 8,
                "tasks": [
                    {"id": "T-E03-1", "title": "Modèle commande", "estimated_hours": 4},
                    {"id": "T-E03-2", "title": "API création commande", "estimated_hours": 8},
                    {"id": "T-E03-3", "title": "Tunnel de commande frontend", "estimated_hours": 12},
                    {"id": "T-E03-4", "title": "Emails de confirmation", "estimated_hours": 4}
                ]
            }
        ]
    
    def _generate_social_stories(self, features: List[str]) -> List[Dict[str, Any]]:
        """Generate social network specific user stories."""
        return [
            {
                "id": "US-S01",
                "title": "Profil utilisateur",
                "description": "En tant qu'utilisateur, je veux créer et gérer mon profil",
                "acceptance_criteria": [
                    "Photo de profil et bannière",
                    "Bio et informations personnelles",
                    "Paramètres de confidentialité",
                    "Vue publique du profil"
                ],
                "priority": "Haute",
                "story_points": 5,
                "tasks": [
                    {"id": "T-S01-1", "title": "Extension modèle utilisateur", "estimated_hours": 4},
                    {"id": "T-S01-2", "title": "Upload et gestion images", "estimated_hours": 8},
                    {"id": "T-S01-3", "title": "Interface profil", "estimated_hours": 10}
                ]
            },
            {
                "id": "US-S02",
                "title": "Publications et fil d'actualité",
                "description": "En tant qu'utilisateur, je veux publier et voir les publications",
                "acceptance_criteria": [
                    "Créer publication texte/image/vidéo",
                    "Fil d'actualité personnalisé",
                    "Likes et commentaires",
                    "Partage de publications"
                ],
                "priority": "Haute",
                "story_points": 13,
                "tasks": [
                    {"id": "T-S02-1", "title": "Modèle publication", "estimated_hours": 4},
                    {"id": "T-S02-2", "title": "API CRUD publications", "estimated_hours": 10},
                    {"id": "T-S02-3", "title": "Algorithme fil d'actualité", "estimated_hours": 12},
                    {"id": "T-S02-4", "title": "Interface publications", "estimated_hours": 16},
                    {"id": "T-S02-5", "title": "Système likes/commentaires", "estimated_hours": 8}
                ]
            },
            {
                "id": "US-S03",
                "title": "Système d'amis/followers",
                "description": "En tant qu'utilisateur, je veux suivre d'autres utilisateurs",
                "acceptance_criteria": [
                    "Envoyer demande d'ami/suivre",
                    "Accepter/refuser demandes",
                    "Liste d'amis/followers",
                    "Suggestions d'amis"
                ],
                "priority": "Haute",
                "story_points": 8,
                "tasks": [
                    {"id": "T-S03-1", "title": "Modèle relations", "estimated_hours": 6},
                    {"id": "T-S03-2", "title": "API gestion relations", "estimated_hours": 10},
                    {"id": "T-S03-3", "title": "Interface amis/followers", "estimated_hours": 12}
                ]
            }
        ]
