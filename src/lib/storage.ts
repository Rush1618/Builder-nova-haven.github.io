import {
  PlannerData,
  Task,
  Goal,
  ClassSchedule,
  StudySession,
  PlannerSettings,
} from "@/types/planner";

const STORAGE_KEY = "study-planner-data";

const defaultSettings: PlannerSettings = {
  theme: "light",
  weekStartsOn: 1,
  defaultView: "daily",
  notifications: {
    enabled: true,
    deadlineReminders: [24, 2], // 24 hours and 2 hours before
    studySessionReminders: true,
  },
  ui: {
    fontSize: "medium",
    compactMode: false,
  },
};

const defaultData: PlannerData = {
  tasks: [],
  goals: [],
  schedule: [],
  studySessions: [],
  settings: defaultSettings,
};

export class PlannerStorage {
  private static instance: PlannerStorage;
  private data: PlannerData;

  private constructor() {
    this.data = this.loadData();
  }

  static getInstance(): PlannerStorage {
    if (!PlannerStorage.instance) {
      PlannerStorage.instance = new PlannerStorage();
    }
    return PlannerStorage.instance;
  }

  private loadData(): PlannerData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.tasks =
          parsed.tasks?.map((task: any) => ({
            ...task,
            dueDate: new Date(task.dueDate),
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
          })) || [];

        parsed.goals =
          parsed.goals?.map((goal: any) => ({
            ...goal,
            targetDate: new Date(goal.targetDate),
            createdAt: new Date(goal.createdAt),
            updatedAt: new Date(goal.updatedAt),
            milestones:
              goal.milestones?.map((milestone: any) => ({
                ...milestone,
                dueDate: milestone.dueDate
                  ? new Date(milestone.dueDate)
                  : undefined,
              })) || [],
          })) || [];

        parsed.studySessions =
          parsed.studySessions?.map((session: any) => ({
            ...session,
            startTime: new Date(session.startTime),
            endTime: new Date(session.endTime),
          })) || [];

        return { ...defaultData, ...parsed };
      }
    } catch (error) {
      console.error("Error loading planner data:", error);
    }
    return defaultData;
  }

  private saveData(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error("Error saving planner data:", error);
    }
  }

  // Tasks
  getTasks(): Task[] {
    return this.data.tasks;
  }

  addTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Task {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.data.tasks.push(newTask);
    this.saveData();
    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>): Task | null {
    const taskIndex = this.data.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) return null;

    this.data.tasks[taskIndex] = {
      ...this.data.tasks[taskIndex],
      ...updates,
      updatedAt: new Date(),
    };
    this.saveData();
    return this.data.tasks[taskIndex];
  }

  deleteTask(id: string): boolean {
    const initialLength = this.data.tasks.length;
    this.data.tasks = this.data.tasks.filter((task) => task.id !== id);
    if (this.data.tasks.length < initialLength) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Goals
  getGoals(): Goal[] {
    return this.data.goals;
  }

  addGoal(goal: Omit<Goal, "id" | "createdAt" | "updatedAt">): Goal {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.data.goals.push(newGoal);
    this.saveData();
    return newGoal;
  }

  updateGoal(id: string, updates: Partial<Goal>): Goal | null {
    const goalIndex = this.data.goals.findIndex((goal) => goal.id === id);
    if (goalIndex === -1) return null;

    this.data.goals[goalIndex] = {
      ...this.data.goals[goalIndex],
      ...updates,
      updatedAt: new Date(),
    };
    this.saveData();
    return this.data.goals[goalIndex];
  }

  deleteGoal(id: string): boolean {
    const initialLength = this.data.goals.length;
    this.data.goals = this.data.goals.filter((goal) => goal.id !== id);
    if (this.data.goals.length < initialLength) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Schedule
  getSchedule(): ClassSchedule[] {
    return this.data.schedule;
  }

  addScheduleItem(item: Omit<ClassSchedule, "id">): ClassSchedule {
    const newItem: ClassSchedule = {
      ...item,
      id: crypto.randomUUID(),
    };
    this.data.schedule.push(newItem);
    this.saveData();
    return newItem;
  }

  updateScheduleItem(
    id: string,
    updates: Partial<ClassSchedule>,
  ): ClassSchedule | null {
    const itemIndex = this.data.schedule.findIndex((item) => item.id === id);
    if (itemIndex === -1) return null;

    this.data.schedule[itemIndex] = {
      ...this.data.schedule[itemIndex],
      ...updates,
    };
    this.saveData();
    return this.data.schedule[itemIndex];
  }

  deleteScheduleItem(id: string): boolean {
    const initialLength = this.data.schedule.length;
    this.data.schedule = this.data.schedule.filter((item) => item.id !== id);
    if (this.data.schedule.length < initialLength) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Study Sessions
  getStudySessions(): StudySession[] {
    return this.data.studySessions;
  }

  addStudySession(session: Omit<StudySession, "id">): StudySession {
    const newSession: StudySession = {
      ...session,
      id: crypto.randomUUID(),
    };
    this.data.studySessions.push(newSession);
    this.saveData();
    return newSession;
  }

  updateStudySession(
    id: string,
    updates: Partial<StudySession>,
  ): StudySession | null {
    const sessionIndex = this.data.studySessions.findIndex(
      (session) => session.id === id,
    );
    if (sessionIndex === -1) return null;

    this.data.studySessions[sessionIndex] = {
      ...this.data.studySessions[sessionIndex],
      ...updates,
    };
    this.saveData();
    return this.data.studySessions[sessionIndex];
  }

  deleteStudySession(id: string): boolean {
    const initialLength = this.data.studySessions.length;
    this.data.studySessions = this.data.studySessions.filter(
      (session) => session.id !== id,
    );
    if (this.data.studySessions.length < initialLength) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Settings
  getSettings(): PlannerSettings {
    return this.data.settings;
  }

  updateSettings(updates: Partial<PlannerSettings>): PlannerSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.saveData();
    return this.data.settings;
  }

  // Export/Import
  exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData);
      // Validate the structure
      if (
        imported.tasks &&
        imported.goals &&
        imported.schedule &&
        imported.studySessions &&
        imported.settings
      ) {
        this.data = imported;
        this.saveData();
        return true;
      }
    } catch (error) {
      console.error("Error importing data:", error);
    }
    return false;
  }

  // Clear all data
  clearAllData(): void {
    this.data = defaultData;
    this.saveData();
  }
}

export const storage = PlannerStorage.getInstance();
