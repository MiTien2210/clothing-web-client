import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resendOtpApi, verifyOtpApi } from "../api/authApi";
import { maskEmail } from "../utils/format";

const VerifyOtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as { email?: string } | null)?.email;

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes = 300 seconds
  const [resendCooldown, setResendCooldown] = useState(60); // 60 senconds before resending
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000); // 1000ms
    return () => clearInterval(timer);
  }, []);

  if (!email) return null;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return; // only input digit
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    setError("");
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsVerifying(true);
    try {
      await verifyOtpApi(email, code);
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            "Verification failed, please try again",
        );
      } else {
        setError("Verification failed, please try again");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    try {
      await resendOtpApi(email);
      setResendCooldown(60);
      setSecondsLeft(300);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to resend code");
      } else {
        setError("Failed to resend code");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-[420px] bg-white border border-neutral-200 rounded-2xl p-10">
        <h1 className="font-serif text-3xl text-center tracking-widest mb-2.5">
          VERIFY EMAIL
        </h1>
        <p className="text-sm text-neutral-500 text-center leading-relaxed mb-7">
          A verification code has been sent to
          <br />
          <span className="text-neutral-900 font-medium">
            {maskEmail(email)}
          </span>
        </p>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        {/* OTP inputs */}
        <div className="flex justify-center gap-2.5 mb-5">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              style={{ height: "52px" }}
              className="w-11 text-center text-xl font-semibold border border-neutral-300
                         rounded-lg outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
          ))}
        </div>
        <p className="text-center text-xs text-neutral-400 mb-6">
          Code expires in{" "}
          <span className="text-neutral-900 font-semibold">
            {formatTime(secondsLeft)}
          </span>
        </p>

        <button
          onClick={handleSubmit}
          disabled={isVerifying}
          className="w-full h-11 bg-black text-white rounded-lg text-sm font-bold
                     hover:bg-neutral-800 transition-colors mb-4.5"
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </button>

        <p className="text-center text-xs text-neutral-400">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className={`underline font-semibold ${
              resendCooldown > 0
                ? "text-neutral-500 cursor-not-allowed"
                : "text-neutral-700 hover:text-neutral-900"
            }`}
          >
            {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend"}
          </button>
        </p>
      </div>
    </div>
  );
};
export default VerifyOtpPage;
