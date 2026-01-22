"""
Base Agent Class for the Multi-Agent Orchestration System
"""

from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
import json


class BaseAgent(ABC):
    """
    Abstract base class for all specialized agents in the system.
    Each agent has a specific role and can process requests within its domain.
    """
    
    def __init__(self, agent_id: str, name: str, description: str, capabilities: List[str]):
        self.agent_id = agent_id
        self.name = name
        self.description = description
        self.capabilities = capabilities
        self.memory: List[Dict[str, Any]] = []
    
    @abstractmethod
    def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process input and return results based on agent's specialization.
        
        Args:
            input_data: Dictionary containing the request data
            
        Returns:
            Dictionary containing the agent's response
        """
        pass
    
    def add_to_memory(self, interaction: Dict[str, Any]):
        """Store interaction in agent's memory for context."""
        self.memory.append(interaction)
    
    def get_config(self) -> Dict[str, Any]:
        """Return agent configuration as a dictionary."""
        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "description": self.description,
            "capabilities": self.capabilities
        }
    
    def export_config(self, filepath: str):
        """Export agent configuration to a JSON file."""
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.get_config(), f, indent=2, ensure_ascii=False)
