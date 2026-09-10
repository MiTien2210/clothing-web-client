import { Link } from "react-router-dom";
import { logoutApi } from "../api/authApi";
import type { Product } from "../types/product";
import { useEffect, useState } from "react";
import { getProductsApi } from "../api/productsApi";
import type { Category } from "../types/category";
import { getCategoriesApi } from "../api/categoriesApi";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

  useEffect(() => {
    const loadHomeData = async () => {
      const [productsRes, categoriesRes] = await Promise.all([
        getProductsApi({ sortBy: "newest", limit: 8 }),
        getCategoriesApi(),
      ]);
      setProducts(productsRes.data.data);
      setCategories(categoriesRes.data);
    };
    loadHomeData().finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch {
      // dù API lỗi vẫn cứ logout ở phía client
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };
  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-6 md:py-8">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-xl font-bold">KuoseWeb</h1>

        <Link
          to="/search"
          className="text-sm text-neutral-600 hover:text-black"
        >
          Search
        </Link>

        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="text-sm text-neutral-600 hover:text-black"
            >
              My profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-neutral-600 hover:text-black"
            >
              Log out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-sm text-neutral-600 hover:text-black"
          >
            Login
          </Link>
        )}
      </div>
      <h2 className="text-lg font-bold mb-4">New arrivals</h2>
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className="h-9 px-4 flex items-center border border-neutral-300 rounded-lg text-sm font-medium hover:border-black transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}
      {loading ? (
        <p className="text-sm text-neutral-400">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-neutral-400">No products yet</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="block"
            >
              <div className="aspect-[3/4] bg-neutral-100 rounded-xl mb-2" />
              <p className="text-sm font-medium truncate">{product.name}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export default HomePage;
