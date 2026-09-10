import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCategoryByIdApi } from "../api/categoriesApi";
import { getProductsApi } from "../api/productsApi";
import type { Category } from "../types/category";
import type { Product } from "../types/product";

const PAGE_SIZE = 12;

const CategoryContent = ({ id }: { id: string }) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategoryPage = async () => {
      const [categoryRes, productsRes] = await Promise.all([
        getCategoryByIdApi(id),
        getProductsApi({
          categoryId: id,
          page,
          limit: PAGE_SIZE,
          sortBy: "newest",
        }),
      ]);
      setCategory(categoryRes.data);
      setProducts(productsRes.data.data);
      setTotal(productsRes.data.total);
    };

    loadCategoryPage().finally(() => setLoading(false));
  }, [id, page]);

  if (loading) {
    return <p className="text-sm text-neutral-400">Loading...</p>;
  }

  if (!category) {
    return <p className="text-sm text-neutral-400">Category not found</p>;
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <p className="text-xs text-neutral-400 mb-6">
        <Link to="/" className="hover:text-black">
          Home
        </Link>
        {category.parent && (
          <>
            {" / "}
            <Link
              to={`/categories/${category.parent.id}`}
              className="hover:text-black"
            >
              {category.parent.name}
            </Link>
          </>
        )}
        {" / "}
        <span>{category.name}</span>
      </p>

      <h1 className="text-2xl font-bold mb-4">{category.name}</h1>

      {category.children.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {category.children.map((child) => (
            <Link
              key={child.id}
              to={`/categories/${child.id}`}
              className="h-9 px-4 flex items-center border border-neutral-300 rounded-lg text-sm font-medium hover:border-black transition-colors"
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-sm text-neutral-400">
          No products in this category yet
        </p>
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="h-9 px-4 border border-neutral-300 rounded-lg text-sm font-medium disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-neutral-500">
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="h-9 px-4 border border-neutral-300 rounded-lg text-sm font-medium disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-6 md:py-8">
      <CategoryContent key={id} id={id} />
    </div>
  );
};

export default CategoryPage;
