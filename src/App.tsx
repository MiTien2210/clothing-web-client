import { Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminCategoriesPage from "./pages/Admin/AdminCategoriesPage";
import AdminProductsPage from "./pages/Admin/AdminProductsPage";
import AdminProductVariantsPage from "./pages/Admin/AdminProductVariantsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import PublicLayout from "./layouts/PublicLayout";
import HomePage from "./pages/HomePage/HomePage";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/categories/:id" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          {/* <Route path="/cart" element={<CartPage />} /> */}
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route
            path="/admin/product-variants"
            element={<AdminProductVariantsPage />}
          />
        </Route>
      </Route>

      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
  );
}

export default App;
