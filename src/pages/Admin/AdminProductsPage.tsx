import { useEffect, useState } from "react";
import {
  CaretDownIcon,
  PencilSimpleIcon,
  TrashIcon,
  TShirtIcon,
} from "@phosphor-icons/react";
import {
  getProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "../../api/productsApi";
import { getCategoriesApi } from "../../api/categoriesApi";
import type { Product } from "../../types/product";
import type { Category } from "../../types/category";
import Modal from "../../components/Modal";

type ProductForm = {
  name: string;
  categoryId: string;
  material: string;
  description: string;
  care_instructions: string;
};

const emptyForm: ProductForm = {
  name: "",
  categoryId: "",
  material: "",
  description: "",
  care_instructions: "",
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<ProductForm>(emptyForm);
  const [editError, setEditError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  function flattenCategories(
    cats: Category[],
    depth = 0,
  ): { id: string; name: string; depth: number }[] {
    return cats.flatMap((cat) => [
      { id: cat.id, name: cat.name, depth },
      ...flattenCategories(cat.children ?? [], depth + 1),
    ]);
  }

  const loadProducts = async () => {
    const res = await getProductsApi({ limit: 100 });
    setProducts(res.data.data);
  };

  const loadCategories = async () => {
    const res = await getCategoriesApi();
    setCategories(res.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch data khi mount là use case hợp lệ, rule này báo false positive cho pattern async fetch
    Promise.all([loadProducts(), loadCategories()]).finally(() =>
      setLoading(false),
    );
  }, []);

  const flatCategories = flattenCategories(categories);
  const categoriesInUse = new Set(products.map((p) => p.category.id)).size;

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.categoryId) {
      setError("Please choose a category");
      return;
    }

    setSubmitting(true);
    try {
      await createProductApi({
        name: form.name,
        categoryId: form.categoryId,
        material: form.material || undefined,
        description: form.description || undefined,
        care_instructions: form.care_instructions || undefined,
      });
      setForm(emptyForm);
      await loadProducts();
    } catch {
      setError("Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (product: Product) => {
    setEditTarget(product);
    setEditForm({
      name: product.name,
      categoryId: product.category.id,
      material: product.material ?? "",
      description: product.description ?? "",
      care_instructions: product.care_instructions ?? "",
    });
    setEditError("");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setEditError("");

    if (!editForm.categoryId) {
      setEditError("Please choose a category");
      return;
    }

    setSavingId(editTarget.id);
    try {
      await updateProductApi(editTarget.id, {
        name: editForm.name,
        categoryId: editForm.categoryId,
        material: editForm.material || undefined,
        description: editForm.description || undefined,
        care_instructions: editForm.care_instructions || undefined,
      });
      await loadProducts();
      setEditTarget(null);
    } catch {
      setEditError("Failed to save changes");
    } finally {
      setSavingId(null);
    }
  };

  const openDeleteModal = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeletingId(deleteTarget.id);
    try {
      await deleteProductApi(deleteTarget.id);
      await loadProducts();
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 py-6 md:py-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-1">
        Products management
      </h1>
      <p className="text-sm text-neutral-400 mb-6">
        Manage the items customers can browse and buy
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3.5 mb-6">
        <div className="bg-white border border-neutral-200 rounded-xl px-4 py-3.5">
          <p className="font-serif text-2xl leading-none">{products.length}</p>
          <p className="text-xs text-neutral-400 mt-1.5">Total products</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl px-4 py-3.5">
          <p className="font-serif text-2xl leading-none">{categoriesInUse}</p>
          <p className="text-xs text-neutral-400 mt-1.5">Categories in use</p>
        </div>
      </div>

      {/* Create form */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 mb-6">
        <h2 className="text-sm font-bold mb-4">Add new product</h2>
        <form onSubmit={handleCreateProduct}>
          <div className="flex flex-col md:flex-row gap-3 md:items-end">
            <div className="flex-1 min-w-0">
              <label className="block text-xs text-neutral-400 mb-1">
                Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-9 px-3 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors"
                required
              />
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-xs text-neutral-400 mb-1">
                Category
              </label>
              <div className="relative">
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  className="w-full h-9 pl-3 pr-8 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors appearance-none bg-white"
                  required
                >
                  <option value="" disabled>
                    Choose a category
                  </option>
                  {flatCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {"—".repeat(cat.depth)} {cat.name}
                    </option>
                  ))}
                </select>
                <CaretDownIcon
                  size={13}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-xs text-neutral-400 mb-1">
                Material
              </label>
              <input
                value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })}
                className="w-full h-9 px-3 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mt-3">
            <div className="flex-1 min-w-0">
              <label className="block text-xs text-neutral-400 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={2}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors resize-none"
              />
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-xs text-neutral-400 mb-1">
                Care instructions
              </label>
              <textarea
                value={form.care_instructions}
                onChange={(e) =>
                  setForm({ ...form, care_instructions: e.target.value })
                }
                rows={2}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="h-9 px-4 mt-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800 disabled:opacity-60 transition-colors"
          >
            {submitting ? "Adding..." : "Add product"}
          </button>
        </form>

        {error && <p className="text-red-600 text-xs mt-3">{error}</p>}
      </div>

      {/* List */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b border-neutral-100 bg-neutral-50">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
            Product
          </span>
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
            Actions
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-neutral-100 last:border-b-0 animate-pulse"
              >
                <div className="h-3.5 w-40 bg-neutral-200 rounded" />
                <div className="h-3.5 w-10 bg-neutral-100 rounded" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-neutral-400">
            <TShirtIcon size={28} />
            <p className="text-sm">No products yet</p>
          </div>
        ) : (
          <ul>
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between gap-3 px-4 sm:px-5 py-2.5 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-neutral-400 truncate">
                    {product.category.name}
                    {product.material ? ` · ${product.material}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(product)}
                    disabled={savingId === product.id}
                    title="Edit"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-black disabled:opacity-50 transition-colors"
                  >
                    <PencilSimpleIcon size={14} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(product.id, product.name)}
                    disabled={deletingId === product.id}
                    title="Delete"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 transition-colors"
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit modal */}
      <Modal
        isOpen={editTarget !== null}
        onClose={() => setEditTarget(null)}
        title="Edit product"
      >
        <form onSubmit={handleEditSubmit}>
          <div className="mb-3">
            <label className="block text-xs text-neutral-400 mb-1">Name</label>
            <input
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              autoFocus
              className="w-full h-9 px-3 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-xs text-neutral-400 mb-1">
              Category
            </label>
            <div className="relative">
              <select
                value={editForm.categoryId}
                onChange={(e) =>
                  setEditForm({ ...editForm, categoryId: e.target.value })
                }
                className="w-full h-9 pl-3 pr-8 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors appearance-none bg-white"
                required
              >
                {flatCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {"—".repeat(cat.depth)} {cat.name}
                  </option>
                ))}
              </select>
              <CaretDownIcon
                size={13}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-xs text-neutral-400 mb-1">
              Material
            </label>
            <input
              value={editForm.material}
              onChange={(e) =>
                setEditForm({ ...editForm, material: e.target.value })
              }
              className="w-full h-9 px-3 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="mb-3">
            <label className="block text-xs text-neutral-400 mb-1">
              Description
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              rows={2}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors resize-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs text-neutral-400 mb-1">
              Care instructions
            </label>
            <textarea
              value={editForm.care_instructions}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  care_instructions: e.target.value,
                })
              }
              rows={2}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors resize-none"
            />
          </div>

          {editError && (
            <p className="text-red-600 text-xs mb-3">{editError}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditTarget(null)}
              className="h-9 px-4 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingId !== null}
              className="h-9 px-4 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800 disabled:opacity-60"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete product"
      >
        <p className="text-sm text-neutral-500 mb-5">
          Delete{" "}
          <span className="font-semibold text-black">
            "{deleteTarget?.name}"
          </span>
          ? This will also delete all of its variants. This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="h-9 px-4 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteConfirm}
            disabled={deletingId !== null}
            className="h-9 px-4 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProductsPage;
