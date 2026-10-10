import { Link } from "react-router-dom";

const SignupFooter = () => {
  return (
    <p className="mt-6 text-center text-sm text-slate-600">
      Already have an account?{" "}
      <Link
        to="/login"
        className="font-semibold text-slate-900 transition hover:underline"
      >
        Login
      </Link>
    </p>
  );
};

export default SignupFooter;