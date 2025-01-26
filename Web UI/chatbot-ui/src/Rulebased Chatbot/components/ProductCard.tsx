import { Product } from "../data/productsData";
import { Link } from "react-router-dom";

type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
  return (
    <Link to={`/rule-based-chatbot/${product.id}`}>
      <div className="w-[250px] h-[330px] flex flex-col bg-white rounded-md shadow-sm cursor-pointer">
        <div className="w-[150px] h-[150px] bg-gray-200 m-1 self-center rounded-md">
          <img
            src={product.imageUrl}
            className="object-fill w-full h-full rounded-md"
          />
        </div>

        <div className="p-2">
          <p className="font-semibold">{product.name}</p>
          <p className="text-slate-800 text-sm">{product.description}</p>
          <p className="font-bold">Rs. {product.price}</p>
          <p
            className={`${
              product.stockItems > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            Stock: {product.stockItems}
          </p>
        </div>
      </div>{" "}
    </Link>
  );
};

export default ProductCard;
