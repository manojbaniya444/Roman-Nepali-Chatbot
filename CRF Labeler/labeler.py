import json
import re
from typing import Dict

default_entities = ["Product", "Brand", "Category", "Order_Number", "Location", "Quantity"]

class DataLabeler:
    def __init__(self, entity_types=default_entities):
        # Define entity types with color coding for visualization
        self.colors = ['#FFDAB9', '#98FB98', '#87CEFA', '#DDA0DD', '#F0E68C', '#E6E6FA']
        self.entity_types = {
            entity_type: color for entity_type, color in zip(entity_types, self.colors)
        }
        
        self.labeled_data = []
    
    def label_sentence(self, sentence: str) -> Dict:
        """
        Label a sentence using BIO (Beginning, Inside, Outside) scheme
        Returns labeled tokens with their positions
        """
        tokens = sentence.split()
        labels = ['O'] * len(tokens)  # Initialize all as Outside
        token_spans = []
        
        current_pos = 0
        for token in tokens:
            token_spans.append((current_pos, current_pos + len(token)))
            current_pos += len(token) + 1  # +1 for space
            
        return {
            'text': sentence,
            'tokens': tokens,
            'spans': token_spans,
            'labels': labels
        }
    
    def save_labeled_data(self, filename: str):
        """Save labeled data to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.labeled_data, f, indent=2)
    
    def load_labeled_data(self, filename: str):
        """Load labeled data from JSON file"""
        with open(filename, 'r', encoding='utf-8') as f:
            self.labeled_data = json.load(f)