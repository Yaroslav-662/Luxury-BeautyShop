// src/app/router/UserRoutes.tsx
import { Route } from "react-router-dom";
import UserLayout from "@/app/layouts/UserLayout";
import ProtectedRoute from "./ProtectedRoute";

// Pages
import ProfilePage from "@/pages/Account/ProfilePage";
import OrdersPage from "@/features/orders/pages/OrdersPage";
import CartPage from "@/pages/Cart/CartPage";
import CheckoutPage from "@/pages/Checkout/CheckoutPage";
import FavoritesPage from "@/pages/Favorites/FavoritesPage";

export const UserRoutes = (
  <>
    {/* ── Публічні сторінки (без авторизації) ── */}
    <Route element={<UserLayout />}>
      <Route path="/cart"      element={<CartPage />} />
      <Route path="/checkout"  element={<CheckoutPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
    </Route>

    {/* ── Захищені сторінки (тільки авторизовані) ── */}
    <Route
      element={
        <ProtectedRoute>
          <UserLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/account" element={<ProfilePage />} />
      <Route path="/orders"  element={<OrdersPage />} />
    </Route>
  </>
);
