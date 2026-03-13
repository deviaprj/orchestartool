"""
Requirement Analyst Agent - Specialized in analyzing user demands and gathering requirements
"""

from typing import Dict, List, Any
from .base_agent import BaseAgent


class RequirementAnalystAgent(BaseAgent):
    """
    Agent specialized in requirement analysis for web and mobile applications.
    Asks targeted questions to clarify business objectives and technical constraints.
    """
    
    def __init__(self):
        super().__init__(
            agent_id="req_analyst_001",
            name="Requirement Analyst Agent",
            description="Expert en analyse des besoins pour applications web et mobiles",
            capabilities=[
                "Analyse des objectifs business",
                "Identification des utilisateurs finaux",
                "Collecte des contraintes techniques",
                "Génération de questions ciblées"
            ]
        )
        
        # Questionnaire pour les objectifs business
        self.business_questions = [
            {
                "id": "B1",
                "question": "Quel est l'objectif principal de votre application web/mobile ?",
                "type": "text",
                "category": "business_objective",
                "examples": [
                    "E-commerce",
                    "Réseau social",
                    "Gestion interne",
                    "Service client",
                    "Éducation/Formation"
                ]
            },
            {
                "id": "B2",
                "question": "Qui sont vos utilisateurs finaux cibles ?",
                "type": "multi_select",
                "category": "target_users",
                "options": [
                    "Grand public (B2C)",
                    "Entreprises (B2B)",
                    "Employés internes",
                    "Partenaires/Revendeurs",
                    "Administrateurs système"
                ]
            },
            {
                "id": "B3",
                "question": "Quel est le nombre d'utilisateurs attendu ?",
                "type": "choice",
                "category": "scale",
                "options": [
                    "< 1,000 utilisateurs",
                    "1,000 - 10,000 utilisateurs",
                    "10,000 - 100,000 utilisateurs",
                    "100,000 - 1M utilisateurs",
                    "> 1M utilisateurs"
                ]
            },
            {
                "id": "B4",
                "question": "Quelles sont les principales fonctionnalités attendues ?",
                "type": "multi_select",
                "category": "features",
                "options": [
                    "Authentification/Gestion utilisateurs",
                    "Paiement en ligne",
                    "Messagerie/Chat",
                    "Notifications push",
                    "Géolocalisation",
                    "Upload/Gestion de fichiers",
                    "Recherche avancée",
                    "Analytics/Reporting",
                    "API REST/GraphQL",
                    "Mode hors-ligne"
                ]
            },
            {
                "id": "B5",
                "question": "Quel est le délai de livraison souhaité ?",
                "type": "choice",
                "category": "timeline",
                "options": [
                    "MVP en 1-2 mois",
                    "Version complète en 3-6 mois",
                    "Projet long terme (6-12 mois)",
                    "Pas de contrainte de temps"
                ]
            },
            {
                "id": "B6",
                "question": "Quel est le budget approximatif du projet ?",
                "type": "choice",
                "category": "budget",
                "options": [
                    "Budget limité (projet personnel/startup)",
                    "Budget moyen (PME)",
                    "Budget conséquent (Grande entreprise)",
                    "Budget flexible"
                ]
            }
        ]
        
        # Questionnaire pour les contraintes techniques
        self.technical_questions = [
            {
                "id": "T1",
                "question": "Quelle plateforme mobile souhaitez-vous cibler ?",
                "type": "multi_select",
                "category": "mobile_platform",
                "options": [
                    "iOS uniquement",
                    "Android uniquement",
                    "iOS + Android (natif)",
                    "Cross-platform (React Native, Flutter)",
                    "Progressive Web App (PWA)",
                    "Pas d'application mobile"
                ]
            },
            {
                "id": "T2",
                "question": "Avez-vous une préférence pour le framework frontend web ?",
                "type": "multi_select",
                "category": "frontend_framework",
                "options": [
                    "React",
                    "Vue.js",
                    "Angular",
                    "Svelte",
                    "Next.js (React avec SSR)",
                    "Pas de préférence"
                ]
            },
            {
                "id": "T3",
                "question": "Quel langage/framework backend préférez-vous ?",
                "type": "multi_select",
                "category": "backend_framework",
                "options": [
                    "Node.js (Express, NestJS)",
                    "Python (Django, FastAPI, Flask)",
                    "Java (Spring Boot)",
                    "C# (.NET)",
                    "Go",
                    "Ruby (Rails)",
                    "PHP (Laravel)",
                    "Pas de préférence"
                ]
            },
            {
                "id": "T4",
                "question": "Quel type de base de données envisagez-vous ?",
                "type": "multi_select",
                "category": "database",
                "options": [
                    "SQL (PostgreSQL, MySQL)",
                    "NoSQL Document (MongoDB, Firestore)",
                    "NoSQL Key-Value (Redis, DynamoDB)",
                    "Graph Database (Neo4j)",
                    "Hybride (SQL + NoSQL)",
                    "Pas de préférence"
                ]
            },
            {
                "id": "T5",
                "question": "Avez-vous besoin d'intégrations avec des services externes ?",
                "type": "multi_select",
                "category": "integrations",
                "options": [
                    "Payment (Stripe, PayPal)",
                    "Authentification sociale (Google, Facebook, Apple)",
                    "Cloud Storage (AWS S3, Google Cloud Storage)",
                    "Email (SendGrid, Mailgun)",
                    "SMS (Twilio)",
                    "Analytics (Google Analytics, Mixpanel)",
                    "CRM (Salesforce, HubSpot)",
                    "Autres APIs tierces"
                ]
            },
            {
                "id": "T6",
                "question": "Quelle infrastructure d'hébergement préférez-vous ?",
                "type": "multi_select",
                "category": "hosting",
                "options": [
                    "Cloud AWS",
                    "Cloud Google (GCP)",
                    "Cloud Azure",
                    "Serverless (AWS Lambda, Cloud Functions)",
                    "Container (Docker, Kubernetes)",
                    "Hébergement traditionnel (VPS)",
                    "Pas de préférence"
                ]
            },
            {
                "id": "T7",
                "question": "Avez-vous des contraintes de sécurité spécifiques ?",
                "type": "multi_select",
                "category": "security",
                "options": [
                    "Conformité RGPD",
                    "Authentification 2FA/MFA",
                    "Encryption des données (at rest et in transit)",
                    "Audit logs",
                    "Conformité HIPAA (santé)",
                    "Conformité PCI-DSS (paiement)",
                    "Pas de contrainte particulière"
                ]
            },
            {
                "id": "T8",
                "question": "Avez-vous besoin de fonctionnalités temps réel ?",
                "type": "multi_select",
                "category": "realtime",
                "options": [
                    "WebSockets pour chat/messaging",
                    "Notifications push",
                    "Synchronisation temps réel",
                    "Collaborative editing",
                    "Pas besoin de temps réel"
                ]
            }
        ]
    
    def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process requirement analysis request.
        
        Args:
            input_data: Contains 'request_type' and optional 'context'
            
        Returns:
            Dictionary with questions or analysis results
        """
        request_type = input_data.get('request_type', 'get_questions')
        
        if request_type == 'get_business_questions':
            return {
                "status": "success",
                "questions": self.business_questions,
                "message": "Questions sur les objectifs business et utilisateurs finaux"
            }
        
        elif request_type == 'get_technical_questions':
            return {
                "status": "success",
                "questions": self.technical_questions,
                "message": "Questions sur les contraintes techniques"
            }
        
        elif request_type == 'get_all_questions':
            return {
                "status": "success",
                "business_questions": self.business_questions,
                "technical_questions": self.technical_questions,
                "message": "Questionnaire complet pour analyse des besoins"
            }
        
        elif request_type == 'analyze_responses':
            responses = input_data.get('responses', {})
            analysis = self._analyze_responses(responses)
            return {
                "status": "success",
                "analysis": analysis,
                "message": "Analyse des réponses complétée"
            }
        
        else:
            return {
                "status": "error",
                "message": f"Type de requête non reconnu: {request_type}"
            }
    
    def _analyze_responses(self, responses: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze user responses and generate insights."""
        analysis = {
            "project_type": self._determine_project_type(responses),
            "complexity_level": self._assess_complexity(responses),
            "recommended_architecture": self._recommend_architecture(responses),
            "estimated_timeline": self._estimate_timeline(responses),
            "key_risks": self._identify_risks(responses),
            "next_steps": self._suggest_next_steps(responses)
        }
        return analysis
    
    def _determine_project_type(self, responses: Dict[str, Any]) -> str:
        """Determine the type of project based on responses."""
        # Simplified logic - can be expanded
        if "E-commerce" in str(responses.get('B1', '')):
            return "E-commerce Platform"
        elif "Réseau social" in str(responses.get('B1', '')):
            return "Social Network Application"
        elif "Gestion interne" in str(responses.get('B1', '')):
            return "Internal Management System"
        else:
            return "Custom Web/Mobile Application"
    
    def _assess_complexity(self, responses: Dict[str, Any]) -> str:
        """Assess project complexity."""
        complexity_score = 0
        
        # Check scale
        scale = responses.get('B3', '')
        if '1M' in scale or '100,000' in scale:
            complexity_score += 3
        elif '10,000' in scale:
            complexity_score += 2
        else:
            complexity_score += 1
        
        # Check features count
        features = responses.get('B4', [])
        if isinstance(features, list):
            complexity_score += min(len(features), 5)
        
        # Check integrations
        integrations = responses.get('T5', [])
        if isinstance(integrations, list):
            complexity_score += min(len(integrations), 3)
        
        if complexity_score <= 4:
            return "Simple (MVP/Prototype)"
        elif complexity_score <= 8:
            return "Moyenne (Application standard)"
        else:
            return "Élevée (Plateforme complexe)"
    
    def _recommend_architecture(self, responses: Dict[str, Any]) -> Dict[str, Any]:
        """Recommend architecture based on responses."""
        architecture = {
            "frontend": [],
            "backend": [],
            "database": [],
            "infrastructure": [],
            "mobile": []
        }
        
        # Frontend
        frontend = responses.get('T2', [])
        if isinstance(frontend, list) and frontend:
            architecture['frontend'] = frontend
        else:
            architecture['frontend'] = ["React (recommandé pour flexibilité)"]
        
        # Backend
        backend = responses.get('T3', [])
        if isinstance(backend, list) and backend:
            architecture['backend'] = backend
        else:
            architecture['backend'] = ["Node.js (recommandé pour full-stack JS)"]
        
        # Database
        database = responses.get('T4', [])
        if isinstance(database, list) and database:
            architecture['database'] = database
        else:
            architecture['database'] = ["PostgreSQL (recommandé pour robustesse)"]
        
        # Mobile
        mobile = responses.get('T1', [])
        if isinstance(mobile, list) and mobile:
            architecture['mobile'] = mobile
        
        # Infrastructure
        hosting = responses.get('T6', [])
        if isinstance(hosting, list) and hosting:
            architecture['infrastructure'] = hosting
        else:
            architecture['infrastructure'] = ["Cloud AWS (recommandé)"]
        
        return architecture
    
    def _estimate_timeline(self, responses: Dict[str, Any]) -> str:
        """Estimate project timeline."""
        desired_timeline = responses.get('B5', '')
        complexity = self._assess_complexity(responses)
        
        if "Simple" in complexity:
            return "2-3 mois pour MVP, 4-6 mois pour version complète"
        elif "Moyenne" in complexity:
            return "3-4 mois pour MVP, 6-9 mois pour version complète"
        else:
            return "5-6 mois pour MVP, 9-18 mois pour version complète"
    
    def _identify_risks(self, responses: Dict[str, Any]) -> List[str]:
        """Identify potential project risks."""
        risks = []
        
        # Scale risks
        scale = responses.get('B3', '')
        if '1M' in scale or '100,000' in scale:
            risks.append("Scalabilité: nécessite architecture distribuée et load balancing")
        
        # Security risks
        security = responses.get('T7', [])
        if isinstance(security, list) and any('RGPD' in s or 'HIPAA' in s or 'PCI' in s for s in security):
            risks.append("Conformité réglementaire: audit de sécurité requis")
        
        # Timeline risks
        timeline = responses.get('B5', '')
        complexity = self._assess_complexity(responses)
        if 'MVP en 1-2 mois' in timeline and 'Élevée' in complexity:
            risks.append("Délai ambitieux: risque de réduction de scope nécessaire")
        
        # Integration risks
        integrations = responses.get('T5', [])
        if isinstance(integrations, list) and len(integrations) > 5:
            risks.append("Nombreuses intégrations: risque de dépendances externes")
        
        if not risks:
            risks.append("Aucun risque majeur identifié")
        
        return risks
    
    def _suggest_next_steps(self, responses: Dict[str, Any]) -> List[str]:
        """Suggest next steps based on analysis."""
        return [
            "1. Créer les user stories détaillées pour chaque fonctionnalité",
            "2. Définir l'architecture technique détaillée",
            "3. Configurer les agents spécialisés pour chaque composant",
            "4. Établir le sprint planning (méthode Agile)",
            "5. Initialiser l'environnement de développement",
            "6. Démarrer par le MVP avec les fonctionnalités core"
        ]
