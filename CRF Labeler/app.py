import json
from typing import List, Dict
import tkinter as tk
from tkinter import ttk
import re
from labeler import DataLabeler

class LabelingGUI:
    def __init__(self, labeler: DataLabeler):
        self.labeler = labeler
        self.current_sentence_idx = 0
        
        # Sample sentences for labeling
        self.sentences = list()
        self.is_file_loaded = False
        self.root = tk.Tk()
        self.root.title("Ecommerce Data Labeler")
        if not self.is_file_loaded:
            self.load_file()
            
        self.setup_gui()
        
    def load_file(self, filename: str = "./data/sentences.txt"):
        with open(filename, "r") as f:
            self.sentences = f.read().splitlines()
            self.is_file_loaded = True
    
    def setup_gui(self):
        # Main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Instructions
        ttk.Label(main_frame, text="Instructions:").grid(row=0, column=0, sticky=tk.W)
        ttk.Label(main_frame, text="1. Select text by dragging").grid(row=1, column=0, sticky=tk.W)
        ttk.Label(main_frame, text="2. Click entity type button").grid(row=2, column=0, sticky=tk.W)
        
        # Text widget for sentence
        self.text_widget = tk.Text(main_frame, height=3, width=50)
        self.text_widget.grid(row=3, column=0, pady=10)
        self.text_widget.insert('1.0', self.sentences[self.current_sentence_idx])
        
        # Entity type buttons
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=4, column=0, pady=10)
        
        for i, (entity_type, color) in enumerate(self.labeler.entity_types.items()):
            btn = tk.Button(button_frame, 
                          text=entity_type,
                          command=lambda t=entity_type: self.apply_label(t),
                          bg=color)
            btn.grid(row=i//3, column=i%3, padx=5, pady=2)
        
        # Navigation buttons
        nav_frame = ttk.Frame(main_frame)
        nav_frame.grid(row=5, column=0, pady=10)
        
        ttk.Button(nav_frame, text="Previous", command=self.prev_sentence).grid(row=0, column=0, padx=5)
        ttk.Button(nav_frame, text="Next", command=self.next_sentence).grid(row=0, column=1, padx=5)
        ttk.Button(nav_frame, text="Save", command=self.save_labels).grid(row=0, column=2, padx=5)
    
    def apply_label(self, entity_type: str):
        """Apply selected entity type to highlighted text"""
        try:
            start = self.text_widget.index("sel.first")
            end = self.text_widget.index("sel.last")
            
            # Remove any existing tags in the selection
            for tag in self.text_widget.tag_names():
                self.text_widget.tag_remove(tag, start, end)
            
            # Apply new tag
            self.text_widget.tag_add(entity_type, start, end)
            self.text_widget.tag_config(entity_type, 
                                      background=self.labeler.entity_types[entity_type])
            
        except tk.TclError:
            # No selection made
            pass
    
    def next_sentence(self):
        """Move to next sentence"""
        self.save_current_labels()
        self.current_sentence_idx = min(self.current_sentence_idx + 1, 
                                      len(self.sentences) - 1)
        self.load_sentence()
    
    def prev_sentence(self):
        """Move to previous sentence"""
        self.save_current_labels()
        self.current_sentence_idx = max(0, self.current_sentence_idx - 1)
        self.load_sentence()
    
    def load_sentence(self):
        """Load current sentence into text widget"""
        self.text_widget.delete('1.0', tk.END)
        self.text_widget.insert('1.0', self.sentences[self.current_sentence_idx])
    
    def save_current_labels(self):
        """Save labels for current sentence"""
        text = self.text_widget.get('1.0', tk.END).strip()
        entities = []
        
        for tag in self.text_widget.tag_names():
            if tag in self.labeler.entity_types:
                ranges = self.text_widget.tag_ranges(tag)
                for i in range(0, len(ranges), 2):
                    start = str(ranges[i]).split('.')
                    end = str(ranges[i+1]).split('.')
                    
                    entities.append({
                        'start': int(start[1]),
                        'end': int(end[1]),
                        'label': tag,
                        'text': text[int(start[1]):int(end[1])]
                    })
        
        self.labeler.labeled_data.append({
            'text': text,
            'entities': entities
        })
    
    def save_labels(self):
        """Save all labeled data"""
        self.save_current_labels()
        self.labeler.save_labeled_data('./data/labeled_data.json')
        print("Labels saved successfully!")
    
    def run(self):
        self.root.mainloop()

# Example usage
def main():
    labeler = DataLabeler()
    gui = LabelingGUI(labeler)
    gui.run()

if __name__ == "__main__":
    main()