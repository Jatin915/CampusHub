import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import Home from "./pages/dashboard/Home";
import Cart from "./pages/dashboard/Cart";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
      </Routes>

        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/home" element={<Home />} />
            <Route path="/dashboard/cart" element={<Cart />} />
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
