import { useState, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  ExpandMore,
  ExpandLess,
  Circle,
  Business,
} from '@mui/icons-material';
import { Avatar, Tooltip } from '@mui/material';
import { useProjects } from '../../context/ProjectContext';
import { useUser } from '../../context/UserContext';
import { loadState, saveState } from '../../utils/storage';

const topNavItems = [
  { label: 'Dashboard', path: '/', icon: DashboardIcon },
];

const bottomNavItems = [
  { label: 'Tasks', path: '/tasks', icon: TasksIcon },
  { label: 'Calendar', path: '/calendar', icon: CalendarIcon },
  { label: 'Time Tracking', path: '/time-tracking', icon: TimeIcon },
  { label: 'Milestones', path: '/milestones', icon: MilestonesIcon },
  { label: 'Analytics', path: '/analytics', icon: AnalyticsIcon },
];

const footerItems = [
  { label: 'Profile', path: '/profile', icon: ProfileIcon },
  { label: 'Settings', path: '/settings', icon: SettingsIcon },
];

function NavItem({ label, path, icon: Icon, isActive }) {
  return (
    <NavLink to={path} className="block">
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
}

function CompanySection({ company, projects, expandedCompanies, toggleCompany, location }) {
  const isExpanded = expandedCompanies[company];
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => toggleCompany(company)}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 transition-colors hover:bg-[#181B22] hover:text-slate-300"
      >
        <Business sx={{ fontSize: 14 }} className="text-slate-600" />
        <span className="flex-1 truncate text-left">{company}</span>
        <span className="text-[10px] text-slate-600">{projects.length}</span>
        {isExpanded ? (
          <ExpandLess sx={{ fontSize: 14 }} className="text-slate-600" />
        ) : (
          <ExpandMore sx={{ fontSize: 14 }} className="text-slate-600" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="ml-3 space-y-0.5 border-l border-[#2A2D35] pl-3 pt-1 pb-1">
              {projects.map((project) => {
                const isActive = location.pathname === `/projects/${project.id}`;
                return (
                  <motion.button
                    key={project.id}
                    whileHover={{ x: 2 }}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors ${
                      isActive
                        ? 'bg-[#6C63FF]/10 text-[#918AFF]'
                        : 'text-slate-500 hover:bg-[#181B22] hover:text-slate-300'
                    }`}
                  >
                    <Circle sx={{ fontSize: 6, color: project.color }} />
                    <span className="truncate">{project.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar({ onClose }) {
  const location = useLocation();
  const { projects } = useProjects();
  const { profile, roles } = useUser();

  const [expandedCompanies, setExpandedCompanies] = useState(
    () => loadState('sidebar_state', {}),
  );

  const toggleCompany = (company) => {
    setExpandedCompanies((prev) => {
      const next = { ...prev, [company]: !prev[company] };
      saveState('sidebar_state', next);
      return next;
    });
  };

  // Group projects by company (via roleId → role.company)
  const companyGroups = useMemo(() => {
    const roleMap = {};
    roles.forEach((r) => { roleMap[r.id] = r; });

    const groups = {};
    projects.forEach((p) => {
      const role = p.roleId ? roleMap[p.roleId] : null;
      const company = role ? role.company : 'Unassigned';
      if (!groups[company]) groups[company] = [];
      groups[company].push(p);
    });

    // Sort companies alphabetically, but put "Unassigned" last
    return Object.entries(groups).sort(([a], [b]) => {
      if (a === 'Unassigned') return 1;
      if (b === 'Unassigned') return -1;
      return a.localeCompare(b);
    });
  }, [projects, roles]);

  const isNavActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const primaryRole = roles.find((r) => r.id === profile?.primaryRoleId);

  return (
    <aside
      className="flex h-screen w-[260px] flex-col border-r border-[#2A2D35] bg-[#0F1117]"
      style={{ position: onClose ? 'relative' : 'fixed', left: 0, top: 0, zIndex: 40 }}
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

      {/* Main nav — scrollable area */}
      <nav className="mt-2 flex-1 overflow-y-auto px-3">
        {/* Dashboard */}
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Main Menu
        </p>
        {topNavItems.map(({ label, path, icon }) => (
          <NavItem key={path} label={label} path={path} icon={icon} isActive={isNavActive(path)} />
        ))}

        {/* Projects by Company */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between px-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              Companies
            </p>
            <NavLink to="/projects">
              <span className="text-[10px] text-slate-600 transition-colors hover:text-slate-400">
                View All
              </span>
            </NavLink>
          </div>
          <div className="space-y-0.5">
            {companyGroups.map(([company, companyProjects]) => (
              <CompanySection
                key={company}
                company={company}
                projects={companyProjects}
                expandedCompanies={expandedCompanies}
                toggleCompany={toggleCompany}
                location={location}
              />
            ))}
          </div>
        </div>

        {/* Other nav items */}
        <div className="mt-5 space-y-1">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Tools
          </p>
          {bottomNavItems.map(({ label, path, icon }) => (
            <NavItem key={path} label={label} path={path} icon={icon} isActive={isNavActive(path)} />
          ))}
        </div>
      </nav>

      {/* Footer nav */}
      <div className="space-y-1 border-t border-[#2A2D35] px-3 pt-3 pb-3">
        {footerItems.map(({ label, path, icon }) => {
          const isActive = location.pathname.startsWith(path);
          return (
            <NavItem key={path} label={label} path={path} icon={icon} isActive={isActive} />
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
            {profile?.name?.split(' ').map((n) => n[0]).join('') || 'U'}
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold text-slate-200">
              {profile?.name || 'User'}
            </p>
            <p className="truncate text-[11px] text-slate-500">
              {primaryRole ? `${primaryRole.title}` : 'No role set'}
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
    </aside>
  );
}
