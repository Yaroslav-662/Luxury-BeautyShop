// src/app/router/AdminRoutes.tsx
import { Route } from "react-router-dom";
import AdminLayout from "@/app/layouts/AdminLayout";
import AdminRoute from "./AdminRoute";

import DashboardPage from "@/admin/Dashboard/DashboardPage";

// Products
import ProductsList from "@/admin/Products/ProductsList";
import ProductCreate from "@/admin/Products/ProductCreate";
import ProductEdit from "@/admin/Products/ProductEdit";

// Categories
import CategoriesList from "@/admin/Categories/CategoriesList";
import CategoryCreate from "@/admin/Categories/CategoryCreate";
import CategoryEdit from "@/admin/Categories/CategoryEdit";

// Orders
import OrdersPage from "@/admin/Orders/OrdersPage";
import OrderDetails from "@/admin/Orders/OrderDetails";

// Users
import UsersList from "@/admin/Users/UsersList";
import UserEdit from "@/admin/Users/UserEdit";

// Reviews
import ReviewsAdmin from "@/admin/Reviews/ReviewsAdmin";

// Files
import FilesManager from "@/admin/Files/FilesManager";

export const AdminRoutes = (
  <Route
    element={
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    }
  >
    <Route path="/admin" element={<DashboardPage />} />

    {/* Products */}
    <Route path="/admin/products" element={<ProductsList />} />
    <Route path="/admin/products/create" element={<ProductCreate />} />
    <Route path="/admin/products/:id/edit" element={<ProductEdit />} />

    {/* Categories */}
    <Route path="/admin/categories" element={<CategoriesList />} />
    <Route path="/admin/categories/create" element={<CategoryCreate />} />
    <Route path="/admin/categories/:id/edit" element={<CategoryEdit />} />

    {/* Orders */}
    <Route path="/admin/orders" element={<OrdersPage />} />
    <Route path="/admin/orders/:id" element={<OrderDetails />} />

    {/* Users */}
    <Route path="/admin/users" element={<UsersList />} />
    <Route path="/admin/users/:id/edit" element={<UserEdit />} />

    {/* Reviews */}
    <Route path="/admin/reviews" element={<ReviewsAdmin />} />

    {/* Files */}
    <Route path="/admin/files" element={<FilesManager />} />
  </Route>
);
