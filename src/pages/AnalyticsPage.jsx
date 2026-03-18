import { motion } from 'framer-motion';
import { Card, CardContent } from '@mui/material';
import {
  BarChart,
  TrendingUp,
  PieChart as PieChartIcon,
  Speed,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import PlaceholderSection from '../components/common/PlaceholderSection';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function AnalyticsPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <PageHeader
        title="Analytics"
        subtitle="Performance metrics, productivity insights, and value delivery tracking."
      />

      {/* KPI row */}
      <motion.div variants={item} className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Velocity" value="34 pts" subtitle="Current sprint" icon={Speed} color="#6C63FF" />
        <StatCard title="Burn Rate" value="68%" subtitle="Sprint progress" icon={TrendingUp} color="#34D399" />
        <StatCard title="Avg Cycle Time" value="2.4d" subtitle="Per task" icon={BarChart} color="#60A5FA" />
        <StatCard title="Value Delivered" value="$42K" subtitle="This quarter" icon={PieChartIcon} color="#FBBF24" />
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <motion.div variants={item}>
          <PlaceholderSection
            icon={BarChart}
            title="Productivity Trends"
            description="Weekly task completion chart, burndown/burnup, and velocity trends over the last 6 sprints. Recharts-powered interactive graphs coming next."
            minHeight={320}
          />
        </motion.div>
        <motion.div variants={item}>
          <PlaceholderSection
            icon={PieChartIcon}
            title="Time Distribution"
            description="Breakdown of hours by project, task type, and priority level. Donut chart visualization with drill-down capability."
            minHeight={320}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
