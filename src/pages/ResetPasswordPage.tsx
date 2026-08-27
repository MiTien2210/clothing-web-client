import { EyeClosedIcon, EyeIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPasswordApi } from "../api/authApi";
import axios from "axios";

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email?: string } | null)?.email;

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!email) {
    navigate("/forgot-password", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPasswordApi({ email, otp, newPassword });
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            "Failed to reset password, please try again",
        );
      } else {
        setError("Failed to reset password, please try again");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-[420px] bg-white border border-neutral-200 rounded-2xl p-10">
        <h1 className="font-serif text-3xl text-center tracking-widest mb-2.5">
          RESET PASSWORD
        </h1>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="otp"
              className="block text-xs text-neutral-400 mb-1"
            >
              Verification code
            </label>
            <div className="flex items-center border border-neutral-300 rounded-lg h-11 px-3">
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1 border-none outline-none text-sm p-0 h-auto"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label
              htmlFor="newPassword"
              className="block text-xs text-neutral-400 mb-1"
            >
              New password
            </label>
            <div className="flex items-center border border-neutral-300 rounded-lg h-11 px-3">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 border-none outline-none text-sm p-0 h-auto"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-neutral-400 hover:text-neutral-900 flex items-center"
              >
                {showPassword ? (
                  <EyeIcon size={16} />
                ) : (
                  <EyeClosedIcon size={16} />
                )}
              </button>
            </div>
          </div>
          <div className="mb-5">
            <label
              htmlFor="confirmPassword"
              className="block text-xs text-neutral-400 mb-1"
            >
              Confirm new password
            </label>
            <div className="flex items-center border border-neutral-300 rounded-lg h-11 px-3">
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 border-none outline-none text-sm p-0 h-auto"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-black text-white font-bold rounded-lg text-sm
                       hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Resetting..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default ResetPasswordPage;
