import { Link } from "react-router-dom";
import { logoutApi } from "../api/authApi";

const HomePage = () => {
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
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Welcome! You are logged in.</h1>
      <Link to="/profile" className="underline text-sm text-neutral-600">
        My profile
      </Link>
      <button
        onClick={handleLogout}
        className="underline text-sm text-neutral-600"
      >
        Log out
      </button>
    </div>
  );
};
export default HomePage;
