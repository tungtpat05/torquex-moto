import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import StaffLayout from "../layouts/StaffLayout";
import NotFoundPage from "../pages/NotFoundPage";
import HomePage from "../pages/HomePage";
import ProductDetailPage from "../pages/ProductDetailPage";
import SignInPage from "../pages/auth/SignInPage";
import AuthSuccessPage from "../pages/auth/AuthSuccessPage";
import SignUpPage from "../pages/auth/SignUpPage";
import CartPage from "../pages/CartPage";
import ProfilePage from "../pages/auth/ProfilePage";

import DashboardPage from "../pages/staff/DashboardPage";
import ProductsPage from "../pages/staff/ProductsPage";
import ProductFormPage from "../pages/staff/ProductFormPage";
import CategoriesPage from "../pages/staff/CategoriesPage";
import CategoryFormPage from "../pages/staff/CategoryFormPage";
import BrandsPage from "../pages/staff/BrandsPage";
import BrandFormPage from "../pages/staff/BrandFormPage";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/auth/success" element={<AuthSuccessPage />} />

        {/* Store Operations Staff Portal */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={["STAFF"]}>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/add" element={<ProductFormPage mode="add" />} />
          <Route path="products/edit/:id" element={<ProductFormPage mode="edit" />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/add" element={<CategoryFormPage mode="add" />} />
          <Route path="categories/edit/:id" element={<CategoryFormPage mode="edit" />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="brands/add" element={<BrandFormPage mode="add" />} />
          <Route path="brands/edit/:id" element={<BrandFormPage mode="edit" />} />
        </Route>

        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </>
    )
  );
  return <RouterProvider router={router} />;
};

export default AppRoutes;
