import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 flex-shrink-0 bg-neutral-900 text-white p-5 flex flex-col gap-1">
        <h2 className="font-serif text-xl tracking-wide mb-6">ADMIN</h2>
        <Link
          to="/admin/categories"
          className="px-3 py-2 rounded-lg hover:bg-neutral-800 text-sm"
        >
          Categories
        </Link>
        <Link
          to="/admin/products"
          className="px-3 py-2 rounded-lg hover:bg-neutral-800 text-sm"
        >
          Products
        </Link>
        <Link
          to="/admin/product-variants"
          className="px-3 py-2 rounded-lg hover:bg-neutral-800 text-sm"
        >
          Product Variants
        </Link>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
export default AdminLayout;
