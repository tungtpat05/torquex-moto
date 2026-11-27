import PortalBreadcrumbs, { PortalBreadcrumbItem } from "@/components/portal/PortalBreadcrumbs";

export type StaffBreadcrumbItem = PortalBreadcrumbItem;

interface StaffBreadcrumbsProps {
  items: StaffBreadcrumbItem[];
}

const StaffBreadcrumbs = ({ items }: StaffBreadcrumbsProps) => {
  return <PortalBreadcrumbs items={items} />;
};

export default StaffBreadcrumbs;
