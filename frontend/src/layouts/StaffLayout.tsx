import PortalLayout from "../components/portal/PortalLayout";
import { staffSidebarConfig } from "../components/portal/portalConfigs";

const StaffLayout = () => {
  return <PortalLayout {...staffSidebarConfig} menuButtonLabel="Open staff menu" />;
};

export default StaffLayout;
