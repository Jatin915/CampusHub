import { useEffect, useState } from "react";

const SignupEmailVerification = ({
  email,
  setEmail,
  emailVerified,
  setEmailVerified,
}) => {
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer === 0) return;

    const timer = setInterval(() => {
      setResendTimer((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleVerifyEmail = () => {
    if (!isValidEmail) return;

    setOtpSent(true);
    setOtp("");
    setOtpError("");
    setResendTimer(60);
  };

  const handleVerifyOtp = () => {
    if (otp !== "123456") {
      setOtpError("Invalid OTP. Please try again.");
      return;
    }

    setOtpError("");
    setEmailVerified(true);
    setResendTimer(0);
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;

    setOtp("");
    setOtpError("");
    setResendTimer(60);
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="email"
        className="text-sm font-medium text-slate-900"
      >
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
            setOtp("");
            setOtpError("");
            setResendTimer(0);
          }}
          placeholder="you@college.edu"
          autoComplete="email"
          disabled={emailVerified}
          className="h-11 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100"
        />

        <button
          type="button"
          onClick={handleVerifyEmail}
          disabled={!isValidEmail || emailVerified}
          className="h-11 shrink-0 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {emailVerified ? "Verified" : "Verify"}
        </button>
      </div>

      {emailVerified && (
        <p className="text-sm font-medium text-green-600">
          Email verified successfully ✓
        </p>
      )}

      {otpSent && !emailVerified && (
        <div className="space-y-2 pt-2">
          <label
            htmlFor="otp"
            className="text-sm font-medium text-slate-900"
          >
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
              disabled={otp.length !== 6}
              className="h-11 shrink-0 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Verify OTP
            </button>
          </div>

          {otpError && (
            <p className="text-sm font-medium text-red-600">
              {otpError}
            </p>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              OTP sent to your email
            </p>

            {resendTimer > 0 ? (
              <p className="text-xs font-medium text-slate-500">
                Resend OTP in {resendTimer}s
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-xs font-semibold text-slate-900 hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400">
            For testing, use OTP: 123456
          </p>
        </div>
      )}
    </div>
  );
};

export default SignupEmailVerification;