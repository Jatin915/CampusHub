import AuthLayout from "../../components/auth/AuthLayout";
import SignupHeader from "../../components/auth/signup/SignupHeader";
import SignupForm from "../../components/auth/signup/SignupForm";
import SignupFooter from "../../components/auth/signup/SignupFooter";

const SignupPage = () => {
  return (
    <AuthLayout>
      <SignupHeader />

      <SignupForm />

      <SignupFooter />
    </AuthLayout>
  );
};

export default SignupPage;