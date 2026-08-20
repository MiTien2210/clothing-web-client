import {
  EyeClosedIcon,
  EyeIcon,
  GoogleLogoIcon,
  KeyIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/authApi";
import axios from "axios";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await loginApi(email, password);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ?? "Login failed, please try again",
        );
      } else {
        setError("Login failed, please try again");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-[420px] bg-white border border-neutral-200 rounded-2xl p-10">
        {/* Heading */}
        <h1 className="font-serif text-3xl text-center tracking-widest mb-7">
          SIGN IN
        </h1>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
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
              <KeyIcon size={16} className="text-neutral-400" />
            </div>
          </div>

          {/* Password */}
          <div className="mb-5">
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

          {/* Sign In */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-black text-white font-bold rounded-lg text-sm 
                       hover:bg-neutral-800 transition-colors mb-2.5"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Button Google */}
        <button
          type="button"
          className="w-full h-11 flex items-center justify-center gap-2 border border-neutral-300
                     rounded-lg text-sm font-bold hover:bg-neutral-50 transition-colors mb-4"
        >
          <GoogleLogoIcon size={18} weight="bold" />
          Sign in with Google
        </button>

        {/* Links */}
        <div className="flex justify-between text-xs">
          <a
            href="#"
            className="underline text-neutral-700 font-bold hover:text-neutral-900"
          >
            Forgot password
          </a>
          <a
            href="/register"
            className="underline text-neutral-700 font-bold hover:text-neutral-900"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
