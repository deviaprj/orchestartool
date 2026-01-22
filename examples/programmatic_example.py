"""
Example: Programmatic usage of the OrchestarTool

This example demonstrates how to use the orchestrator programmatically
to analyze requirements, generate user stories, and design architecture.
"""

import json
import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from orchestrator import SuperCodexOrchestrator


def main():
    """Example of programmatic usage."""
    
    # Initialize orchestrator
    orchestrator = SuperCodexOrchestrator()
    
    # Start a new session
    print("Starting new session...")
    session_id = orchestrator.start_new_session("Social Network App")
    print(f"Session ID: {session_id}\n")
    
    # Get the questionnaire (optional - to see what questions are available)
    questionnaire = orchestrator.get_questionnaire()
    print(f"Available questions: {len(questionnaire['business_questions'])} business + {len(questionnaire['technical_questions'])} technical\n")
    
    # Define responses for a social network application
    responses = {
        # Business questions
        "B1": "Réseau social - Application de partage de photos et vidéos",
        "B2": ["Grand public (B2C)", "Partenaires/Revendeurs"],
        "B3": "100,000 - 1M utilisateurs",
        "B4": [
            "Authentification/Gestion utilisateurs",
            "Messagerie/Chat",
            "Notifications push",
            "Upload/Gestion de fichiers",
            "Géolocalisation"
        ],
        "B5": "MVP en 1-2 mois",
        "B6": "Budget limité (projet personnel/startup)",
        
        # Technical questions
        "T1": ["Cross-platform (React Native, Flutter)"],
        "T2": ["React"],
        "T3": ["Node.js (Express, NestJS)"],
        "T4": ["NoSQL Document (MongoDB, Firestore)", "NoSQL Key-Value (Redis, DynamoDB)"],
        "T5": [
            "Authentification sociale (Google, Facebook, Apple)",
            "Cloud Storage (AWS S3, Google Cloud Storage)",
            "Email (SendGrid, Mailgun)"
        ],
        "T6": ["Cloud AWS", "Serverless (AWS Lambda, Cloud Functions)"],
        "T7": ["Conformité RGPD", "Encryption des données (at rest et in transit)"],
        "T8": ["WebSockets pour chat/messaging", "Notifications push", "Synchronisation temps réel"]
    }
    
    # Step 1: Analyze requirements
    print("Step 1: Analyzing requirements...")
    analysis_result = orchestrator.analyze_requirements(responses)
    
    if analysis_result['status'] == 'success':
        analysis = analysis_result['analysis']
        print(f"✓ Project Type: {analysis['project_type']}")
        print(f"✓ Complexity: {analysis['complexity_level']}")
        print(f"✓ Timeline: {analysis['estimated_timeline']}")
        print(f"✓ Risks: {len(analysis['key_risks'])} identified\n")
    else:
        print(f"✗ Error: {analysis_result['message']}")
        return
    
    # Step 2: Generate user stories
    print("Step 2: Generating user stories...")
    stories_result = orchestrator.generate_user_stories()
    
    if stories_result['status'] == 'success':
        stories = stories_result['user_stories']
        total_points = sum(s['story_points'] for s in stories)
        total_hours = sum(sum(t['estimated_hours'] for t in s['tasks']) for s in stories)
        print(f"✓ Generated {len(stories)} user stories")
        print(f"✓ Total story points: {total_points}")
        print(f"✓ Estimated hours: {total_hours}h\n")
    else:
        print(f"✗ Error: {stories_result['message']}")
        return
    
    # Step 3: Design architecture
    print("Step 3: Designing architecture...")
    arch_result = orchestrator.design_architecture()
    
    if arch_result['status'] == 'success':
        architecture = arch_result['architecture']
        agents = arch_result['specialized_agents']
        print(f"✓ Architecture pattern: {architecture['architecture_pattern']}")
        print(f"✓ Specialized agents: {len(agents)}")
        print(f"✓ Components: {len(architecture['components'])}\n")
    else:
        print(f"✗ Error: {arch_result['message']}")
        return
    
    # Step 4: Generate complete specification
    print("Step 4: Generating complete specification...")
    spec_result = orchestrator.generate_complete_specification()
    
    if spec_result['status'] == 'success':
        spec = spec_result['specification']
        print(f"✓ Complete specification generated")
        print(f"✓ Agent assignments: {len(spec['agent_assignments'])}\n")
    else:
        print(f"✗ Error: {spec_result['message']}")
        return
    
    # Step 5: Export files
    print("Step 5: Exporting configuration files...")
    
    # Create examples output directory
    os.makedirs("examples/output", exist_ok=True)
    
    # Export complete specification
    spec_filepath = "examples/output/social_network_specification.json"
    export_result = orchestrator.export_complete_spec(spec_filepath)
    if export_result['status'] == 'success':
        print(f"✓ Specification exported to: {spec_filepath}")
    
    # Export agent configs
    configs_dir = "examples/output/social_network_agents"
    configs_result = orchestrator.export_agent_configs(configs_dir)
    if configs_result['status'] == 'success':
        print(f"✓ Agent configs exported to: {configs_dir}/")
        print(f"  ({len(configs_result['generated_files'])} files)\n")
    
    # Display summary
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Project: {spec['metadata']['project_name']}")
    print(f"Session ID: {spec['metadata']['session_id']}")
    print(f"\nUser Stories: {len(stories)}")
    for story in stories[:3]:
        print(f"  • [{story['id']}] {story['title']} ({story['priority']} priority)")
    if len(stories) > 3:
        print(f"  ... and {len(stories) - 3} more")
    
    print(f"\nSpecialized Agents: {len(agents)}")
    for agent in agents:
        print(f"  • {agent['name']} - {agent['role']}")
    
    print("\n" + "=" * 80)
    print("All files generated successfully!")
    print("Use these configurations to initialize the Super Codex autonomous system.")
    print("=" * 80)


if __name__ == '__main__':
    main()
