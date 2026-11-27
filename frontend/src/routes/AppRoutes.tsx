import { lazy, ReactNode, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import NotFoundPage from "../pages/NotFoundPage";
import HomePage from "../pages/HomePage";
import ProductDetailPage from "../pages/ProductDetailPage";
import SignInPage from "../pages/auth/SignInPage";
import AuthSuccessPage from "../pages/auth/AuthSuccessPage";
import SignUpPage from "../pages/auth/SignUpPage";
import CartPage from "../pages/CartPage";
import ProfilePage from "../pages/auth/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";

const StaffLayout = lazy(() => import("../layouts/StaffLayout"));
const DashboardPage = lazy(() => import("../pages/staff/DashboardPage"));
const ProductsPage = lazy(() => import("../pages/staff/ProductsPage"));
const ProductFormPage = lazy(() => import("../pages/staff/ProductFormPage"));
const CategoriesPage = lazy(() => import("../pages/staff/CategoriesPage"));
const CategoryFormPage = lazy(() => import("../pages/staff/CategoryFormPage"));
const BrandsPage = lazy(() => import("../pages/staff/BrandsPage"));
const BrandFormPage = lazy(() => import("../pages/staff/BrandFormPage"));

const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const AdminDashboardPage = lazy(() => import("../pages/admin/AdminDashboardPage"));
const InternalAccountsPage = lazy(() => import("../pages/admin/InternalAccountsPage"));
const InternalAccountFormPage = lazy(() => import("../pages/admin/InternalAccountFormPage"));
const CustomersPage = lazy(() => import("../pages/admin/CustomersPage"));

const StaffLoader = () => (
  <Box
    sx={{
      minHeight: "100dvh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#070709",
    }}
  >
    <CircularProgress sx={{ color: "#FF6700" }} />
  </Box>
);

const withStaffSuspense = (node: ReactNode) => (
  <Suspense fallback={<StaffLoader />}>{node}</Suspense>
);

const AppRoutes = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/auth/success" element={<AuthSuccessPage />} />

        {/* Admin Identity & Account Portal */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              {withStaffSuspense(<AdminLayout />)}
            </ProtectedRoute>
          }
        >
          <Route index element={withStaffSuspense(<AdminDashboardPage />)} />
          <Route path="dashboard" element={withStaffSuspense(<AdminDashboardPage />)} />
          <Route path="internal-accounts" element={withStaffSuspense(<InternalAccountsPage />)} />
          <Route
            path="internal-accounts/create"
            element={withStaffSuspense(<InternalAccountFormPage mode="create" />)}
          />
          <Route
            path="internal-accounts/:id/edit"
            element={withStaffSuspense(<InternalAccountFormPage mode="edit" />)}
          />
          <Route path="customers" element={withStaffSuspense(<CustomersPage />)} />
        </Route>

        {/* Store Operations Staff Portal */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={["STAFF"]}>
              {withStaffSuspense(<StaffLayout />)}
            </ProtectedRoute>
          }
        >
          <Route index element={withStaffSuspense(<DashboardPage />)} />
          <Route path="dashboard" element={withStaffSuspense(<DashboardPage />)} />
          <Route path="products" element={withStaffSuspense(<ProductsPage />)} />
          <Route path="products/add" element={withStaffSuspense(<ProductFormPage mode="add" />)} />
          <Route
            path="products/edit/:id"
            element={withStaffSuspense(<ProductFormPage mode="edit" />)}
          />
          <Route path="categories" element={withStaffSuspense(<CategoriesPage />)} />
          <Route
            path="categories/add"
            element={withStaffSuspense(<CategoryFormPage mode="add" />)}
          />
          <Route
            path="categories/edit/:id"
            element={withStaffSuspense(<CategoryFormPage mode="edit" />)}
          />
          <Route path="brands" element={withStaffSuspense(<BrandsPage />)} />
          <Route path="brands/add" element={withStaffSuspense(<BrandFormPage mode="add" />)} />
          <Route
            path="brands/edit/:id"
            element={withStaffSuspense(<BrandFormPage mode="edit" />)}
          />
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
