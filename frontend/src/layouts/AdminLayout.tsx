import PortalLayout from "../components/portal/PortalLayout";
import { adminSidebarConfig } from "../components/portal/portalConfigs";

const AdminLayout = () => {
  return <PortalLayout {...adminSidebarConfig} menuButtonLabel="Open admin menu" />;
};

export default AdminLayout;
