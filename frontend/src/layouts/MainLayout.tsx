import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import KtmNavbar from '@/components/ktm/KtmNavbar';
import Footer from '@/components/common/Footer';

const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#070709', color: '#F4F4F5' }}>
      <KtmNavbar />
      <Box component="main" sx={{ pt: isHomePage ? 0 : '72px' }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
