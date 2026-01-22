"""
Command-line interface for the Super Codex Orchestrator
"""

import json
import sys
import os
from typing import Dict, Any

# Add src to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from orchestrator import SuperCodexOrchestrator


def print_header(title: str):
    """Print formatted header."""
    print("\n" + "=" * 80)
    print(f"  {title}")
    print("=" * 80 + "\n")


def print_section(title: str):
    """Print section title."""
    print(f"\n--- {title} ---\n")


def display_questions(questions: list, title: str):
    """Display formatted questions."""
    print_section(title)
    for i, q in enumerate(questions, 1):
        print(f"{i}. {q['question']}")
        if q['type'] in ['choice', 'multi_select']:
            for j, option in enumerate(q['options'], 1):
                print(f"   {chr(96+j)}) {option}")
        elif q['type'] == 'text' and 'examples' in q:
            print(f"   Exemples: {', '.join(q['examples'])}")
        print()


def display_analysis(analysis: Dict[str, Any]):
    """Display requirement analysis results."""
    print_section("ANALYSE DES BESOINS")
    
    print(f"Type de projet: {analysis['project_type']}")
    print(f"Niveau de complexité: {analysis['complexity_level']}")
    print(f"Timeline estimée: {analysis['estimated_timeline']}")
    
    print("\nArchitecture recommandée:")
    arch = analysis['recommended_architecture']
    for component, techs in arch.items():
        if techs:
            print(f"  - {component.capitalize()}: {', '.join(techs)}")
    
    print("\nRisques identifiés:")
    for risk in analysis['key_risks']:
        print(f"  • {risk}")
    
    print("\nProchaines étapes:")
    for step in analysis['next_steps']:
        print(f"  {step}")


def display_user_stories(stories: list):
    """Display user stories."""
    print_section(f"USER STORIES ({len(stories)} générées)")
    
    for story in stories:
        print(f"\n[{story['id']}] {story['title']} (Priorité: {story['priority']}, Points: {story['story_points']})")
        print(f"Description: {story['description']}")
        
        print("Critères d'acceptance:")
        for criteria in story['acceptance_criteria']:
            print(f"  ✓ {criteria}")
        
        print(f"Tâches ({len(story['tasks'])} tâches, ~{sum(t['estimated_hours'] for t in story['tasks'])}h):")
        for task in story['tasks']:
            print(f"  [{task['id']}] {task['title']} ({task['estimated_hours']}h)")


def display_architecture(architecture: Dict[str, Any]):
    """Display architecture design."""
    print_section("ARCHITECTURE TECHNIQUE")
    
    arch_spec = architecture['architecture']
    print(f"Pattern: {arch_spec['architecture_pattern']}\n")
    
    print("Composants:")
    for component_name, component_info in arch_spec['components'].items():
        print(f"\n  {component_name.upper()}:")
        print(f"    Type: {component_info['type']}")
        print(f"    Description: {component_info['description']}")
        if 'technologies' in component_info:
            print(f"    Technologies: {', '.join(component_info['technologies'])}")
    
    print("\n\nAgents Spécialisés:")
    for agent in architecture['specialized_agents']:
        print(f"\n  [{agent['agent_id']}] {agent['name']}")
        print(f"    Rôle: {agent['role']}")
        print(f"    Technologies: {', '.join(agent['technologies'])}")


def interactive_mode():
    """Run interactive questionnaire mode."""
    print_header("SUPER CODEX ORCHESTRATOR - Mode Interactif")
    print("Expert Architecte de Systèmes Multi-Agents")
    print("Analyse de demande: Création d'applications web et mobiles\n")
    
    orchestrator = SuperCodexOrchestrator()
    
    # Get project name
    project_name = input("Nom du projet: ").strip()
    if not project_name:
        project_name = "Mon Application"
    
    session_id = orchestrator.start_new_session(project_name)
    print(f"\nSession démarrée: {session_id}")
    
    # Get questionnaire
    questionnaire = orchestrator.get_questionnaire()
    
    if questionnaire['status'] != 'success':
        print(f"Erreur: {questionnaire['message']}")
        return
    
    business_questions = questionnaire['business_questions']
    technical_questions = questionnaire['technical_questions']
    
    # Display all questions
    display_questions(business_questions, "QUESTIONS BUSINESS & OBJECTIFS")
    display_questions(technical_questions, "QUESTIONS TECHNIQUES")
    
    print("\n" + "=" * 80)
    print("Les questions ont été affichées ci-dessus.")
    print("Pour une démo complète, utilisez le mode exemple avec des réponses pré-remplies.")
    print("=" * 80)


