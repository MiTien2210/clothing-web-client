import {
  HandbagIcon,
  HeartIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../types/product";
import type { Category } from "../types/category";
import { getCategoriesApi } from "../api/categoriesApi";
import { getCartApi } from "../api/cartApi";
import { getProductsApi } from "../api/productsApi";

const Header = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadNavData = async () => {
      const categoriesRes = await getCategoriesApi();
      setCategories(categoriesRes.data);

      if (localStorage.getItem("accessToken")) {
        const cartRes = await getCartApi();
        setCartCount(
          cartRes.data.reduce((sum, item) => sum + item.quantity, 0),
        );
      }
    };

    loadNavData();
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (!query.trim()) return;

    const timer = setTimeout(async () => {
      const res = await getProductsApi({ search: query.trim(), limit: 5 });
      setSuggestions(res.data.data);
      setShowDropdown(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = (id: string) => {
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
    navigate(`/products/${id}`);
  };
  return (
    <div className="w-full overflow-x-hidden bg-black">
      <div className="max-w-225 mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center gap-3 md:gap-5">
          <Link
            to="/"
            className="font-serif text-xl sm:text-2xl text-white tracking-widest shrink-0 order-1"
          >
            <div className="flex items-center gap-1">
              <HeartIcon size={18} weight="fill" className="text-white" />
              KUOSE
              <HeartIcon size={18} weight="fill" className="text-white" />
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-1 text-lg shrink-0 ml-auto order-2 md:order-3">
            <button
              disabled
              title="Coming soon"
              aria-label="Wishlist"
              className="flex items-center gap-1 "
            >
              <HeartIcon size={20} weight="fill" className="text-white" />
              <span className="text-sm sm:text-base text-white">0</span>
            </button>
            <Link
              to="/cart"
              className="flex items-center gap-1 sm:ml-2.5 text-white"
            >
              <HandbagIcon size={20} weight="bold" />
              <span className="text-sm sm:text-base text-white">
                {cartCount}
              </span>
            </Link>
          </div>

          <div
            ref={containerRef}
            className="relative order-3 md:order-2 w-full md:w-auto md:flex-1"
          >
            <div className="flex items-center gap-2.5 border border-white rounded-lg h-9 px-3">
              <MagnifyingGlassIcon
                size={15}
                weight="bold"
                className="text-white shrink-0"
              />
              <input
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onFocus={() => query.trim() && setShowDropdown(true)}
                placeholder="Search for products"
                className="flex-1 min-w-0 border-none outline-none text-[13px] bg-transparent text-white placeholder:text-white/50"
              />
            </div>

            {showDropdown && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-black rounded-lg shadow-lg z-20 overflow-hidden">
                {suggestions.length === 0 ? (
                  <p className="px-3 py-3 text-sm text-black/50">
                    No products found
                  </p>
                ) : (
                  suggestions.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectSuggestion(product.id)}
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-black/5 text-black border-b border-black/10 last:border-b-0"
                    >
                      {product.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {categories.length > 0 && (
          <div className="flex gap-4 sm:gap-4.5 text-sm sm:text-base text-white uppercase mt-3.5 overflow-x-auto">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className="whitespace-nowrap shrink-0 hover:underline underline-offset-4 decoration-1"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Header;
