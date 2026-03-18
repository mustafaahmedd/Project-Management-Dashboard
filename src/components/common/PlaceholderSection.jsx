import { Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

export default function PlaceholderSection({ title, description, icon: Icon, minHeight = 300 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card>
        <CardContent
          sx={{ p: 4 }}
          className="flex flex-col items-center justify-center text-center"
          style={{ minHeight }}
        >
          {Icon && (
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6C63FF]/10">
              <Icon sx={{ fontSize: 28, color: '#6C63FF' }} />
            </div>
          )}
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            {description}
          </p>
          <div className="mt-6 h-px w-16 bg-gradient-to-r from-transparent via-[#6C63FF]/40 to-transparent" />
        </CardContent>
      </Card>
    </motion.div>
  );
}