def example_mode():
    """Run with example responses."""
    print_header("SUPER CODEX ORCHESTRATOR - Mode Exemple")
    print("Génération d'une spécification complète pour une application E-commerce\n")
    
    orchestrator = SuperCodexOrchestrator()
    session_id = orchestrator.start_new_session("E-commerce Platform MVP")
    
    print(f"Session: {session_id}\n")
    
    # Example responses for an e-commerce platform
    example_responses = {
        "B1": "E-commerce - Plateforme de vente en ligne",
        "B2": ["Grand public (B2C)", "Administrateurs système"],
        "B3": "10,000 - 100,000 utilisateurs",
        "B4": [
            "Authentification/Gestion utilisateurs",
            "Paiement en ligne",
            "Notifications push",
            "Upload/Gestion de fichiers",
            "Analytics/Reporting"
        ],
        "B5": "Version complète en 3-6 mois",
        "B6": "Budget moyen (PME)",
        "T1": ["Cross-platform (React Native, Flutter)", "Progressive Web App (PWA)"],
        "T2": ["React", "Next.js (React avec SSR)"],
        "T3": ["Node.js (Express, NestJS)", "Python (Django, FastAPI, Flask)"],
        "T4": ["SQL (PostgreSQL, MySQL)", "NoSQL Key-Value (Redis, DynamoDB)"],
        "T5": [
            "Payment (Stripe, PayPal)",
            "Authentification sociale (Google, Facebook, Apple)",
            "Cloud Storage (AWS S3, Google Cloud Storage)",
            "Email (SendGrid, Mailgun)",
            "Analytics (Google Analytics, Mixpanel)"
        ],
        "T6": ["Cloud AWS", "Container (Docker, Kubernetes)"],
        "T7": ["Conformité RGPD", "Authentification 2FA/MFA", "Conformité PCI-DSS (paiement)"],
        "T8": ["Notifications push", "Synchronisation temps réel"]
    }
    
    # Step 1: Analyze requirements
    print("Étape 1: Analyse des besoins...")
    analysis_result = orchestrator.analyze_requirements(example_responses)
    if analysis_result['status'] == 'success':
        display_analysis(analysis_result['analysis'])
    
    # Step 2: Generate user stories
    print("\n" + "=" * 80)
    print("Étape 2: Génération des user stories...")
    stories_result = orchestrator.generate_user_stories()
    if stories_result['status'] == 'success':
        display_user_stories(stories_result['user_stories'][:5])  # Show first 5
        if len(stories_result['user_stories']) > 5:
            print(f"\n... et {len(stories_result['user_stories']) - 5} autres user stories")
    
    # Step 3: Design architecture
    print("\n" + "=" * 80)
    print("Étape 3: Conception de l'architecture...")
    arch_result = orchestrator.design_architecture()
    if arch_result['status'] == 'success':
        display_architecture(arch_result)
    
    # Step 4: Generate complete specification
    print("\n" + "=" * 80)
    print("Étape 4: Génération de la spécification complète...")
    spec_result = orchestrator.generate_complete_specification()
    
    if spec_result['status'] == 'success':
        # Export to files
        import os
        output_dir = "output"
        os.makedirs(output_dir, exist_ok=True)
        
        # Export complete spec
        spec_file = os.path.join(output_dir, "complete_specification.json")
        export_result = orchestrator.export_complete_spec(spec_file)
        print(f"\n✓ Spécification complète: {spec_file}")
        
        # Export agent configs
        agent_configs_dir = os.path.join(output_dir, "agent_configs")
        config_result = orchestrator.export_agent_configs(agent_configs_dir)
        if config_result['status'] == 'success':
            print(f"✓ Configurations agents: {agent_configs_dir}/")
            print(f"  ({len(config_result['generated_files'])} fichiers générés)")
        
        print_section("ASSIGNATION DES AGENTS")
        assignments = spec_result['specification']['agent_assignments']
        for assignment in assignments:
            agents_str = ', '.join(assignment['assigned_agents'])
            coord_flag = " [COORDINATION REQUISE]" if assignment['coordination_required'] else ""
            print(f"[{assignment['story_id']}] {assignment['story_title']}")
            print(f"  → Agents: {agents_str}{coord_flag}\n")
    
    print("\n" + "=" * 80)
    print("GÉNÉRATION TERMINÉE !")
    print("=" * 80)
    print("\nFichiers générés dans le répertoire 'output/':")
    print("  - complete_specification.json: Spécification complète du projet")
    print("  - agent_configs/: Fichiers de configuration pour chaque agent spécialisé")
    print("\nCes fichiers peuvent être utilisés pour:")
    print("  1. Déléguer les tâches aux agents spécialisés")
    print("  2. Configurer le Super Codex pour le développement autonome")
    print("  3. Suivre le sprint planning en méthode Agile")


def main():
    """Main entry point."""
    if len(sys.argv) > 1 and sys.argv[1] == '--interactive':
        interactive_mode()
    else:
        example_mode()


if __name__ == '__main__':
    main()
