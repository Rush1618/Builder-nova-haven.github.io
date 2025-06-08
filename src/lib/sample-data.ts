import { storage } from "./storage";
import { Task, Goal, ClassSchedule } from "@/types/planner";

// Sample tasks
const sampleTasks: Omit<Task, "id" | "createdAt" | "updatedAt">[] = [
  {
    title: "Complete Math Assignment Chapter 5",
    description: "Solve problems 1-20 on differential equations",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    priority: "high",
    category: "assignment",
    completed: false,
    estimatedTime: 90,
    tags: ["math", "differential-equations"],
  },
  {
    title: "Study for Chemistry Exam",
    description: "Review chapters 8-12 on organic chemistry",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
    priority: "high",
    category: "exam",
    completed: false,
    estimatedTime: 120,
    tags: ["chemistry", "organic"],
  },
  {
    title: "Write History Essay",
    description: "Essay on World War II causes and effects (1500 words)",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // In 5 days
    priority: "medium",
    category: "assignment",
    completed: false,
    estimatedTime: 180,
    tags: ["history", "essay", "wwii"],
  },
  {
    title: "Physics Lab Report",
    description: "Complete lab report on pendulum motion experiment",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
    priority: "medium",
    category: "assignment",
    completed: false,
    estimatedTime: 60,
    tags: ["physics", "lab"],
  },
  {
    title: "Read Biology Chapter 12",
    description: "Read and take notes on cellular respiration",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    priority: "low",
    category: "study",
    completed: true,
    estimatedTime: 45,
    tags: ["biology", "reading"],
  },
  {
    title: "Programming Project Proposal",
    description: "Submit project proposal for final CS project",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // In a week
    priority: "medium",
    category: "project",
    completed: false,
    estimatedTime: 120,
    tags: ["programming", "proposal"],
  },
];

// Sample goals
const sampleGoals: Omit<Goal, "id" | "createdAt" | "updatedAt">[] = [
  {
    title: "Achieve 3.8 GPA this semester",
    description: "Maintain high grades across all subjects to reach target GPA",
    targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // In 3 months
    category: "academic",
    progress: 65,
    milestones: [
      {
        id: crypto.randomUUID(),
        title: "Complete all assignments on time",
        completed: true,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: crypto.randomUUID(),
        title: "Score 85+ on all midterm exams",
        completed: false,
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      },
      {
        id: crypto.randomUUID(),
        title: "Maintain consistent study schedule",
        completed: true,
      },
    ],
  },
  {
    title: "Learn Python Programming",
    description: "Master Python fundamentals and build 3 projects",
    targetDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // In 4 months
    category: "skill",
    progress: 40,
    milestones: [
      {
        id: crypto.randomUUID(),
        title: "Complete Python basics course",
        completed: true,
      },
      {
        id: crypto.randomUUID(),
        title: "Build calculator app",
        completed: true,
      },
      {
        id: crypto.randomUUID(),
        title: "Build web scraper project",
        completed: false,
      },
      {
        id: crypto.randomUUID(),
        title: "Build data analysis project",
        completed: false,
      },
    ],
  },
  {
    title: "Read 12 books this year",
    description: "Read one book per month on various topics",
    targetDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000), // End of year
    category: "personal",
    progress: 25,
    milestones: [
      {
        id: crypto.randomUUID(),
        title: "Read 3 books (Q1)",
        completed: true,
      },
      {
        id: crypto.randomUUID(),
        title: "Read 6 books (Q2)",
        completed: false,
      },
      {
        id: crypto.randomUUID(),
        title: "Read 9 books (Q3)",
        completed: false,
      },
      {
        id: crypto.randomUUID(),
        title: "Read 12 books (Q4)",
        completed: false,
      },
    ],
  },
];

// Sample class schedule
const sampleSchedule: Omit<ClassSchedule, "id">[] = [
  {
    subject: "Advanced Mathematics",
    instructor: "Dr. Smith",
    room: "Room 201",
    dayOfWeek: 1, // Monday
    startTime: "09:00",
    endTime: "10:30",
    color: "#3b82f6",
    recurring: true,
  },
  {
    subject: "Advanced Mathematics",
    instructor: "Dr. Smith",
    room: "Room 201",
    dayOfWeek: 3, // Wednesday
    startTime: "09:00",
    endTime: "10:30",
    color: "#3b82f6",
    recurring: true,
  },
  {
    subject: "Chemistry Lab",
    instructor: "Prof. Johnson",
    room: "Lab 101",
    dayOfWeek: 2, // Tuesday
    startTime: "14:00",
    endTime: "16:00",
    color: "#10b981",
    recurring: true,
  },
  {
    subject: "History Seminar",
    instructor: "Dr. Brown",
    room: "Room 305",
    dayOfWeek: 4, // Thursday
    startTime: "11:00",
    endTime: "12:30",
    color: "#f59e0b",
    recurring: true,
  },
  {
    subject: "Physics Lecture",
    instructor: "Prof. Davis",
    room: "Auditorium A",
    dayOfWeek: 1, // Monday
    startTime: "13:00",
    endTime: "14:30",
    color: "#ef4444",
    recurring: true,
  },
  {
    subject: "Physics Lecture",
    instructor: "Prof. Davis",
    room: "Auditorium A",
    dayOfWeek: 5, // Friday
    startTime: "13:00",
    endTime: "14:30",
    color: "#ef4444",
    recurring: true,
  },
  {
    subject: "Computer Science",
    instructor: "Dr. Wilson",
    room: "Computer Lab",
    dayOfWeek: 2, // Tuesday
    startTime: "10:00",
    endTime: "11:30",
    color: "#8b5cf6",
    recurring: true,
  },
  {
    subject: "Computer Science",
    instructor: "Dr. Wilson",
    room: "Computer Lab",
    dayOfWeek: 4, // Thursday
    startTime: "10:00",
    endTime: "11:30",
    color: "#8b5cf6",
    recurring: true,
  },
  {
    subject: "Biology",
    instructor: "Prof. Anderson",
    room: "Room 150",
    dayOfWeek: 3, // Wednesday
    startTime: "15:00",
    endTime: "16:30",
    color: "#06b6d4",
    recurring: true,
  },
  {
    subject: "Biology",
    instructor: "Prof. Anderson",
    room: "Room 150",
    dayOfWeek: 5, // Friday
    startTime: "15:00",
    endTime: "16:30",
    color: "#06b6d4",
    recurring: true,
  },
];

export function initializeSampleData() {
  // Check if data already exists
  const existingTasks = storage.getTasks();
  const existingGoals = storage.getGoals();
  const existingSchedule = storage.getSchedule();

  // Only add sample data if storage is empty
  if (
    existingTasks.length === 0 &&
    existingGoals.length === 0 &&
    existingSchedule.length === 0
  ) {
    // Add sample tasks
    sampleTasks.forEach((taskData) => {
      storage.addTask(taskData);
    });

    // Add sample goals
    sampleGoals.forEach((goalData) => {
      storage.addGoal(goalData);
    });

    // Add sample schedule
    sampleSchedule.forEach((scheduleData) => {
      storage.addScheduleItem(scheduleData);
    });

    console.log("Sample data initialized successfully!");
    return true;
  }

  return false;
}
