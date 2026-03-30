import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Chip,
  LinearProgress,
  IconButton,
  Button,
} from '@mui/material';
import {
  ArrowBack,
  FolderCopy,
  AccessTime,
  CheckCircleOutline,
  Assignment,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import { useProjects } from '../context/ProjectContext';
import { useTasks } from '../context/TaskContext';
import { useUser } from '../context/UserContext';
import {
  computeProjectProgress,
  STATUS_DISPLAY,
  PRIORITY_COLOR,
  formatDate,
  relativeDate,
} from '../utils/format';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const STATUS_ORDER = ['todo', 'in_progress', 'in_review', 'done'];
const STATUS_LABELS = { todo: 'To Do', in_progress: 'In Progress', in_review: 'In Review', done: 'Done' };

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProject } = useProjects();
  const { tasks } = useTasks();
  const { getRole } = useUser();

  const project = getProject(id);

  const projectTasks = useMemo(
    () => tasks.filter((t) => t.projectId === id),
    [tasks, id],
  );

  const progress = useMemo(
    () => computeProjectProgress(projectTasks),
    [projectTasks],
  );

  const doneTasks = projectTasks.filter((t) => t.status === 'done').length;
  const totalHours = projectTasks.reduce((s, t) => s + t.loggedHours, 0);

  const role = project?.roleId ? getRole(project.roleId) : null;

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="text-slate-400 mb-4">Project not found</p>
        <Button variant="contained" onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  const statusInfo = STATUS_DISPLAY[project.status] || STATUS_DISPLAY.on_track;

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <PageHeader
          title={
            <div className="flex items-center gap-3">
              <IconButton onClick={() => navigate('/projects')} sx={{ color: '#94A3B8' }}>
                <ArrowBack />
              </IconButton>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: project.color + '15' }}
              >
                <FolderCopy sx={{ fontSize: 20, color: project.color }} />
              </div>
              <div>
                <span>{project.name}</span>
                {role && (
                  <p className="text-xs font-normal text-slate-500">
                    {role.title} @ {role.company}
                  </p>
                )}
              </div>
            </div>
          }
          subtitle={project.description}
          action={
            <Chip
              label={statusInfo.label}
              sx={{
                backgroundColor: statusInfo.color + '15',
                color: statusInfo.color,
                fontWeight: 600,
              }}
            />
          }
        />
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Progress"
          value={`${progress}%`}
          subtitle={`${doneTasks}/${projectTasks.length} tasks done`}
          icon={CheckCircleOutline}
          color={project.color}
        />
        <StatCard
          title="Tasks"
          value={projectTasks.length}
          subtitle={`${projectTasks.filter((t) => t.status === 'in_progress').length} in progress`}
          icon={Assignment}
          color="#60A5FA"
        />
        <StatCard
          title="Hours Logged"
          value={`${totalHours.toFixed(1)}h`}
          subtitle={`${projectTasks.reduce((s, t) => s + t.estimatedHours, 0)}h estimated`}
          icon={AccessTime}
          color="#FBBF24"
        />
        <StatCard
          title="Deadline"
          value={project.deadline ? relativeDate(project.deadline) : 'None'}
          subtitle={project.deadline ? formatDate(project.deadline) : 'No deadline set'}
          icon={FolderCopy}
          color="#F87171"
        />
      </motion.div>

      {/* Progress bar */}
      <motion.div variants={item} className="mt-6">
        <Card>
          <CardContent sx={{ p: 3 }}>
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>Overall Progress</span>
              <span>{progress}%</span>
            </div>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#1E2128',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: project.color,
                },
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Tasks by status */}
      <motion.div variants={item} className="mt-6">
        <h3 className="mb-4 text-sm font-semibold text-slate-300">Tasks</h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {STATUS_ORDER.map((status) => {
            const statusTasks = projectTasks.filter((t) => t.status === status);
            return (
              <div key={status}>
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor:
                        status === 'done' ? '#34D399'
                        : status === 'in_review' ? '#FBBF24'
                        : status === 'in_progress' ? '#60A5FA'
                        : '#94A3B8',
                    }}
                  />
                  <span className="text-xs font-medium text-slate-400">
                    {STATUS_LABELS[status]}
                  </span>
                  <span className="text-xs text-slate-600">{statusTasks.length}</span>
                </div>
                <div className="space-y-2">
                  {statusTasks.map((task) => (
                    <Card key={task.id} sx={{ '&:hover': { borderColor: '#3A3D45' } }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <p className="text-sm font-medium text-slate-200">{task.title}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Chip
                            label={task.priority}
                            size="small"
                            sx={{
                              backgroundColor: PRIORITY_COLOR[task.priority] + '15',
                              color: PRIORITY_COLOR[task.priority],
                              fontSize: '0.6rem',
                              height: 20,
                              textTransform: 'capitalize',
                            }}
                          />
                          {task.deadline && (
                            <span className="text-[10px] text-slate-500">
                              {relativeDate(task.deadline)}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {statusTasks.length === 0 && (
                    <p className="py-4 text-center text-xs text-slate-600">No tasks</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
