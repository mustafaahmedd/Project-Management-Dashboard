import { CalendarMonth } from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import PlaceholderSection from '../components/common/PlaceholderSection';

export default function CalendarPage() {
  return (
    <div>
      <PageHeader
        title="Calendar"
        subtitle="Visualize deadlines, milestones, and scheduled tasks on a timeline."
      />
      <PlaceholderSection
        icon={CalendarMonth}
        title="Calendar View"
        description="An interactive calendar will display all your task deadlines, sprint dates, milestone markers, and scheduled meetings. Drag-and-drop rescheduling and color-coded project tags coming soon."
        minHeight={500}
      />
    </div>
  );
}
