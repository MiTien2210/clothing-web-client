import {
  HandbagIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Category } from "../types/category";
import type { Product } from "../types/product";
import { getCartApi } from "../api/cartApi";
import { getCategoriesApi } from "../api/categoriesApi";
import { getProductsApi } from "../api/productsApi";

const Header = () => {
  const navigate = useNavigate();
  const containerRefDesktop = useRef<HTMLDivElement>(null);
  const containerRefMobile = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadNavData = async () => {
      try {
        const categoriesRes = await getCategoriesApi();
        setCategories(categoriesRes.data);

        if (localStorage.getItem("accessToken")) {
          const cartRes = await getCartApi();
          setCartCount(
            cartRes.data.reduce((sum, item) => sum + item.quantity, 0),
          );
        }
      } catch (error) {
        console.error("Error loading header data", error);
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
      try {
        const res = await getProductsApi({ search: query.trim(), limit: 5 });
        setSuggestions(res.data.data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching suggestions", error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideDesktop = containerRefDesktop.current?.contains(target);
      const insideMobile = containerRefMobile.current?.contains(target);
      if (!insideDesktop && !insideMobile) {
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

  const renderSuggestionsDropdown = () => (
    <div className="absolute left-0 right-0 top-full mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden">
      {suggestions.length === 0 ? (
        <p className="px-4 py-3 text-sm text-zinc-400">
          Không tìm thấy sản phẩm phù hợp
        </p>
      ) : (
        suggestions.map((product) => (
          <button
            key={product.id}
            onClick={() => handleSelectSuggestion(product.id)}
            className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-800 text-zinc-200 transition-colors border-b border-zinc-800/50 last:border-b-0 flex items-center justify-between"
          >
            <span>{product.name}</span>
          </button>
        ))
      )}
    </div>
  );

  return (
    <header className="w-full bg-black text-white sticky top-0 z-50 border-b border-zinc-800">
      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 sm:gap-8">
          {/* 1. LOGO WITH HEARTS (Trái) */}
          <Link
            to="/"
            className="flex items-center gap-2 font-serif text-xl sm:text-2xl tracking-[0.2em] font-bold text-white shrink-0 hover:opacity-90 transition-opacity"
          >
            <HeartIcon size={18} weight="fill" className="text-white" />
            <span>KUOSE</span>
            <HeartIcon size={18} weight="fill" className="text-white" />
          </Link>

          {/* 2. SEARCH BAR (Giữa) */}
          <div
            ref={containerRefDesktop}
            className="relative flex-1 max-w-lg hidden md:block"
          >
            <div className="flex items-center gap-2.5 border border-zinc-700 bg-zinc-900/50 rounded-full h-10 px-4 focus-within:border-white transition-colors">
              <MagnifyingGlassIcon
                size={18}
                className="text-zinc-400 shrink-0"
              />
              <input
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onFocus={() => query.trim() && setShowDropdown(true)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-zinc-500"
              />
            </div>

            {showDropdown && renderSuggestionsDropdown()}
          </div>

          {/* 3. ICONS ACTION (Phải) */}
          <div className="flex items-center gap-5 shrink-0">
            {/* User Account */}
            <Link
              to={localStorage.getItem("accessToken") ? "/profile" : "/login"}
              className="p-1.5 hover:text-zinc-300 transition-colors"
              title="Tài khoản"
            >
              <UserIcon size={22} />
            </Link>

            {/* Wishlist */}
            <button
              disabled
              title="Danh sách yêu thích (Sắp ra mắt)"
              aria-label="Wishlist"
              className="p-1.5 hover:text-zinc-300 transition-colors relative opacity-70 cursor-not-allowed"
            >
              <HeartIcon size={22} />
              <span className="absolute -top-1 -right-1.5 bg-zinc-700 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                0
              </span>
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-1.5 hover:text-zinc-300 transition-colors relative"
              title="Giỏ hàng"
            >
              <HandbagIcon size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar Mobile */}
        <div className="relative pb-3 md:hidden" ref={containerRefMobile}>
          <div className="flex items-center gap-2 border border-zinc-700 bg-zinc-900/50 rounded-full h-9 px-3">
            <MagnifyingGlassIcon size={16} className="text-zinc-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => query.trim() && setShowDropdown(true)}
              placeholder="Tìm kiếm..."
              className="w-full bg-transparent border-none outline-none text-xs text-white placeholder:text-zinc-500"
            />
          </div>

          {showDropdown && renderSuggestionsDropdown()}
        </div>
      </div>

      {/* Lower Category Navigation Bar */}
      {categories.length > 0 && (
        <nav className="border-t border-zinc-800/80 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center justify-center gap-8 py-2.5 text-xs sm:text-sm font-medium tracking-wider uppercase overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {categories.map((category) => (
                <li key={category.id} className="shrink-0">
                  <Link
                    to={`/categories/${category.id}`}
                    className="text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap py-1"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
