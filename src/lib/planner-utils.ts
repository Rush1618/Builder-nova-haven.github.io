import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  isSameDay,
  parseISO,
  isAfter,
  isBefore,
} from "date-fns";
import {
  Task,
  Goal,
  ClassSchedule,
  StudySession,
  ViewType,
} from "@/types/planner";

export function formatTaskDate(date: Date): string {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d, yyyy");
}

export function formatTime(date: Date): string {
  return format(date, "h:mm a");
}

export function formatTimeRange(start: Date, end: Date): string {
  return `${formatTime(start)} - ${formatTime(end)}`;
}

export function getTaskPriorityColor(priority: Task["priority"]): string {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-50 border-red-200";
    case "medium":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "low":
      return "text-green-600 bg-green-50 border-green-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export function getTaskCategoryColor(category: Task["category"]): string {
  switch (category) {
    case "assignment":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "study":
      return "text-purple-600 bg-purple-50 border-purple-200";
    case "exam":
      return "text-red-600 bg-red-50 border-red-200";
    case "project":
      return "text-indigo-600 bg-indigo-50 border-indigo-200";
    case "other":
      return "text-gray-600 bg-gray-50 border-gray-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export function getGoalCategoryColor(category: Goal["category"]): string {
  switch (category) {
    case "academic":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "personal":
      return "text-green-600 bg-green-50 border-green-200";
    case "skill":
      return "text-purple-600 bg-purple-50 border-purple-200";
    case "career":
      return "text-orange-600 bg-orange-50 border-orange-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export function isTaskOverdue(task: Task): boolean {
  if (task.completed) return false;
  return isBefore(task.dueDate, new Date());
}

export function isTaskDueSoon(
  task: Task,
  hoursThreshold: number = 24,
): boolean {
  if (task.completed) return false;
  const now = new Date();
  const threshold = new Date(now.getTime() + hoursThreshold * 60 * 60 * 1000);
  return isAfter(task.dueDate, now) && isBefore(task.dueDate, threshold);
}

export function getTasksForDate(tasks: Task[], date: Date): Task[] {
  return tasks.filter((task) => isSameDay(task.dueDate, date));
}

export function getTasksForWeek(
  tasks: Task[],
  date: Date,
  weekStartsOn: 0 | 1 = 1,
): Task[] {
  const weekStart = startOfWeek(date, { weekStartsOn });
  const weekEnd = endOfWeek(date, { weekStartsOn });

  return tasks.filter(
    (task) =>
      (isAfter(task.dueDate, weekStart) && isBefore(task.dueDate, weekEnd)) ||
      isSameDay(task.dueDate, weekStart) ||
      isSameDay(task.dueDate, weekEnd),
  );
}

export function getTasksForMonth(tasks: Task[], date: Date): Task[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  return tasks.filter(
    (task) =>
      (isAfter(task.dueDate, monthStart) && isBefore(task.dueDate, monthEnd)) ||
      isSameDay(task.dueDate, monthStart) ||
      isSameDay(task.dueDate, monthEnd),
  );
}

export function getScheduleForDay(
  schedule: ClassSchedule[],
  dayOfWeek: number,
): ClassSchedule[] {
  return schedule
    .filter((item) => item.dayOfWeek === dayOfWeek)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function getStudySessionsForDate(
  sessions: StudySession[],
  date: Date,
): StudySession[] {
  return sessions.filter((session) => isSameDay(session.startTime, date));
}

export function calculateGoalProgress(goal: Goal): number {
  if (goal.milestones.length === 0) return goal.progress;

  const completedMilestones = goal.milestones.filter((m) => m.completed).length;
  return Math.round((completedMilestones / goal.milestones.length) * 100);
}

export function getUpcomingDeadlines(tasks: Task[], days: number = 7): Task[] {
  const now = new Date();
  const futureDate = addDays(now, days);

  return tasks
    .filter((task) => !task.completed)
    .filter(
      (task) =>
        isAfter(task.dueDate, now) && isBefore(task.dueDate, futureDate),
    )
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

export function getOverdueTasks(tasks: Task[]): Task[] {
  return tasks
    .filter((task) => !task.completed && isTaskOverdue(task))
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

export function getCompletionStats(
  tasks: Task[],
  goals: Goal[],
): {
  tasksCompleted: number;
  totalTasks: number;
  goalsOnTrack: number;
  totalGoals: number;
  completionRate: number;
} {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const onTrackGoals = goals.filter((goal) => goal.progress >= 50).length;

  return {
    tasksCompleted: completedTasks,
    totalTasks: tasks.length,
    goalsOnTrack: onTrackGoals,
    totalGoals: goals.length,
    completionRate:
      tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0,
  };
}

export function generateTimeSlots(
  startHour: number = 6,
  endHour: number = 22,
  intervalMinutes: number = 30,
): string[] {
  const slots: string[] = [];

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minutes = 0; minutes < 60; minutes += intervalMinutes) {
      const time = new Date();
      time.setHours(hour, minutes, 0, 0);
      slots.push(format(time, "HH:mm"));
    }
  }

  return slots;
}

export function exportToCSV(data: any[], filename: string): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (value instanceof Date) {
            return `"${format(value, "yyyy-MM-dd HH:mm:ss")}"`;
          }
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getDaysInWeek(date: Date, weekStartsOn: 0 | 1 = 1): Date[] {
  const weekStart = startOfWeek(date, { weekStartsOn });
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

export function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function parseTimeString(timeString: string): {
  hours: number;
  minutes: number;
} {
  const [hours, minutes] = timeString.split(":").map(Number);
  return { hours, minutes };
}

export function createTimeFromString(
  timeString: string,
  baseDate: Date = new Date(),
): Date {
  const { hours, minutes } = parseTimeString(timeString);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}
