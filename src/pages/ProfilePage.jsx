import { motion } from 'framer-motion';
import { Card, CardContent, Avatar, Chip } from '@mui/material';
import { Person } from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';

export default function ProfilePage() {
  return (
    <div>
      <PageHeader
        title="Profile"
        subtitle="Your account details and activity summary."
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <Card>
          <CardContent sx={{ p: 4 }}>
            <div className="flex items-center gap-5">
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: '#6C63FF',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                }}
              >
                MA
              </Avatar>
              <div>
                <h3 className="text-xl font-bold text-white">Mustafa Ahmed</h3>
                <p className="text-sm text-slate-400">Software Engineer</p>
                <div className="mt-2 flex gap-2">
                  <Chip label="Full-Stack" size="small" sx={{ bgcolor: '#6C63FF15', color: '#918AFF', fontSize: '0.7rem' }} />
                  <Chip label="Team Lead" size="small" sx={{ bgcolor: '#34D39915', color: '#34D399', fontSize: '0.7rem' }} />
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl border border-[#2A2D35] p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">8</p>
                <p className="text-xs text-slate-500">Active Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">142</p>
                <p className="text-xs text-slate-500">Tasks Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">36.5h</p>
                <p className="text-xs text-slate-500">Hours This Week</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-[#2A2D35] p-3">
                <span className="text-sm text-slate-400">Email</span>
                <span className="text-sm text-slate-200">mustafa@company.com</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-[#2A2D35] p-3">
                <span className="text-sm text-slate-400">Department</span>
                <span className="text-sm text-slate-200">Engineering</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-[#2A2D35] p-3">
                <span className="text-sm text-slate-400">Joined</span>
                <span className="text-sm text-slate-200">Jan 2025</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
