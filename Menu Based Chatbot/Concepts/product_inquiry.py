products = [
    {
        "stock": 10, # quantity in stock
        "productName": "Redmi Note 9", # name
        "price": 10000, # price
        "description": "Very nice redmi mobile", # description
        "category": "mobile", # category of the product
        "slug": "redmi-note-9" # to search when user provide product name
    },
    {
        "stock": 0,
        "productName": "Macbook M1 pro",
        "price": 240000,
        "description": "Very nice macbook laptop",
        "category": "laptop",
        "slug": "macbook-m1-pro"
    }
]

class ProductInquireBot:
    def __init__(self):
        self.products = products
        
    def get_response(self):
        #? 1: Greet the user and ask for product details which he/she want to search for
        query = input(f"Namaskar, hajurlai kun product ko barema jankari line man xa product ko name vanidinu hos.\n")
        products_match = self._get_matching_product(query)
        # product is match
        if products_match is not None:
            product_names = [product["productName"] for product in products_match]
            return f"{product_names}"
        else:
            # not product match from db
            return "Tyo product hami sanga xaina aile"
        #? 2: Ask what they want to look for in product
        #? 3: After getting all fetch the database 
        #? Send the response
        
    def _get_matching_product(self, query):
        """search the self.products and return the products which match the slug text"""
        query = query.lower()
        matching_list = []
        for product in self.products:
            # Split both query and slug into parts and check for any matches
            query_parts = set(query.split(" "))
            slug_parts = set(product["slug"].split('-'))
            if any(part in slug_parts for part in query_parts):
                matching_list.append(product)
        
        return matching_list if len(matching_list) > 0 else None
    
if __name__ == "__main__":
    chatbot = ProductInquireBot()
    response = chatbot.get_response()
    print(f"Bot: {response}")