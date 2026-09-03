import { Navigate, Outlet } from "react-router-dom";
import { decodeToken } from "../utils/jwt";

const AdminRoute = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  const payload = decodeToken<{ role: string }>(accessToken);
  if (!payload || payload.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
