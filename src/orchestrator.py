"""
Super Codex Orchestrator - Main orchestration system for multi-agent coordination
"""

from typing import Dict, List, Any
import json
from datetime import datetime
from agents.requirement_analyst_agent import RequirementAnalystAgent
from agents.user_story_agent import UserStoryAgent
from agents.architecture_agent import ArchitectureAgent


class SuperCodexOrchestrator:
    """
    Main orchestrator that coordinates specialized agents to analyze requirements,
    generate user stories, and design architecture for web/mobile applications.
    """
    
    def __init__(self):
        self.requirement_analyst = RequirementAnalystAgent()
        self.user_story_generator = UserStoryAgent()
        self.architecture_designer = ArchitectureAgent()
        
        self.session_data = {
            "session_id": None,
            "project_name": None,
            "responses": {},
            "analysis": None,
            "user_stories": None,
            "architecture": None,
            "created_at": None
        }
    
    def start_new_session(self, project_name: str) -> str:
        """Start a new requirement gathering session."""
        session_id = f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        self.session_data = {
            "session_id": session_id,
            "project_name": project_name,
            "responses": {},
            "analysis": None,
            "user_stories": None,
            "architecture": None,
            "created_at": datetime.now().isoformat()
        }
        
        return session_id
    
    def get_questionnaire(self) -> Dict[str, Any]:
        """
        Get complete questionnaire for requirement gathering.
        
        Returns:
            Dictionary with business and technical questions
        """
        result = self.requirement_analyst.process({
            'request_type': 'get_all_questions'
        })
        
        return result
    
    def analyze_requirements(self, responses: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze user responses and generate insights.
        
        Args:
            responses: Dictionary of user responses to questions
            
        Returns:
            Analysis results including project type, complexity, architecture, risks
        """
        self.session_data['responses'] = responses
        
        # Analyze responses using Requirement Analyst Agent
        result = self.requirement_analyst.process({
            'request_type': 'analyze_responses',
            'responses': responses
        })
        
        if result['status'] == 'success':
            self.session_data['analysis'] = result['analysis']
        
        return result
    
    def generate_user_stories(self) -> Dict[str, Any]:
        """
        Generate user stories based on analysis.
        
        Returns:
            Dictionary with user stories and tasks
        """
        if not self.session_data['analysis']:
            return {
                "status": "error",
                "message": "Aucune analyse disponible. Veuillez d'abord analyser les besoins."
            }
        
        # Extract features from responses
        features = self.session_data['responses'].get('B4', [])
        if not isinstance(features, list):
            features = [features] if features else []
        
        # Generate user stories using User Story Agent
        result = self.user_story_generator.process({
            'analysis': self.session_data['analysis'],
            'features': features
        })
        
        if result['status'] == 'success':
            self.session_data['user_stories'] = result['user_stories']
        
        return result
    
    def design_architecture(self) -> Dict[str, Any]:
        """
        Design technical architecture based on requirements.
        
        Returns:
            Dictionary with architecture specification and specialized agents
        """
        if not self.session_data['analysis']:
            return {
                "status": "error",
                "message": "Aucune analyse disponible. Veuillez d'abord analyser les besoins."
            }
        
        # Design architecture using Architecture Agent
        result = self.architecture_designer.process({
            'analysis': self.session_data['analysis']
        })
        
        if result['status'] == 'success':
            self.session_data['architecture'] = result
        
        return result
    
    def generate_complete_specification(self) -> Dict[str, Any]:
        """
        Generate complete project specification including analysis, stories, and architecture.
        
        Returns:
            Complete specification dictionary
        """
        if not all([
            self.session_data['analysis'],
            self.session_data['user_stories'],
            self.session_data['architecture']
        ]):
            return {
                "status": "error",
                "message": "Spécification incomplète. Exécutez toutes les étapes d'abord."
            }
        
        specification = {
            "metadata": {
                "session_id": self.session_data['session_id'],
                "project_name": self.session_data['project_name'],
                "created_at": self.session_data['created_at'],
                "generated_at": datetime.now().isoformat()
            },
            "requirements": {
                "responses": self.session_data['responses'],
                "analysis": self.session_data['analysis']
            },
            "user_stories": self.session_data['user_stories'],
            "architecture": self.session_data['architecture'],
            "agent_assignments": self._assign_agents_to_stories()
        }
        
        return {
            "status": "success",
            "specification": specification,
            "message": "Spécification complète générée"
        }
    
    def _assign_agents_to_stories(self) -> List[Dict[str, Any]]:
        """Assign specialized agents to user stories."""
        assignments = []
        
        if not self.session_data['user_stories'] or not self.session_data['architecture']:
            return assignments
        
        agents = self.session_data['architecture'].get('specialized_agents', [])
        stories = self.session_data['user_stories']
        
        # Simple assignment logic based on story title/description
        for story in stories:
            assigned_agents = []
            story_text = f"{story['title']} {story['description']}".lower()
            
            # Frontend agent for UI-related stories
            if any(keyword in story_text for keyword in ['interface', 'catalogue', 'profil', 'dashboard', 'panier']):
                assigned_agents.append('codex_frontend_001')
            
            # Backend agent for API/business logic stories
            if any(keyword in story_text for keyword in ['api', 'authentification', 'paiement', 'commande', 'notifications']):
                assigned_agents.append('codex_backend_001')
            
            # Mobile agent for mobile-specific features
            if any(keyword in story_text for keyword in ['mobile', 'push', 'offline']):
                assigned_agents.append('codex_mobile_001')
            
            # Data agent for analytics/reporting
            if any(keyword in story_text for keyword in ['analytics', 'reporting', 'statistiques']):
                assigned_agents.append('codex_data_001')
            
            # Security agent for sensitive operations
            if any(keyword in story_text for keyword in ['authentification', 'paiement', 'sécurité']):
                assigned_agents.append('codex_security_001')
            
            # Default to frontend + backend if no specific match
            if not assigned_agents:
                assigned_agents = ['codex_frontend_001', 'codex_backend_001']
            
            assignments.append({
                "story_id": story['id'],
                "story_title": story['title'],
                "assigned_agents": assigned_agents,
                "coordination_required": len(assigned_agents) > 1
            })
        
        return assignments
    
    def export_agent_configs(self, output_dir: str) -> Dict[str, Any]:
        """
        Export individual agent configuration files.
        
        Args:
            output_dir: Directory to save config files
            
        Returns:
            Status and list of generated files
        """
        import os
        
        if not self.session_data['architecture']:
            return {
                "status": "error",
                "message": "Architecture non définie. Concevez l'architecture d'abord."
            }
        
        os.makedirs(output_dir, exist_ok=True)
        generated_files = []
        
        agents = self.session_data['architecture'].get('specialized_agents', [])
        
        for agent in agents:
            filename = f"{agent['agent_id']}_config.json"
            filepath = os.path.join(output_dir, filename)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(agent, f, indent=2, ensure_ascii=False)
            
            generated_files.append(filepath)
        
        return {
            "status": "success",
            "generated_files": generated_files,
            "message": f"Généré {len(generated_files)} fichiers de configuration"
        }
    
    def export_complete_spec(self, filepath: str) -> Dict[str, Any]:
        """
        Export complete specification to JSON file.
        
        Args:
            filepath: Path to save specification file
            
        Returns:
            Status message
        """
        spec_result = self.generate_complete_specification()
        
        if spec_result['status'] != 'success':
            return spec_result
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(spec_result['specification'], f, indent=2, ensure_ascii=False)
        
        return {
            "status": "success",
            "filepath": filepath,
            "message": "Spécification exportée avec succès"
        }
