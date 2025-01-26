import { Product, productsList } from "./data/productsData";
import ProductCard from "./components/ProductCard";

const ProductPage = () => {
  return (
    <div className="flex gap-4 flex-wrap justify-center p-4">
      {productsList &&
        productsList.map((product: Product) => {
          return <ProductCard key={product.id} product={product} />;
        })}
    </div>
  );
};

export default ProductPage;
