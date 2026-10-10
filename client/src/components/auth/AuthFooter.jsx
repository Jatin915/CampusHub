import { Link } from "react-router-dom";

const AuthFooter = () => {
  return (
    <p className="mt-6 text-center text-sm text-slate-600">
      Don't have an account?{" "}
      <Link
        to="/signup"
        className="font-semibold text-slate-900 transition hover:underline"
      >
        Sign up
      </Link>
    </p>
  );
};

export default AuthFooter;