import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../types/product";
import { useState } from "react";
import { addCartItemApi } from "../api/cartApi";
import { CoatHangerIcon, HeartIcon } from "@phosphor-icons/react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const prices = product.variants.map((v) => v.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const hasPriceRange = new Set(prices).size > 1;

  const priceLabel =
    minPrice === null
      ? "—"
      : hasPriceRange
        ? `From ${minPrice.toLocaleString()}₫`
        : `${minPrice.toLocaleString()}₫`;

  const handleAddToCart = async () => {
    if (product.variants.length !== 1) {
      navigate(`/products/${product.id}`);
      return;
    }
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      await addCartItemApi({
        productVariantId: product.variants[0].id,
        quantity: 1,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 900);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <div className="relative bg-neutral-50 border border-neutral-100 rounded-lg aspect-3/4 flex items-center justify-center mb-2">
        <Link
          to={`/products/${product.id}`}
          className="absolute inset-0"
          aria-label={product.name}
        />

        <CoatHangerIcon
          size={26}
          className="text-neutral-400 pointer-events-none"
        />

        <button
          disabled
          title="Coming soon"
          aria-label="Toggle wishlist"
          className="absolute z-10 top-2 right-2 w-7 h-7 rounded-full bg-white flex items-center justify-center disabled:opacity-60"
        >
          <HeartIcon size={14} className="text-neutral-400" />
        </button>
      </div>

      <Link to={`/products/${product.id}`} className="block">
        <p className="text-[13px] mb-0.5 truncate">{product.name}</p>
        <p className="text-[13px] font-medium mb-1.5">{priceLabel}</p>
      </Link>

      <button
        onClick={handleAddToCart}
        disabled={adding || product.variants.length === 0}
        className="w-full h-8 text-xs border border-neutral-300 rounded-md hover:bg-neutral-50 disabled:opacity-40"
      >
        {added ? "Added" : adding ? "Adding..." : "Add to cart"}
      </button>
    </div>
  );
};
export default ProductCard;
