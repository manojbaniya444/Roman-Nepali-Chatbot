from typing import Dict, List, Tuple, Optional
from preprocess_text import preprocess_text

products_db = [
            {"id": 1, "name": "IPhone 11", "category": "mobile", "brand": "Apple", "price": 799.99},
            {"id": 2, "name": "Galaxy S21", "category": "mobile", "brand": "Samsung", "price": 699.99},
            {"id": 3, "name": "Sony Television", "category": "TV", "brand": "Sony", "price": 179.99},
            {"id": 5, "name": "Macbook Pro", "category": "laptop", "brand": "Apple", "price": 1299.99},
            {"id": 6, "name": "Redmi Note 9 pro", "category": "mobile", "brand": "Xiaomi", "price": 999.99},
        ]
order_db = [
            {
                "Id": "ORD12345",
                "status": "Processing"
            },
            {
                "Id": "ORD00000",
                "status": "Shipping"
            }
        ]
import random
from fuzzywuzzy import process, fuzz

class EcommerceBot:
    def __init__(self, intent_model, entity_model):
        self.intent_model = intent_model
        self.entity_model = entity_model
        
        self.order_db = order_db
        
        self.intent_handlers = {
            'payment_method': self._handle_payment_method,
            'order_status_inquiry': self._handle_order_status,
            'order_product': self._handle_order_product,
            'product_inquiry': self._handle_product_inquiry
        }
        
        self.dialogue_manager = {
            "intent": None,
            "intent_satisfied": True,
            "entity": [],
            "missing_entity": []
        }
        
        self.products_db = products_db
        
        # keep the context of the last intent and all the entities
        self.conversation_context = {}
        
    def process_message(self, user_message: str) -> str:
        intent = self._predict_intent(user_message)
        entities = self._extract_entities(user_message)
        
        print(f"Dialogue manager {self.dialogue_manager}")
        
        print(f"Intent: {intent}")
        print(f"Entities: {entities}")
        
        # if the last intent is not satisfied do not switch the intent
        if self.dialogue_manager["intent_satisfied"]:
             # handling the intent
            if intent in self.intent_handlers:
                self.dialogue_manager["intent"] = intent
                self.dialogue_manager["entity"] = entities
                response = self.intent_handlers[intent](entities)
            else:
                response = "Maaf garnu hola maile hajurko kura bujhna sakina."
        else:
            # collect other required entities
            for key, value in entities.items():
                if value is not None:
                    self.dialogue_manager["entity"][key] = value
                    # if the missing entity is found then remove it from the list
                    if key in self.dialogue_manager["missing_entity"] :
                        self.dialogue_manager["missing_entity"].remove(key)
            print("Intent is not satisfied so continuing on previous intent")
            response = self._handle_incomplete()
            
            
        return response
    
    def _reset_dialogue(self):
        self.dialogue_manager["intent"] = None
        self.dialogue_manager["intent_satisfied"] = True
        self.dialogue_manager["missing_entity"] = []
        self.dialogue_manager["entity"] = []
    
    def _predict_intent(self, sentence):
        text = preprocess_text(sentence)
        intent = self.intent_model.predict(text)
        return intent
    
    def _extract_entities(self, message: str) -> Dict[str, str]:
        entities = self.entity_model.predict(message)
        print(entities)
        return self._format_entities(entities, message.split())
    
    def fuzzy_search(self, search_term: str, search_type: str) -> List[Dict]:
        """
        Perform fuzzy search on products based on category, brand, or name
        """
        matches = []
        
        if search_type == 'category':
            # Get unique categories
            categories = set(product['category'] for product in self.products_db)
            matched_category, score = process.extractOne(search_term, categories)
            if score > 80:  # Threshold for matching
                matches = [p for p in self.products_db if p['category'] == matched_category]
                
        elif search_type == 'brand':
            # Get unique brands
            brands = set(product['brand'] for product in self.products_db)
            matched_brand, score = process.extractOne(search_term, brands)
            if score > 80:
                matches = [p for p in self.products_db if p['brand'] == matched_brand]
                
        else:  # Search by product name
            for product in self.products_db:
                score = fuzz.ratio(search_term.lower(), product['name'].lower())
                if score > 60:
                    matches.append(product)
        
        return matches
    
    def format_product_inquiry_message(self, matches: list[dict]):
        message = ""
        for i, product in enumerate(matches):
            if i == 0:
                msg = f"Hami sanga product Rs. {product["price"]} parne {product["name"]} xa\n"
                message += msg
            else:
                msg = f"Arko Hami sanga product {product["name"]} xa ra yaslai Rs. {product["price"]} parcha.\n"
                message += msg
            
        return message
    
    def _format_entities(self, entities: List, sentence: List) -> Dict[str, str]:
        formatted_entities = {
            "Location": None,
            "Product": None,
            "Brand": None,
            "Category": None,
            "Quantity": None,
            "Order_Number": None
        }
        
        for entity, word in zip(entities, sentence):
            # if the entity is present
            if entity in formatted_entities:
                # if it is a single word entity
                formatted_entities[entity] = word
            # if it is a more length word entity
            elif len(entity.split("-")) == 2: # handling the entity
                # check if the entity is the beginning or intermediate
                longer_entity = entity.split("-")
                if longer_entity[0] == "B":
                    formatted_entities[longer_entity[1]] = word
                elif longer_entity[0] == "I" and len(sentence) > 1: # might get I-Entity when single word predictiion
                    formatted_entities[longer_entity[1]] += " " + word
        # print(formatted_entities)  
        return formatted_entities
    
    def _handle_incomplete(self):
        intent = self.dialogue_manager["intent"]
        entity = self.dialogue_manager["entity"]
        missing_entity = self.dialogue_manager["missing_entity"]
        
        print(f"{intent}: Entity {entity} : Missing Entity {missing_entity}")
        
        if intent == "order_product":
            #? can get missing entity about "Product" | "Location" | "Quantity"
            # if there is still information need to get then ask
            if any(x not in entity for x in missing_entity):
                return f"Hajur malai  {", ".join(missing_entity)} pani vannuhos."
            # if got all then proceed to confirm with entity
            else:
                return self._handle_order_product(entity)
        elif intent == "product_inquiry":
            #? Can get missing entity about "Product" | "Brand" | "Category"
            if any(entity in self.dialogue_manager["entity"] for entity in ["Product", "Brand", "Category"]):
                return self._handle_product_inquiry(self.dialogue_manager["entity"])
            else:
                return "Kripaya kun product ko barema bujhna chahanu hunxa product ko naam, brand wa category bhannuhos."
        elif intent == "order_status_inquiry":
            #? Can get missing entity about "Order_Number"
            if "Order_Number" in missing_entity:
                return "Kripaya hajurko sahi order number dinuhos."
            if "Order_Number" not in entity:
                return "Order number provide garnuhos."
            return self._handle_order_status(entity)
        else:
            return self._handle_payment_method()
    
    def _update_context(self, intent: str, entities: Dict[str, str]):
        self.conversation_context["last_intent"] = intent
        self.conversation_context.update(entities)
        
    def _handle_payment_method(self, entities: Dict[str, str]) -> str:
        self.dialogue_manager["intent_satisfied"] = False
        response_sample = [
            "Hami esewa, khalti, mobile banking sabei payment method accept garxau.",
            "tapai esewa, khalti ya kunei mobile banking baata payment garna saknu huncha.",
        ]
        self._reset_dialogue()
        return random.sample(response_sample, 1)[0]
    
    def _handle_order_status(self, entities: Dict[str, str]) -> str:
        self.dialogue_manager["intent_satisfied"] = False
        if self.dialogue_manager["entity"]["Order_Number"] is None:
            self.dialogue_manager["missing_entity"] = ["Order_Number"]
            return "Kripaya malai hajurko order number dinuhos."
        for orders in self.order_db:
            # the order is found in database
            if orders["Id"] == self.dialogue_manager["entity"]["Order_Number"]:
                status = orders["status"]
                self._reset_dialogue()
                return f"Hajur ko order ko {status} hudei xa."
            else:
                # the order number is not in the database
                return f"Hajur ko order number {self.dialogue_manager["entity"]["Order_Number"]} vetiyena ek patak check garnu hos."
            
        return "Kripaya sahi order number dinuhos."
    
    def _handle_order_product(self, entities: Dict[str, str]) -> str:
        self.dialogue_manager["intent_satisfied"] = False
        needed = ["Product", "Quantity", "Location"]
        missing = [entity for entity in needed if entities[entity] is None]
        
        if len(missing) > 0:
            self.dialogue_manager["missing_entity"] = missing
            return f"Kripaya pura details dinuhos: {', '.join(missing)} pani vannuhos."
        
        matched_product = self.fuzzy_search(search_term=entities.get("Product"), search_type="name")
        
        if len(matched_product) == 0:
            # then probably got the wrong entity or product not available
            self.dialogue_manager["entity"]["Product"] = None
            return f"Maaf garnu hola {entities.get("Product")} available xaina."
        product = matched_product[0]
        
        self._reset_dialogue()
        return f"Tapaiko order confirm vayo {entities["Product"]}, total quantity:  {entities["Quantity"]} wata ra delivery location {entities["Location"]} total Cost Rs. {int(entities["Quantity"]) * product["price"]} hajur ko order number: ORD12345"
    
    def _handle_product_inquiry(self, entities: Dict[str, str]) -> str:
        self.dialogue_manager["intent_satisfied"] = False
        # get the entity from the dialogue manager
        product = self.dialogue_manager["entity"].get("Product")
        category = self.dialogue_manager["entity"].get("Category")
        brand = self.dialogue_manager["entity"].get("Brand")
        
        if product:
            matches = self.fuzzy_search(search_term=product, search_type="name")
            self._reset_dialogue()
            return self.format_product_inquiry_message(matches)
        elif brand:
            matches = self.fuzzy_search(search_term=brand, search_type="brand")
            self._reset_dialogue()
            return self.format_product_inquiry_message(matches)
        elif category:
            matches = self.fuzzy_search(category, "category")
            self._reset_dialogue()
            return self.format_product_inquiry_message(matches)
        else:
            self.dialogue_manager["missing_entity"] = ["Category", "Product", "Brand"]
            return "Kun product ko barema janna chahau huncha name, category wa brand vannu hola"