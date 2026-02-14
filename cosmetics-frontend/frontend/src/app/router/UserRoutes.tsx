// src/app/router/UserRoutes.tsx
import { Route } from "react-router-dom";
import UserLayout from "@/app/layouts/UserLayout";
import ProtectedRoute from "./ProtectedRoute";

import ProfilePage from "@/pages/Account/ProfilePage";
import OrdersPage from "@/features/orders/pages/OrdersPage";
import CartPage from "@/pages/Cart/CartPage";
import CheckoutPage from "@/pages/Checkout/CheckoutPage";

export const UserRoutes = (
  <Route
    element={
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    }
  >
    <Route path="/account" element={<ProfilePage />} />
    <Route path="/orders" element={<OrdersPage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
  </Route>
);
