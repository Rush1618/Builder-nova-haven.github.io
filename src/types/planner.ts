export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  category: "assignment" | "study" | "exam" | "project" | "other";
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  estimatedTime?: number; // in minutes
  tags?: string[];
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate: Date;
  progress: number; // 0-100
  category: "academic" | "personal" | "skill" | "career";
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
}

export interface ClassSchedule {
  id: string;
  subject: string;
  instructor?: string;
  room?: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  color: string;
  recurring: boolean;
}

export interface StudySession {
  id: string;
  subject: string;
  startTime: Date;
  endTime: Date;
  completed: boolean;
  notes?: string;
  effectiveness?: number; // 1-5 rating
}

export interface PlannerSettings {
  theme: "light" | "dark" | "auto";
  weekStartsOn: 0 | 1; // 0 for Sunday, 1 for Monday
  defaultView: "daily" | "weekly" | "monthly";
  notifications: {
    enabled: boolean;
    deadlineReminders: number[]; // hours before deadline
    studySessionReminders: boolean;
  };
  ui: {
    fontSize: "small" | "medium" | "large";
    compactMode: boolean;
  };
}

export interface PlannerData {
  tasks: Task[];
  goals: Goal[];
  schedule: ClassSchedule[];
  studySessions: StudySession[];
  settings: PlannerSettings;
}

export type ViewType = "daily" | "weekly" | "monthly";
export type FilterType = "all" | "pending" | "completed" | "overdue";
