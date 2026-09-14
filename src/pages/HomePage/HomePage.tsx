import { useEffect, useState } from "react";
import { getProductsApi } from "../../api/productsApi";
import { getCategoriesApi } from "../../api/categoriesApi";
import ProductCard from "../../components/ProductCard";
import HeroBanner from "./components/HeroBanner";
import MembershipBanner from "./components/MembershipBanner";
import type { Product } from "../../types/product";
import type { Category } from "../../types/category";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      const [productsRes, categoriesRes] = await Promise.all([
        getProductsApi({ sortBy: "newest", limit: 20 }),
        getCategoriesApi(),
      ]);
      setProducts(productsRes.data.data);
      setCategories(categoriesRes.data);
    };

    loadHomeData().finally(() => setLoading(false));
  }, []);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category.id === activeCategory);

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-6 md:py-8">
      <HeroBanner />

      <div className="flex gap-2 overflow-x-auto mb-7">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border ${
            activeCategory === "all"
              ? "bg-black text-white border-transparent"
              : "border-neutral-300 text-neutral-600"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border ${
              activeCategory === c.id
                ? "bg-black text-white border-transparent"
                : "border-neutral-300 text-neutral-600"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="text-[15px] font-medium mb-3">Best sellers</p>

      {loading ? (
        <p className="text-sm text-neutral-400 mb-6">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-neutral-400 mb-6">No products yet</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 items-start mb-10">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <MembershipBanner />
    </div>
  );
};

export default HomePage;
