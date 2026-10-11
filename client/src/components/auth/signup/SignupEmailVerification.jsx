import { useEffect, useState } from "react";
import {
  sendVerificationCode,
  verifyVerificationCode,
} from "../../../services/authService";

const SignupEmailVerification = ({
  email,
  setEmail,
  emailVerified,
  setEmailVerified,
  setSignupToken,
}) => {
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (resendTimer === 0) return;

    const timer = setTimeout(() => {
      setResendTimer((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendTimer]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendOtp = async () => {
    if (!isValidEmail || isSending) return;

    setOtpError("");
    setIsSending(true);

    try {
      await sendVerificationCode(email.trim().toLowerCase());

      setOtpSent(true);
      setOtp("");
      setResendTimer(60);
    } catch (error) {
      const message = error.response?.data?.message;

      setOtpError(message || "Unable to send OTP. Please try again.");

      if (error.response?.status === 429) {
        const match = message?.match(/(\d+)\s*seconds?/i);
        const remainingSeconds = match ? Number(match[1]) : 60;

        setOtpSent(true);
        setResendTimer(remainingSeconds);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6 || isVerifying) return;

    setOtpError("");
    setIsVerifying(true);

    try {
      const response = await verifyVerificationCode(
        email.trim().toLowerCase(),
        otp,
      );

      const token = response.data?.signupToken;

      if (!token) {
        throw new Error("Signup token was not returned by the server.");
      }

      setSignupToken(token);
      setEmailVerified(true);
      setResendTimer(0);
      setOtpError("");
    } catch (error) {
      setOtpError(
        error.response?.data?.message ||
          error.message ||
          "OTP verification failed. Please try again.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || isSending) return;

    setEmailVerified(false);
    setSignupToken("");
    setOtpSent(false);
    setOtp("");
    await handleSendOtp();
  };

  return (
    <div className="space-y-2">
      <label htmlFor="email" className="text-sm font-medium text-slate-900">
        College Email
      </label>

      <div className="flex gap-2">
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setOtpSent(false);
            setEmailVerified(false);
            setSignupToken("");
            setOtp("");
            setOtpError("");
            setResendTimer(0);
          }}
          placeholder="you@college.edu"
          autoComplete="email"
          disabled={emailVerified || isSending || isVerifying}
          className="h-11 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100"
        />

        <button
          type="button"
          onClick={handleSendOtp}
          disabled={!isValidEmail || emailVerified || isSending || isVerifying}
          className="h-11 shrink-0 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {emailVerified
            ? "Verified"
            : isSending
              ? "Sending..."
              : otpSent
                ? "Resend"
                : "Verify"}
        </button>
      </div>

      {emailVerified && (
        <p className="text-sm font-medium text-green-600">
          Email verified successfully ✓
        </p>
      )}

      {otpSent && !emailVerified && (
        <div className="space-y-2 pt-2">
          <label htmlFor="otp" className="text-sm font-medium text-slate-900">
            Enter OTP
          </label>

          <div className="flex gap-2">
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(event) => {
                setOtp(event.target.value.replace(/\D/g, ""));
                setOtpError("");
              }}
              placeholder="Enter 6-digit OTP"
              className="h-11 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm tracking-widest text-slate-900 outline-none transition placeholder:tracking-normal placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6 || isVerifying}
              className="h-11 shrink-0 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </button>
          </div>

          {otpError && (
            <p className="text-sm font-medium text-red-600">{otpError}</p>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">OTP sent to your email</p>

            {resendTimer > 0 ? (
              <p className="text-xs font-medium text-slate-500">
                Resend OTP in {resendTimer}s
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isSending || isVerifying}
                className="text-xs font-semibold text-slate-900 hover:underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      )}

      {otpError && !otpSent && (
        <p className="text-sm font-medium text-red-600">{otpError}</p>
      )}
    </div>
  );
};

export default SignupEmailVerification;
