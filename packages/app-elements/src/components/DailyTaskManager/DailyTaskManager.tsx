import { useState, useCallback } from 'react';
import { Button } from '../Button';
import './DailyTaskManager.scss';

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface DailyTaskManagerProps {
  tasks?: TaskItem[];
  selected?: boolean;
  skeleton?: boolean;
  skeletonAnimation?: 'pulse' | 'shimmer';
}

const DEFAULT_TASKS: TaskItem[] = [
  { id: '1', text: 'Review pull requests', completed: false },
  { id: '2', text: 'Update design tokens', completed: false },
  { id: '3', text: 'Write component docs', completed: false },
  { id: '4', text: 'Fix accessibility issues', completed: false },
  { id: '5', text: 'Deploy to staging', completed: false },
];

export function DailyTaskManager({ tasks: initialTasks, selected = false, skeleton = false, skeletonAnimation = 'pulse' }: DailyTaskManagerProps) {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks ?? DEFAULT_TASKS);
  const [newTask, setNewTask] = useState('');

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const percentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const addTask = useCallback(() => {
    const text = newTask.trim();
    if (!text) return;
    setTasks(prev => [...prev, { id: Date.now().toString(), text, completed: false }]);
    setNewTask('');
  }, [newTask]);

  const removeTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const classes = [
    'jf-daily-tasks',
    selected && 'jf-daily-tasks--selected',
  ].filter(Boolean).join(' ');

  const animClass = skeletonAnimation === 'shimmer' ? 'animate-shimmer' : 'animate-pulse';

  if (skeleton) {
    return (
      <div className={classes}>
        <div className={`jf-daily-tasks__header ${animClass}`}>
          <div className="jf-daily-tasks__icon jf-skeleton__bone" style={{ width: 32, height: 32, borderRadius: 6 }} />
          <div className="jf-daily-tasks__header-text">
            <div className="jf-skeleton__bone jf-skeleton__line jf-skeleton__line--lg" />
            <div className="jf-skeleton__bone jf-skeleton__line jf-skeleton__line--sm" />
          </div>
        </div>
        <div className={`jf-daily-tasks__progress ${animClass}`}>
          <div className="jf-daily-tasks__progress-track jf-skeleton__bone" />
        </div>
        <div className={`jf-daily-tasks__list ${animClass}`}>
          {tasks.map((_, i) => (
            <div key={i} className="jf-daily-tasks__item">
              <div className="jf-skeleton__bone jf-skeleton__line jf-skeleton__line--md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={classes}>
      {/* Header */}
      <div className="jf-daily-tasks__header">
        <div className="jf-daily-tasks__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        </div>
        <div className="jf-daily-tasks__header-text">
          <h3 className="jf-daily-tasks__title">Daily Tasks</h3>
          <p className="jf-daily-tasks__subtitle">
            {percentage === 100 ? 'All done! Great work.' : `${percentage}% completed`}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="jf-daily-tasks__progress">
        <div className="jf-daily-tasks__progress-track">
          <div
            className="jf-daily-tasks__progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Task list */}
      <div className="jf-daily-tasks__list">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`jf-daily-tasks__item${task.completed ? ' completed' : ''}`}
          >
            <button
              className="jf-daily-tasks__checkbox"
              onClick={() => toggleTask(task.id)}
            >
              {task.completed && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
            </button>
            <span className="jf-daily-tasks__item-text">{task.text}</span>
            <div className="jf-daily-tasks__remove" onClick={() => removeTask(task.id)}>
              <Button
                iconOnly
                iconOnlyIcon="Trash2"
                iconOnlyFilled={false}
                iconOnlySm
                corner="Default"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add task */}
      <div className="jf-daily-tasks__add">
        <input
          className="jf-daily-tasks__input"
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') addTask(); }}
        />
        <button
          className="jf-daily-tasks__add-btn"
          onClick={addTask}
          disabled={!newTask.trim()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default DailyTaskManager;
