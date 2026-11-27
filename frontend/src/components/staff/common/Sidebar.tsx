import PortalSidebar from "@/components/portal/PortalSidebar";
import { staffSidebarConfig } from "@/components/portal/portalConfigs";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const Sidebar = (props: SidebarProps) => {
  return <PortalSidebar {...staffSidebarConfig} {...props} />;
};

export default Sidebar;
