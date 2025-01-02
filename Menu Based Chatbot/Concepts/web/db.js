function getName() {
  return "John";
}

const statusDb = [
  { orderId: "ORD123", status: "processing" },
  { orderId: "ORD234", status: "delivered" },
  { orderId: "ORD986", status: "shipping" },
  { orderId: "ORD232", status: "processing" },
  { orderId: "ORD121", status: "shipping" },
];

const productsDb = [
  {
    id: 1,
    name: "laptop",
    details: "Dell Laptop, 8GB RAM, 256GB SSD",
    price: 85000,
  },
  {
    id: 2,
    name: "mobile",
    details: "Samsung Galaxy A52, 128GB Storage",
    price: 35000,
  },
  {
    id: 3,
    name: "headphone",
    details: "Sony Wireless Headphones",
    price: 8000,
  },
  {
    id: 4,
    name: "watch",
    details: "Smart Watch with Heart Rate Monitor",
    price: 12000,
  },
];

const statusResponseUtterances = {
  processing: [
    "Tapaiko order {orderId} processing hudei xa kripaya parkhanu hos.",
    "Hajurko order {orderId} processing hudei xa.",
    "{orderId} ko order processing stage ma cha.",
  ],
  shipping: [
    "Tapaiko order number {orderId} shipping hudei xa kehi din ma delivery hune cha.",
    "Hajurko order {orderId} shipping hudei cha.",
  ],
  delivered: [
    "Order: {orderId} deliver vai sakyo.",
    "Tapaiko saman {orderId} delivered vali sakeko cha.",
  ],
};

export { statusDb, productsDb, statusResponseUtterances };
export default getName;
