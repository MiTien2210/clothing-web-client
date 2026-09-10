import { useEffect, useState } from "react";
import {
  CaretDownIcon,
  PencilSimpleIcon,
  TrashIcon,
  StackIcon,
} from "@phosphor-icons/react";
import {
  getProductVariantsApi,
  createProductVariantApi,
  updateProductVariantApi,
  deleteProductVariantApi,
} from "../../api/productVariantsApi";
import { getProductsApi } from "../../api/productsApi";
import type { ProductVariant } from "../../types/product-variant";
import type { Product } from "../../types/product";
import Modal from "../../components/Modal";

type VariantForm = {
  productId: string;
  size: string;
  color: string;
  price: string;
  stock_quantity: string;
  sku: string;
};

const emptyForm: VariantForm = {
  productId: "",
  size: "",
  color: "",
  price: "",
  stock_quantity: "",
  sku: "",
};

const AdminProductVariantsPage = () => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<VariantForm>(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<ProductVariant | null>(null);
  const [editForm, setEditForm] = useState<VariantForm>(emptyForm);
  const [editError, setEditError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    label: string;
  } | null>(null);

  const loadVariants = async () => {
    const res = await getProductVariantsApi();
    setVariants(res.data);
  };

  const loadProducts = async () => {
    const res = await getProductsApi({ limit: 100 });
    setProducts(res.data.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch data khi mount là use case hợp lệ, rule này báo false positive cho pattern async fetch
    Promise.all([loadVariants(), loadProducts()]).finally(() =>
      setLoading(false),
    );
  }, []);

  const outOfStockCount = variants.filter((v) => v.stock_quantity === 0).length;

  const handleCreateVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.productId) {
      setError("Please choose a product");
      return;
    }

    setSubmitting(true);
    try {
      await createProductVariantApi({
        productId: form.productId,
        size: form.size,
        color: form.color,
        price: Number(form.price),
        stock_quantity: Number(form.stock_quantity),
        sku: form.sku,
      });
      setForm(emptyForm);
      await loadVariants();
    } catch {
      setError("Failed to create variant");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (variant: ProductVariant) => {
    setEditTarget(variant);
    setEditForm({
      productId: variant.product.id,
      size: variant.size,
      color: variant.color,
      price: String(variant.price),
      stock_quantity: String(variant.stock_quantity),
      sku: variant.sku,
    });
    setEditError("");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setEditError("");

    if (!editForm.productId) {
      setEditError("Please choose a product");
      return;
    }

    setSavingId(editTarget.id);
    try {
      await updateProductVariantApi(editTarget.id, {
        productId: editForm.productId,
        size: editForm.size,
        color: editForm.color,
        price: Number(editForm.price),
        stock_quantity: Number(editForm.stock_quantity),
        sku: editForm.sku,
      });
      await loadVariants();
      setEditTarget(null);
    } catch {
      setEditError("Failed to save changes");
    } finally {
      setSavingId(null);
    }
  };

  const openDeleteModal = (id: string, label: string) => {
    setDeleteTarget({ id, label });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeletingId(deleteTarget.id);
    try {
      await deleteProductVariantApi(deleteTarget.id);
      await loadVariants();
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 py-6 md:py-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-1">
        Product variants management
      </h1>
      <p className="text-sm text-neutral-400 mb-6">
        Manage size, color, price and stock for each product
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3.5 mb-6">
        <div className="bg-white border border-neutral-200 rounded-xl px-4 py-3.5">
          <p className="font-serif text-2xl leading-none">{variants.length}</p>
          <p className="text-xs text-neutral-400 mt-1.5">Total variants</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl px-4 py-3.5">
          <p className="font-serif text-2xl leading-none">{outOfStockCount}</p>
          <p className="text-xs text-neutral-400 mt-1.5">Out of stock</p>
        </div>
      </div>

      {/* Create form */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 mb-6">
        <h2 className="text-sm font-bold mb-4">Add new variant</h2>
        <form onSubmit={handleCreateVariant}>
          <div className="flex flex-col md:flex-row gap-3 md:items-end">
            <div className="flex-1 min-w-0">
              <label className="block text-xs text-neutral-400 mb-1">
                Product
              </label>
              <div className="relative">
                <select
                  value={form.productId}
                  onChange={(e) =>
                    setForm({ ...form, productId: e.target.value })
                  }
                  className="w-full h-9 pl-3 pr-8 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors appearance-none bg-white"
                  required
                >
                  <option value="" disabled>
                    Choose a product
                  </option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
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
                Size
              </label>
              <input
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                className="w-full h-9 px-3 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors"
                required
              />
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-xs text-neutral-400 mb-1">
                Color
              </label>
              <input
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-full h-9 px-3 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mt-3 md:items-end">
            <div className="flex-1 min-w-0">
              <label className="block text-xs text-neutral-400 mb-1">
                Price (VND)
              </label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full h-9 px-3 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors"
                required
              />
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-xs text-neutral-400 mb-1">
                Stock quantity
              </label>
              <input
                type="number"
                min={0}
                value={form.stock_quantity}
                onChange={(e) =>
                  setForm({ ...form, stock_quantity: e.target.value })
                }
                className="w-full h-9 px-3 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors"
                required
              />
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-xs text-neutral-400 mb-1">SKU</label>
              <input
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="w-full h-9 px-3 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="h-9 px-4 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800 disabled:opacity-60 transition-colors md:flex-shrink-0"
            >
              {submitting ? "Adding..." : "Add"}
            </button>
          </div>
        </form>

        {error && <p className="text-red-600 text-xs mt-3">{error}</p>}
      </div>

      {/* List */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b border-neutral-100 bg-neutral-50">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
            Variant
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
        ) : variants.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-neutral-400">
            <StackIcon size={28} />
            <p className="text-sm">No variants yet</p>
          </div>
        ) : (
          <ul>
            {variants.map((variant) => (
              <li
                key={variant.id}
                className="flex items-center justify-between gap-3 px-4 sm:px-5 py-2.5 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {variant.product.name}{" "}
                    <span className="font-normal text-neutral-400">
                      · {variant.size} / {variant.color}
                    </span>
                  </p>
                  <p className="text-xs text-neutral-400 truncate">
                    SKU {variant.sku} · {variant.price.toLocaleString()}₫ ·{" "}
                    <span
                      className={
                        variant.stock_quantity === 0
                          ? "text-red-500 font-medium"
                          : ""
                      }
                    >
                      {variant.stock_quantity} in stock
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(variant)}
                    disabled={savingId === variant.id}
                    title="Edit"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-black disabled:opacity-50 transition-colors"
                  >
                    <PencilSimpleIcon size={14} />
                  </button>
                  <button
                    onClick={() =>
                      openDeleteModal(
                        variant.id,
                        `${variant.product.name} · ${variant.size}/${variant.color}`,
                      )
                    }
                    disabled={deletingId === variant.id}
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
        title="Edit variant"
      >
        <form onSubmit={handleEditSubmit}>
          <div className="mb-3">
            <label className="block text-xs text-neutral-400 mb-1">
              Product
            </label>
            <div className="relative">
              <select
                value={editForm.productId}
                onChange={(e) =>
                  setEditForm({ ...editForm, productId: e.target.value })
                }
                className="w-full h-9 pl-3 pr-8 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors appearance-none bg-white"
                required
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <CaretDownIcon
                size={13}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
            </div>
          </div>

          <div className="flex gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <label className="block text-xs text-neutral-400 mb-1">
                Size
              </label>
              <input
                value={editForm.size}
                onChange={(e) =>
                  setEditForm({ ...editForm, size: e.target.value })
                }
                autoFocus
                className="w-full h-9 px-3 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors"
                required
              />
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-xs text-neutral-400 mb-1">
                Color
              </label>
              <input
                value={editForm.color}
                onChange={(e) =>
                  setEditForm({ ...editForm, color: e.target.value })
                }
                className="w-full h-9 px-3 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <label className="block text-xs text-neutral-400 mb-1">
                Price (VND)
              </label>
              <input
                type="number"
                min={0}
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: e.target.value })
                }
                className="w-full h-9 px-3 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors"
                required
              />
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-xs text-neutral-400 mb-1">
                Stock quantity
              </label>
              <input
                type="number"
                min={0}
                value={editForm.stock_quantity}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    stock_quantity: e.target.value,
                  })
                }
                className="w-full h-9 px-3 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs text-neutral-400 mb-1">SKU</label>
            <input
              value={editForm.sku}
              onChange={(e) =>
                setEditForm({ ...editForm, sku: e.target.value })
              }
              className="w-full h-9 px-3 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors"
              required
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
        title="Delete variant"
      >
        <p className="text-sm text-neutral-500 mb-5">
          Delete{" "}
          <span className="font-semibold text-black">
            "{deleteTarget?.label}"
          </span>
          ? This cannot be undone.
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

export default AdminProductVariantsPage;
