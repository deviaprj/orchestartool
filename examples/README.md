# Examples

This directory contains example usage of the OrchestarTool.

## Programmatic Example

The `programmatic_example.py` demonstrates how to use the orchestrator programmatically:

```bash
cd /home/runner/work/orchestartool/orchestartool
python examples/programmatic_example.py
```

This example:
1. Creates a new session for a "Social Network App" project
2. Defines responses for a social networking application
3. Analyzes the requirements
4. Generates user stories with tasks
5. Designs the technical architecture
6. Exports all configuration files

### Output

The example generates files in `examples/output/`:
- `social_network_specification.json` - Complete project specification
- `social_network_agents/` - Individual agent configuration files

## Creating Your Own Example

You can create your own example by:

1. Importing the orchestrator:
```python
from src.orchestrator import SuperCodexOrchestrator
```

2. Creating a new session:
```python
orchestrator = SuperCodexOrchestrator()
session_id = orchestrator.start_new_session("Your Project Name")
```

3. Defining your responses to the questionnaire (see the business and technical questions in the main README)

4. Running the analysis pipeline:
```python
orchestrator.analyze_requirements(responses)
orchestrator.generate_user_stories()
orchestrator.design_architecture()
orchestrator.generate_complete_specification()
```

5. Exporting the results:
```python
orchestrator.export_complete_spec("your_spec.json")
orchestrator.export_agent_configs("your_agents/")
```
