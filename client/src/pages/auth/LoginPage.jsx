import AuthLayout from "../../components/auth/AuthLayout";
import LoginHeader from "../../components/auth/LoginHeader";
import LoginForm from "../../components/auth/LoginForm";
import AuthDivider from "../../components/auth/AuthDivider";
import GoogleButton from "../../components/auth/GoogleButton";
import AuthFooter from "../../components/auth/AuthFooter";

const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginHeader />

      <LoginForm />

      <AuthDivider />

      <GoogleButton />

      <AuthFooter />
    </AuthLayout>
  );
};

export default LoginPage;