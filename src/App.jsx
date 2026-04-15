import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import darkTheme from './theme/darkTheme';
import { UserProvider } from './context/UserContext';
import { ProjectProvider } from './context/ProjectContext';
import { TaskProvider } from './context/TaskContext';
import { TimeProvider } from './context/TimeContext';
import { MilestoneProvider } from './context/MilestoneContext';
import { LogProvider } from './context/LogContext';
import { IdeaProvider } from './context/IdeaContext';
import { PaymentProvider } from './context/PaymentContext';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import TimeTrackingPage from './pages/TimeTrackingPage';
import MilestonesPage from './pages/MilestonesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import DailyLogPage from './pages/DailyLogPage';
import IdeasPage from './pages/IdeasPage';
import PaymentsPage from './pages/PaymentsPage';
import InvoicePage from './pages/InvoicePage';

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <UserProvider>
        <ProjectProvider>
          <TaskProvider>
            <TimeProvider>
              <MilestoneProvider>
                <LogProvider>
                <IdeaProvider>
                  <PaymentProvider>
                    <BrowserRouter>
                      <Routes>
                        <Route element={<AppLayout />}>
                          <Route path="/" element={<DashboardPage />} />
                          <Route path="/projects" element={<ProjectsPage />} />
                          <Route path="/projects/:id" element={<ProjectDetailPage />} />
                          <Route path="/tasks" element={<TasksPage />} />
                          <Route path="/calendar" element={<CalendarPage />} />
                          <Route path="/time-tracking" element={<TimeTrackingPage />} />
                          <Route path="/milestones" element={<MilestonesPage />} />
                          <Route path="/analytics" element={<AnalyticsPage />} />
                          <Route path="/daily-log" element={<DailyLogPage />} />
                          <Route path="/ideas" element={<IdeasPage />} />
                          <Route path="/payments" element={<PaymentsPage />} />
                          <Route path="/invoice" element={<InvoicePage />} />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/settings" element={<SettingsPage />} />
                        </Route>
                      </Routes>
                    </BrowserRouter>
                  </PaymentProvider>
                </IdeaProvider>
                </LogProvider>
              </MilestoneProvider>
            </TimeProvider>
          </TaskProvider>
        </ProjectProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
