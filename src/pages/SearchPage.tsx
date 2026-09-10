import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  getProductsApi,
  getProductFiltersApi,
  type ProductFilters,
} from "../api/productsApi";
import { getCategoriesApi } from "../api/categoriesApi";
import type { Product } from "../types/product";
import type { Category } from "../types/category";

const PAGE_SIZE = 12;

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const size = searchParams.get("size") ?? "";
  const color = searchParams.get("color") ?? "";
  const material = searchParams.get("material") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "newest";
  const page = Number(searchParams.get("page") ?? "1");

  const [searchInput, setSearchInput] = useState(search);
  const [minPriceInput, setMinPriceInput] = useState(minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);

  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({
    sizes: [],
    colors: [],
    materials: [],
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFilterOptions = async () => {
      const [categoriesRes, filtersRes] = await Promise.all([
        getCategoriesApi(),
        getProductFiltersApi(),
      ]);
      setCategories(categoriesRes.data);
      setFilters(filtersRes.data);
    };

    loadFilterOptions();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      const res = await getProductsApi({
        search: search || undefined,
        categoryId: categoryId || undefined,
        size: size || undefined,
        color: color || undefined,
        material: material || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortBy: sortBy as "newest" | "price_asc" | "price_desc",
        page,
        limit: PAGE_SIZE,
      });
      setProducts(res.data.data);
      setTotal(res.data.total);
    };

    loadProducts().finally(() => setLoading(false));
  }, [
    search,
    categoryId,
    size,
    color,
    material,
    minPrice,
    maxPrice,
    sortBy,
    page,
  ]);

  const updateParams = (
    updates: Record<string, string | undefined>,
    resetPage = true,
  ) => {
    const params = Object.fromEntries(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params[key] = value;
      } else {
        delete params[key];
      }
    });
    if (resetPage) {
      delete params.page;
    }
    setSearchParams(params);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput || undefined });
  };

  const handleApplyPrice = () => {
    updateParams({
      minPrice: minPriceInput || undefined,
      maxPrice: maxPriceInput || undefined,
    });
  };

  const handleSortChange = (value: string) => {
    updateParams({ sortBy: value === "newest" ? undefined : value });
  };

  const goToPage = (nextPage: number) => {
    updateParams({ page: String(nextPage) }, false);
  };

  const renderChipGroup = (
    label: string,
    options: { value: string; label: string }[],
    selectedValue: string,
    onSelect: (value: string) => void,
  ) => (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-wide mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`h-9 px-4 border rounded-lg text-sm font-medium transition-colors ${
              selectedValue === option.value
                ? "bg-black text-white border-black"
                : "border-neutral-300 hover:border-black"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-6 md:py-8">
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search products..."
          className="w-full h-12 px-4 border border-neutral-300 rounded-lg text-base outline-none focus:border-black transition-colors"
        />
      </form>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        <aside>
          {categories.length > 0 &&
            renderChipGroup(
              "Product Type",
              categories.map((c) => ({ value: c.id, label: c.name })),
              categoryId,
              (value) =>
                updateParams({
                  categoryId: categoryId === value ? undefined : value,
                }),
            )}

          {filters.sizes.length > 0 &&
            renderChipGroup(
              "Size",
              filters.sizes.map((s) => ({ value: s, label: s })),
              size,
              (value) =>
                updateParams({ size: size === value ? undefined : value }),
            )}

          {filters.colors.length > 0 &&
            renderChipGroup(
              "Color",
              filters.colors.map((c) => ({ value: c, label: c })),
              color,
              (value) =>
                updateParams({ color: color === value ? undefined : value }),
            )}

          {/* {filters.materials.length > 0 &&
            renderChipGroup(
              "Material",
              filters.materials.map((m) => ({ value: m, label: m })),
              material,
              (value) =>
                updateParams({
                  material: material === value ? undefined : value,
                }),
            )} */}

          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wide mb-3">
              Price
            </p>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="number"
                min={0}
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                placeholder="Min"
                className="w-full h-9 px-3 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors"
              />
              <span className="text-neutral-400">-</span>
              <input
                type="number"
                min={0}
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                placeholder="Max"
                className="w-full h-9 px-3 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyPrice}
              className="w-full h-9 border border-neutral-300 rounded-lg text-sm font-medium hover:border-black transition-colors"
            >
              Apply
            </button>
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-neutral-400">
              {loading ? "Loading..." : `${total} products found`}
            </p>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="h-9 pl-3 pr-8 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors appearance-none bg-white"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
          </div>

          {!loading && products.length === 0 ? (
            <p className="text-sm text-neutral-400">
              No products found. Try adjusting your filters.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
                onClick={() => goToPage(page - 1)}
                className="h-9 px-4 border border-neutral-300 rounded-lg text-sm font-medium disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-neutral-500">
                Page {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
                className="h-9 px-4 border border-neutral-300 rounded-lg text-sm font-medium disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
