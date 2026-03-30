import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Sidebar from './Sidebar';

const MOBILE_BREAKPOINT = 768;

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT,
  );
  const location = useLocation();

  // Listen for viewport changes
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handler = (e) => {
      setIsMobile(e.matches);
      if (!e.matches) setMobileOpen(false);
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) setMobileOpen(false);
  }, [location.pathname, isMobile]);

  return (
    <div className="flex min-h-screen bg-[#0B0D11]">
      {/* Desktop sidebar — always visible */}
      {!isMobile && <Sidebar />}

      {/* Mobile sidebar — slide-in overlay */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 bg-black/60"
              onClick={() => setMobileOpen(false)}
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-40 h-screen"
            >
              <Sidebar onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className={`flex-1 overflow-y-auto p-6 md:p-8 ${!isMobile ? 'ml-[260px]' : ''}`}>
        {/* Mobile hamburger */}
        {isMobile && (
          <div className="mb-4 flex items-center">
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ color: '#94A3B8', mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#918AFF]">
                <span className="text-[10px] font-bold text-white">P</span>
              </div>
              <span className="text-sm font-bold text-white">ProjectPulse</span>
            </div>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
