import { EnvelopeSimpleIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPasswordApi } from "../api/authApi";
import axios from "axios";

const ForgotPassword = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await forgotPasswordApi(email);
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            "Something went wrong, please try again",
        );
      } else {
        setError("Something went wrong, please try again");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-[420px] bg-white border border-neutral-200 rounded-2xl p-10">
        {/* Heading */}
        <h1 className="font-serif text-3xl text-center tracking-widest mb-2.5">
          FORGOT PASSWORD
        </h1>
        <p className="text-sm text-neutral-500 text-center leading-relaxed mb-7">
          Enter your email and we'll send you a code to reset your password.
        </p>

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
              <EnvelopeSimpleIcon size={16} className="text-neutral-400" />
            </div>
          </div>

          {/* Send reset code */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-black text-white font-bold rounded-lg text-sm 
             hover:bg-neutral-800 transition-colors mb-2.5"
          >
            {isSubmitting ? "Sending..." : "Send reset code"}
          </button>
        </form>

        {/* Links */}
        <p className="text-center text-xs text-neutral-700">
          Remember your password?{" "}
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
};

export default ForgotPassword;
