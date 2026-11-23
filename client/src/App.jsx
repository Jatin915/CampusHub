
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import LandingPage from "./pages/LandingPage";

import Home from "./pages/dashboard/Home";
import Cart from "./pages/dashboard/Cart";
import MyOrders from "./pages/dashboard/MyOrders";
import OrderDetails from "./pages/dashboard/OrderDetails";
import ProductDetails from "./pages/dashboard/ProductDetails";
import Categories from "./pages/dashboard/Categories";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/home" element={<Home />} />
          <Route path="/dashboard/cart" element={<Cart />} />
          <Route path="/dashboard/orders" element={<MyOrders />} />
          <Route path="/dashboard/orders/:orderId" element={<OrderDetails />} />
          <Route path="/dashboard/products/:productId" element={<ProductDetails />} />
          <Route path="/dashboard/categories" element={<Categories />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
