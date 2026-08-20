import { EyeClosedIcon, EyeIcon, GoogleLogoIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../api/authApi";
import axios from "axios";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      alert("The confirmation password does not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await registerApi({ full_name: fullName, email, phone, password });
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            "Registration failed, please try again",
        );
      } else {
        setError("Registration failed, please try again");
      }
    } finally {
      setIsSubmitting(false);
    }

    console.log({ fullName, email, phone, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-[420px] bg-white border border-neutral-200 rounded-2xl p-10">
        <h1 className="font-serif text-3xl text-center tracking-widest mb-7">
          SIGN UP
        </h1>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full name */}
          <div className="mb-3">
            <label
              htmlFor="fullName"
              className="block text-xs text-neutral-400 mb-1"
            >
              Full name
            </label>
            <div className="flex items-center border border-neutral-300 rounded-lg h-11 px-3">
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="flex-1 border-none outline-none text-sm p-0 h-auto"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label
              htmlFor="email"
              className="block text-xs text-neutral-400 mb-1"
            >
              Email address
            </label>
            <div className="flex items-center border border-neutral-300 rounded-lg h-11 px-3">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border-none outline-none text-sm p-0 h-auto"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="mb-3">
            <label
              htmlFor="phone"
              className="block text-xs text-neutral-400 mb-1"
            >
              Phone number
            </label>
            <div className="flex items-center border border-neutral-300 rounded-lg h-11 px-3">
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 border-none outline-none text-sm p-0 h-auto"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label
              htmlFor="password"
              className="block text-xs text-neutral-400 mb-1"
            >
              Password
            </label>
            <div className="flex items-center border border-neutral-300 rounded-lg h-11 px-3">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Confirm password */}
          <div className="mb-5">
            <label
              htmlFor="confirmPassword"
              className="block text-xs text-neutral-400 mb-1"
            >
              Confirm password
            </label>
            <div className="flex items-center border border-neutral-300 rounded-lg h-11 px-3">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 border-none outline-none text-sm p-0 h-auto"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                className="text-neutral-400 hover:text-neutral-900 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeIcon size={16} />
                ) : (
                  <EyeClosedIcon size={16} />
                )}
              </button>
            </div>
          </div>

          {/* Sign Up */}
          <button
            disabled={isSubmitting}
            className="w-full h-11 bg-black text-white font-bold rounded-lg text-sm
                       hover:bg-neutral-800 transition-colors mb-2.5"
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex-1 h-px bg-neutral-200" />
          <span className="text-[11px] text-neutral-400">or</span>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>

        {/* Sign up with Google */}
        <button
          className="w-full h-11 flex items-center justify-center gap-2 border border-neutral-300
                     rounded-lg text-sm font-bold hover:bg-neutral-50 transition-colors mb-4"
        >
          <GoogleLogoIcon size={18} weight="bold" />
          Sign up with Google
        </button>

        {/* Link to login */}
        <p className="text-center text-xs text-neutral-700">
          Already have an account?{" "}
          <a
            href="/login"
            className="underline font-bold hover:text-neutral-900"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
