import React from "react";
import { useParams } from "react-router-dom";
import { productsList } from "./data/productsData";
import ProductCard from "./components/ProductCard";

type Props = {};

const SingleProductPage = (props: Props) => {
  const { id } = useParams();
  const product = productsList.find((product) => product.id === parseInt(id!));
  const similarProducts = productsList.filter(
    (p) => p.category === product?.category && p.name !== product.name
  );
  return (
    <div className="flex flex-col gap-3 bg-white">
      {/* // single product */}
      <div className="flex justify-between gap-5 p-4 max-w-[800px] mx-auto">
        {product ? (
          <>
            <div className="w-[200px]">
              <img src={product.imageUrl} alt={product.name} className="" />
            </div>
            <div>
              <p className="font-bold">{product.name}</p>
              <p>{product.description}</p>
              <p className="font-bold">Rs. {product.price}</p>
              <p
                className={`${
                  product.stockItems > 0 ? "text-green-500" : "text-orange-500"
                }`}
              >
                Stock: {product.stockItems}
              </p>
            </div>
          </>
        ) : (
          <p>Product not found</p>
        )}
      </div>
      {/* // similar products */}
      <div className="bg-slate-100 flex flex-col gap-2 p-4">
        <h1 className="text-4xl font-bold text-center">
          Products you may like
        </h1>
        <div className="flex flex-wrap gap-2 justify-center p-4 flex-1">
          {similarProducts?.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
