# sample db for status
status_db = [
    {
        "orderId": "ORD123",
        "status": "processing",
    },
    {
        "orderId": "ORD234",
        "status": "delivered",
    },
    {
        "orderId": "ORD986",
        "status": "shipping",
    },
    {
        "orderId": "ORD232",
        "status": "processing",
    },
    {
        "orderId": "ORD121",
        "status": "shipping",
    }
]

# response utterences
status_response_utterences = {
    "processing": [
        "Tapaiko order {orderId} processing hudei xa kripaya parkhanu hos.",
        "Hajurko order {orderId} processing hudei xa.",
        "{orderId} ko order processing stage ma cha."
    ],
    "shipping": [
        "Tapaiko order number {orderId} shipping hudei xa kehi din ma delivery hune cha.",
        "Hajurko order {orderId} shipping hudei cha."
    ],
    "delivered": [
        "Order: {orderId} deliver vai sakyo.",
        "Tapaiko saman {orderId} delivered vali sakeko cha."
    ]
}

import re
import random

class OrderStatusBot:
    def __init__(self):
        self.product_status = status_db
        self.response_utterences = status_response_utterences
        self.status_entities = {
            "orderId": None
        }
        
    def get_response(self):
        # first get the status of the order
        status = self._get_status()
        print(f"Got status: {status}")
        # generate response
        if status is not None:
            response = random.sample(self.response_utterences[status], 1)[0].format(orderId=self.status_entities["orderId"])
            return response
        else:
            return f"Bot: Hajurko orderid database ma xaina kripaya naya order garnu hos.\n"
        
    def _get_status(self) -> str:
        # get the entity if there is not
        self._get_entity()
        print(self.status_entities["orderId"])
        # after getting the entity fetch the order status with order ID entity
        if self.status_entities["orderId"] is not None:
            # print(f"Got the entity: {self.status_entities["orderId"]}")
            for order in self.product_status:
                if order["orderId"] == self.status_entities["orderId"]:
                    print(f"Found matching status {order}")
                    return order["status"]
            # order not found
            return None
    
    def _get_entity(self):
        """From the user query about order status get the entity which is orderId."""
        # ask the order id from the user
        # order_id_pattern = r"ORD\d+"
        order_id_pattern = r"(?:.*?)?(ORD\d+)(?:.*?)?"
        print("Bot: Tapaiko order id dinuhos\n")
        while True:
            user_response = input("Order ID: ")
            match = re.match(order_id_pattern, user_response)
            if match:
                # send the order number.
                self.status_entities["orderId"] = match.group(1)
                return
            print(f"Bot: Maaf garnuhos kripaya valid order number dinuhos jun ORD12345 jasto huncha.\n")
            
            
if __name__ == "__main__":
    chat = OrderStatusBot()
    print("Bot: Order Status check garne chatbot ma swagat cha.")
    while True:
        response = chat.get_response()
        print(f"Bot: {response}")
        again = input("Feri check garnu huncha? y/n")
        if again.strip().lower() == "n":
            print(f"Bot: Dhanyabaad hajur sanga chat garera khushi lagyo.")
            break