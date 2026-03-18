import { Settings } from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import PlaceholderSection from '../components/common/PlaceholderSection';

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Configure your dashboard preferences, notifications, and integrations."
      />
      <PlaceholderSection
        icon={Settings}
        title="Application Settings"
        description="Theme preferences, notification controls, calendar integrations, API keys, workspace configuration, and team management. SaaS-ready settings panel coming soon."
        minHeight={400}
      />
    </div>
  );
}
