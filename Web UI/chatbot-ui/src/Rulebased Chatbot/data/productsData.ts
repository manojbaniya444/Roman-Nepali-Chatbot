export type Product = {
  id: number;
  name: string;
  imageUrl: string;
  stockItems: number;
  price: number;
  category: string;
  description: string;
};

const productsList: Product[] = [
  {
    id: 1,
    name: "I Phone 11 Pro",
    imageUrl: "https://allelectronics.mos.ap-southeast-2.sufybkt.com/IPhone11.jpg",
    stockItems: 10,
    price: 130000,
    category: "mobile",
    description:
      "The iPhone 11 Pro features a triple-camera system and a powerful A13 Bionic chip.",
  },
  {
    id: 2,
    name: "Galaxy S21 Ultra",
    imageUrl:
      "https://allelectronics.mos.ap-southeast-2.sufybkt.com/samsung%20galaxy%20s21%20ultra.jpeg",
    stockItems: 5,
    price: 140000,
    category: "mobile",
    description:
      "The Galaxy S21 Ultra offers a stunning display and a versatile camera system.",
  },
  {
    id: 3,
    name: "Macbook Pro",
    imageUrl: "https://allelectronics.mos.ap-southeast-2.sufybkt.com/MacBook-Pro-2021.webp",
    stockItems: 2,
    price: 260000,
    category: "laptop",
    description:
      "The MacBook Pro is a high-performance laptop with a Retina display and M1 chip.",
  },
  {
    id: 4,
    name: "Redmi Note 9 Pro",
    imageUrl: "https://allelectronics.mos.ap-southeast-2.sufybkt.com/Redmi%20Note%209%20pro.jpg",
    stockItems: 1,
    price: 30000,
    category: "mobile",
    description:
      "The Redmi Note 9 Pro features a quad-camera setup and a large battery.",
  },
  {
    id: 5,
    name: "Sony Bravia TV",
    imageUrl: "https://allelectronics.mos.ap-southeast-2.sufybkt.com/sony%20image.jpeg",
    stockItems: 3,
    price: 90000,
    category: "tv",
    description:
      "The Sony Bravia TV offers stunning 4K resolution and smart TV capabilities.",
  },
  {
    id: 6,
    name: "Rolex Watch",
    imageUrl: "https://allelectronics.mos.ap-southeast-2.sufybkt.com/rolex%20watch.webp",
    stockItems: 0,
    price: 100000,
    category: "watch",
    description:
      "The Rolex Watch is a luxury timepiece known for its precision and craftsmanship.",
  },
  {
    id: 7,
    name: "Nikon D3500",
    imageUrl: "https://allelectronics.mos.ap-southeast-2.sufybkt.com/nikon%20d3500.jpg",
    stockItems: 1,
    price: 60000,
    category: "camera",
    description:
      "The Nikon D3500 is a beginner-friendly DSLR camera with excellent image quality.",
  },
  {
    id: 8,
    name: "Casio Calculator",
    imageUrl: "https://allelectronics.mos.ap-southeast-2.sufybkt.com/casio%20calculator.webp",
    stockItems: 2,
    category: "calculator",
    price: 2600,
    description:
      "Casio Calculator best for Engineering students but everyone can use it.",
  },
];

export { productsList };
