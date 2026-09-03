import { useEffect, useState } from "react";
import {
  CaretDownIcon,
  ArrowElbowDownRightIcon,
  FolderIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import {
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../../api/categoriesApi";
import type { Category } from "../../types/category";
import Modal from "../../components/Modal";

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [categoryType, setCategoryType] = useState<"root" | "child">("root");
  const [parentId, setParentId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [renameValue, setRenameValue] = useState("");
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

  const loadListCategories = async () => {
    const res = await getCategoriesApi();
    setCategories(res.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch data khi mount là use case hợp lệ, rule này báo false positive cho pattern async fetch
    loadListCategories().finally(() => setLoading(false));
  }, []);

  const flatList = flattenCategories(categories);
  const rootCount = categories.length;
  const subCount = flatList.filter((c) => c.depth > 0).length;

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (categoryType === "child" && !parentId) {
      setError("Please choose a parent category");
      return;
    }

    setSubmitting(true);
    try {
      await createCategoryApi({
        name,
        parentId: categoryType === "child" ? parentId : undefined,
      });
      setName("");
      setParentId("");
      setCategoryType("root");
      await loadListCategories();
    } catch {
      setError("Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  const openRenameModal = (id: string, currentName: string) => {
    setRenameTarget({ id, name: currentName });
    setRenameValue(currentName);
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameTarget) return;
    if (!renameValue.trim() || renameValue.trim() === renameTarget.name) {
      setRenameTarget(null);
      return;
    }

    setRenamingId(renameTarget.id);
    try {
      await updateCategoryApi(renameTarget.id, { name: renameValue.trim() });
      await loadListCategories();
    } finally {
      setRenamingId(null);
      setRenameTarget(null);
    }
  };

  const openDeleteModal = (id: string, label: string) => {
    setDeleteTarget({ id, name: label });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeletingId(deleteTarget.id);
    try {
      await deleteCategoryApi(deleteTarget.id);
      await loadListCategories();
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 py-6 md:py-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-1">
        Categories management
      </h1>
      <p className="text-sm text-neutral-400 mb-6">
        Organize how items appear across your storefront
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-3.5 mb-6">
        <div className="bg-white border border-neutral-200 rounded-xl px-4 py-3.5">
          <p className="font-serif text-2xl leading-none">
            {flatList.length}
          </p>
          <p className="text-xs text-neutral-400 mt-1.5">Total categories</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl px-4 py-3.5">
          <p className="font-serif text-2xl leading-none">{rootCount}</p>
          <p className="text-xs text-neutral-400 mt-1.5">Root categories</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl px-4 py-3.5">
          <p className="font-serif text-2xl leading-none">{subCount}</p>
          <p className="text-xs text-neutral-400 mt-1.5">Subcategories</p>
        </div>
      </div>

      {/* Create form */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 mb-6">
        <h2 className="text-sm font-bold mb-4">Add new category</h2>
        <form
          onSubmit={handleCreateCategory}
          className="flex flex-col md:flex-row gap-3 md:items-end"
        >
          <div className="flex-1 min-w-0">
            <label className="block text-xs text-neutral-400 mb-1">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 px-3 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors"
              required
            />
          </div>

          <div className="flex-1 min-w-0">
            <label className="block text-xs text-neutral-400 mb-1">
              Category type
            </label>
            <div className="inline-flex h-9 border border-neutral-300 rounded-lg overflow-hidden w-full">
              <button
                type="button"
                onClick={() => {
                  setCategoryType("root");
                  setParentId("");
                }}
                className={`flex-1 text-sm font-medium transition-colors ${
                  categoryType === "root"
                    ? "bg-black text-white"
                    : "bg-white text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                Root category
              </button>
              <button
                type="button"
                disabled={categories.length === 0}
                onClick={() => setCategoryType("child")}
                title={
                  categories.length === 0
                    ? "Add a root category first"
                    : undefined
                }
                className={`flex-1 text-sm font-medium border-l border-neutral-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  categoryType === "child"
                    ? "bg-black text-white"
                    : "bg-white text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                Subcategory
              </button>
            </div>
          </div>

          {categoryType === "child" && (
            <div className="flex-1 min-w-0">
              <label className="block text-xs text-neutral-400 mb-1">
                Parent category
              </label>
              <div className="relative">
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full h-9 pl-3 pr-8 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors appearance-none bg-white"
                  required
                >
                  <option value="" disabled>
                    Choose a category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <CaretDownIcon
                  size={13}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="h-9 px-4 bg-black text-white rounded-lg text-sm font-medium hover:bg-neutral-800 disabled:opacity-60 transition-colors md:flex-shrink-0"
          >
            {submitting ? "Adding..." : "Add"}
          </button>
        </form>

        {error && <p className="text-red-600 text-xs mt-3">{error}</p>}
      </div>

      {/* List */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b border-neutral-100 bg-neutral-50">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
            Category
          </span>
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
            Actions
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col">
            {[0, 1, 20].map((pad, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-neutral-100 last:border-b-0 animate-pulse"
                style={{ paddingLeft: 16 + pad }}
              >
                <div className="h-3.5 w-28 bg-neutral-200 rounded" />
                <div className="h-3.5 w-10 bg-neutral-100 rounded" />
              </div>
            ))}
          </div>
        ) : flatList.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-neutral-400">
            <FolderIcon size={28} />
            <p className="text-sm">No categories yet</p>
          </div>
        ) : (
          <ul>
            {flatList.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between gap-3 px-4 sm:px-5 py-2.5 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 transition-colors"
                style={{ paddingLeft: 16 + cat.depth * 22 }}
              >
                <span className="flex items-center gap-1.5 text-sm min-w-0">
                  {cat.depth > 0 && (
                    <ArrowElbowDownRightIcon
                      size={13}
                      className="text-neutral-300 flex-shrink-0"
                    />
                  )}
                  <span
                    className={`truncate ${
                      cat.depth === 0 ? "font-semibold" : "text-neutral-700"
                    }`}
                  >
                    {cat.name}
                  </span>
                </span>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openRenameModal(cat.id, cat.name)}
                    disabled={renamingId === cat.id}
                    title="Rename"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-black disabled:opacity-50 transition-colors"
                  >
                    <PencilSimpleIcon size={14} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(cat.id, cat.name)}
                    disabled={deletingId === cat.id}
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

      {/* Rename modal */}
      <Modal
        isOpen={renameTarget !== null}
        onClose={() => setRenameTarget(null)}
        title="Rename category"
      >
        <form onSubmit={handleRenameSubmit}>
          <input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            autoFocus
            className="w-full h-9 px-3 border border-neutral-300 rounded-lg text-sm outline-none focus:border-black transition-colors mb-4"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRenameTarget(null)}
              className="h-9 px-4 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={renamingId !== null}
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
        title="Delete category"
      >
        <p className="text-sm text-neutral-500 mb-5">
          Delete{" "}
          <span className="font-semibold text-black">
            "{deleteTarget?.name}"
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

export default AdminCategoriesPage;
