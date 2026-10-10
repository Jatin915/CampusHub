import { useState } from "react";
import SignupEmailVerification from "./SignupEmailVerification";
import SignupPasswordFields from "./SignupPasswordFields";

const SignupForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!fullName.trim()) {
      setFormError("Please enter your full name.");
      return;
    }

    if (!emailVerified) {
      setFormError("Please verify your email before creating an account.");
      return;
    }

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    if (!confirmPassword) {
      setFormError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Backend signup API will be connected here later.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log({
        fullName,
        email,
        password,
      });
    } catch (error) {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-5"
    >

      {/* Email + OTP */}
      <SignupEmailVerification
        email={email}
        setEmail={setEmail}
        emailVerified={emailVerified}
        setEmailVerified={setEmailVerified}
      />

      {/* Full Name */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium text-slate-900"
        >
          Full Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={fullName}
          onChange={(event) => {
            setFullName(event.target.value);
            setFormError("");
          }}
          placeholder="Enter your full name"
          autoComplete="name"
          className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
        />
      </div>

      {/* Passwords */}
      <SignupPasswordFields
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
      />

      {/* Error */}
      {formError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          {formError}
        </p>
      )}

      {/* Create Account */}
      <button
        type="submit"
        disabled={!emailVerified || isSubmitting}
        className="h-11 w-full rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
      >
        {isSubmitting ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
};

export default SignupForm;