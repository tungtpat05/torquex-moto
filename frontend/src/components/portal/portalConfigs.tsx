import DashboardIcon from "@mui/icons-material/Dashboard";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import CategoryIcon from "@mui/icons-material/Category";
import LabelIcon from "@mui/icons-material/Label";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import GroupIcon from "@mui/icons-material/Group";
import { PortalNavItem, PortalSidebarConfig } from "./PortalSidebar";

export const staffMenuItems: PortalNavItem[] = [
  {
    text: "Dashboard",
    path: "/staff/dashboard",
    icon: <DashboardIcon />,
    indexPaths: ["/staff", "/staff/"],
  },
  { text: "Products", path: "/staff/products", icon: <TwoWheelerIcon /> },
  { text: "Brands", path: "/staff/brands", icon: <LabelIcon /> },
  { text: "Categories", path: "/staff/categories", icon: <CategoryIcon /> },
];

export const staffSidebarConfig: PortalSidebarConfig = {
  navItems: staffMenuItems,
  badgeText: "STAFF",
  homePath: "/staff/dashboard",
  navAriaLabel: "Staff navigation",
  brandAriaLabel: "TorqueX Staff Dashboard",
  collapsedMarkLabel: "TorqueX Staff",
  accountMenuId: "staff-account-menu",
  fallbackDisplayName: "Staff Member",
  fallbackSubtitle: "STAFF",
  profileLabel: "Profile",
};

export const adminMenuItems: PortalNavItem[] = [
  {
    text: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
    indexPaths: ["/admin", "/admin/"],
  },
  {
    text: "Internal Accounts",
    path: "/admin/internal-accounts",
    icon: <ManageAccountsIcon />,
  },
  {
    text: "Customers",
    path: "/admin/customers",
    icon: <GroupIcon />,
  },
];

export const adminSidebarConfig: PortalSidebarConfig = {
  navItems: adminMenuItems,
  badgeText: "ADMIN",
  homePath: "/admin/dashboard",
  navAriaLabel: "Admin navigation",
  brandAriaLabel: "TorqueX Admin Dashboard",
  collapsedMarkLabel: "TorqueX Admin",
  accountMenuId: "admin-account-menu",
  fallbackDisplayName: "System Admin",
  fallbackSubtitle: "ADMIN",
  profileLabel: "Rider Profile",
};
