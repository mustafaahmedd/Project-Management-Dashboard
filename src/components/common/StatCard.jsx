import { Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, subtitle, icon: Icon, color = '#6C63FF' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {title}
              </p>
              <p className="mt-2 text-3xl font-bold text-white">{value}</p>
              {subtitle && (
                <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
              )}
            </div>
            {Icon && (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon sx={{ fontSize: 22, color }} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
