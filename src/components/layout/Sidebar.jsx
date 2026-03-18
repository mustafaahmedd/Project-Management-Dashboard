import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Dashboard as DashboardIcon,
  FolderCopy as ProjectsIcon,
  CheckCircleOutline as TasksIcon,
  CalendarMonth as CalendarIcon,
  BarChart as AnalyticsIcon,
  Timer as TimeIcon,
  Flag as MilestonesIcon,
  Settings as SettingsIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { Avatar, Tooltip } from '@mui/material';

const navItems = [
  { label: 'Dashboard', path: '/', icon: DashboardIcon },
  { label: 'Projects', path: '/projects', icon: ProjectsIcon },
  { label: 'Tasks', path: '/tasks', icon: TasksIcon },
  { label: 'Calendar', path: '/calendar', icon: CalendarIcon },
  { label: 'Time Tracking', path: '/time-tracking', icon: TimeIcon },
  { label: 'Milestones', path: '/milestones', icon: MilestonesIcon },
  { label: 'Analytics', path: '/analytics', icon: AnalyticsIcon },
];

const bottomItems = [
  { label: 'Profile', path: '/profile', icon: ProfileIcon },
  { label: 'Settings', path: '/settings', icon: SettingsIcon },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col border-r border-[#2A2D35] bg-[#0F1117]"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#918AFF]">
          <span className="text-sm font-bold text-white">P</span>
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-white">
            ProjectPulse
          </h1>
          <p className="text-[11px] text-slate-500">Management Dashboard</p>
        </div>
      </div>

      {/* Main nav */}
      <nav className="mt-2 flex-1 space-y-1 px-3">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Main Menu
        </p>
        {navItems.map(({ label, path, icon: Icon }) => {
          const isActive =
            path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

          return (
            <NavLink key={path} to={path} className="block">
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#6C63FF]/10 text-[#918AFF]'
                    : 'text-slate-400 hover:bg-[#181B22] hover:text-slate-200'
                }`}
              >
                <Icon
                  sx={{ fontSize: 20 }}
                  className={isActive ? 'text-[#6C63FF]' : 'text-slate-500 group-hover:text-slate-300'}
                />
                <span>{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 h-8 w-[3px] rounded-r-full bg-[#6C63FF]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="space-y-1 border-t border-[#2A2D35] px-3 pt-3 pb-3">
        {bottomItems.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname.startsWith(path);
          return (
            <NavLink key={path} to={path} className="block">
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#6C63FF]/10 text-[#918AFF]'
                    : 'text-slate-400 hover:bg-[#181B22] hover:text-slate-200'
                }`}
              >
                <Icon sx={{ fontSize: 20 }} />
                <span>{label}</span>
              </motion.div>
            </NavLink>
          );
        })}
      </div>

      {/* User card */}
      <div className="border-t border-[#2A2D35] px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: '#6C63FF',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
          >
            MA
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold text-slate-200">
              Mustafa Ahmed
            </p>
            <p className="truncate text-[11px] text-slate-500">
              Software Engineer
            </p>
          </div>
          <Tooltip title="Sign out" placement="top">
            <LogoutIcon
              sx={{ fontSize: 18 }}
              className="cursor-pointer text-slate-600 transition-colors hover:text-red-400"
            />
          </Tooltip>
        </div>
      </div>
    </motion.aside>
  );
}
