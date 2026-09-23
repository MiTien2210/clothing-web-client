import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  CaretRightIcon,
  TruckIcon,
  ArrowsClockwiseIcon,
} from "@phosphor-icons/react";
import {
  getProductByIdApi,
  getRelatedProductsApi,
} from "../../api/productsApi";
import type { Product } from "../../types/product";
import { addCartItemApi } from "../../api/cartApi";
import QuantityStepper from "../../components/QuantityStepper";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addMessage, setAddMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      const [productRes, relatedRes] = await Promise.all([
        getProductByIdApi(id),
        getRelatedProductsApi(id),
      ]);
      setProduct(productRes.data);
      setRelatedProducts(relatedRes.data);
      const firstVariant = productRes.data.variants[0];
      if (firstVariant) {
        setSelectedSize(firstVariant.size);
        setSelectedColor(firstVariant.color);
      }
    };

    loadProduct().finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-12">
        <p className="text-sm text-neutral-400">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-12">
        <p className="text-sm text-neutral-400">Product not found</p>
      </div>
    );
  }

  const sizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const colors = Array.from(new Set(product.variants.map((v) => v.color)));

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor,
  );

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setAddMessage("");

    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    try {
      await addCartItemApi({
        productVariantId: selectedVariant.id,
        quantity,
      });
      setAddMessage("Added to cart");
    } catch {
      setAddMessage("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-6 md:py-8">
      <p className="text-xs text-neutral-400 mb-6 flex items-center gap-1.5">
        <Link to="/" className="hover:text-black">
          Home
        </Link>
        <CaretRightIcon size={11} />
        <span>{product.category.name}</span>
      </p>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-start">
        <div className="w-full md:w-[340px] shrink-0 aspect-[3/4] bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-300 text-sm">
          No image yet
        </div>

        <div className="flex-1 w-full">
          <p className="text-xs text-neutral-400 mb-1.5">KUOSE</p>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

          <p className="text-xl font-serif mb-6">
            {selectedVariant
              ? `${selectedVariant.price.toLocaleString()}₫`
              : "Select a variant"}
          </p>

          {product.description && (
            <p className="text-sm text-neutral-500 mb-6">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-neutral-400">Size</p>
            <button
              type="button"
              disabled
              title="Coming soon"
              className="text-xs text-neutral-400 underline disabled:opacity-60"
            >
              Size guide
            </button>
          </div>
          <div className="flex gap-2 flex-wrap mb-4">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`h-9 px-4 border rounded-lg text-sm font-medium transition-colors ${
                  selectedSize === size
                    ? "bg-black text-white border-black"
                    : "border-neutral-300 hover:border-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <p className="text-xs text-neutral-400 mb-2">Color</p>
          <div className="flex gap-2 flex-wrap mb-6">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`h-9 px-4 border rounded-lg text-sm font-medium transition-colors ${
                  selectedColor === color
                    ? "bg-black text-white border-black"
                    : "border-neutral-300 hover:border-black"
                }`}
              >
                {color}
              </button>
            ))}
          </div>

          {selectedVariant ? (
            <p
              className={`text-xs mb-4 ${
                selectedVariant.stock_quantity === 0
                  ? "text-red-500"
                  : "text-neutral-400"
              }`}
            >
              {selectedVariant.stock_quantity === 0
                ? "Out of stock"
                : `${selectedVariant.stock_quantity} in stock`}
            </p>
          ) : (
            <p className="text-xs text-red-500 mb-4">
              This combination is not available
            </p>
          )}

          <p className="text-xs text-neutral-400 mb-2">Quantity</p>
          <div className="mb-5">
            <QuantityStepper
              value={quantity}
              min={1}
              max={selectedVariant?.stock_quantity}
              onChange={setQuantity}
            />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={handleAddToCart}
              disabled={
                !selectedVariant ||
                selectedVariant.stock_quantity === 0 ||
                addingToCart
              }
              className="flex-1 h-11 bg-black text-white rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-neutral-800 transition-colors"
            >
              {addingToCart ? "Adding..." : "Add to cart"}
            </button>
            <button
              disabled
              title="Coming soon"
              className="h-11 px-4 border border-neutral-300 rounded-lg text-sm font-medium disabled:opacity-40"
            >
              Wishlist
            </button>
          </div>

          <button
            disabled
            title="Coming soon"
            className="w-full h-11 rounded-lg text-sm font-medium border-[1.5px] border-neutral-800 disabled:opacity-40 mb-3"
          >
            Buy now
          </button>

          {addMessage && (
            <p className="text-xs text-neutral-500 mb-3">{addMessage}</p>
          )}

          {product.material && (
            <p className="text-xs text-neutral-400">
              Material: {product.material}
            </p>
          )}
          {product.care_instructions && (
            <p className="text-xs text-neutral-400 mt-1">
              Care: {product.care_instructions}
            </p>
          )}

          <div className="border-t border-neutral-200 mt-6 pt-4 flex gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <TruckIcon size={14} /> Free shipping over 1,200,000₫
            </span>
            <span className="flex items-center gap-1">
              <ArrowsClockwiseIcon size={14} /> 7-day returns
            </span>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-lg font-bold mb-4">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((related) => (
              <Link
                key={related.id}
                to={`/products/${related.id}`}
                className="block"
              >
                <div className="aspect-[3/4] bg-neutral-100 rounded-xl mb-2" />
                <p className="text-sm font-medium truncate">{related.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
