import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import darkTheme from './theme/darkTheme';
import { ProjectProvider } from './context/ProjectContext';
import { TaskProvider } from './context/TaskContext';
import { TimeProvider } from './context/TimeContext';
import { MilestoneProvider } from './context/MilestoneContext';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import TimeTrackingPage from './pages/TimeTrackingPage';
import MilestonesPage from './pages/MilestonesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ProjectProvider>
        <TaskProvider>
          <TimeProvider>
            <MilestoneProvider>
              <BrowserRouter>
                <Routes>
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/time-tracking" element={<TimeTrackingPage />} />
                    <Route path="/milestones" element={<MilestonesPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </MilestoneProvider>
          </TimeProvider>
        </TaskProvider>
      </ProjectProvider>
    </ThemeProvider>
  );
}
