export interface SyllabusModule {
  id: string;
  name: string;
  topics: string[];
  estimatedHours: number;
  priority: "high" | "medium" | "low";
  difficulty: 1 | 2 | 3 | 4 | 5;
  completed: boolean;
  progress: number; // 0-100
  startDate?: Date;
  targetDate?: Date;
}

export interface Exam {
  id: string;
  name: string;
  subject: string;
  date: Date;
  duration: number; // in minutes
  totalMarks: number;
  weightage: number; // percentage of total grade
  syllabusModules: string[]; // Module IDs covered in this exam
  type: "midterm" | "final" | "quiz" | "assignment" | "lab";
  preparationStatus: "not-started" | "in-progress" | "completed";
  predictedScore?: number;
}

export interface StudyPattern {
  id: string;
  userId: string;
  preferredStudyHours: number[];
  averageSessionDuration: number; // in minutes
  productiveTimeSlots: string[]; // e.g., ['09:00-11:00', '14:00-16:00']
  breakFrequency: number; // minutes between breaks
  difficultyPreference: "easy-first" | "hard-first" | "mixed";
  retentionRate: number; // 0-1, how well they retain information
  procrastinationTendency: number; // 0-1, likelihood to postpone
  strongSubjects: string[];
  weakSubjects: string[];
  learningStyle: "visual" | "auditory" | "kinesthetic" | "reading";
  lastUpdated: Date;
}

export interface AcademicProfile {
  id: string;
  currentCGPA: number;
  targetCGPA: number;
  semester: number;
  year: number;
  major: string;
  subjects: Subject[];
  examHistory: ExamResult[];
  studyGoals: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  instructor: string;
  currentGrade?: number;
  targetGrade: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  syllabus?: ParsedSyllabus;
  exams: Exam[];
}

export interface ExamResult {
  examId: string;
  subject: string;
  score: number;
  maxScore: number;
  date: Date;
  preparationTime: number; // hours spent preparing
  studyMethodsUsed: string[];
  effectiveness: number; // 0-1, how effective the study was
}

export interface ParsedSyllabus {
  id: string;
  subject: string;
  semester: string;
  modules: SyllabusModule[];
  totalHours: number;
  uploadedAt: Date;
  lastUpdated: Date;
  fileName: string;
  extractedText: string;
  confidence: number; // 0-1, parsing confidence
}

export interface StudyPlan {
  id: string;
  name: string;
  subject: string;
  examId?: string;
  startDate: Date;
  endDate: Date;
  totalHours: number;
  dailyPlans: DailyStudyPlan[];
  adaptiveFactors: {
    difficultyAdjustment: number;
    timeBufferPercentage: number;
    revisionCycles: number;
  };
  generatedAt: Date;
  lastAdjusted: Date;
  effectiveness?: number;
}

export interface DailyStudyPlan {
  date: Date;
  modules: string[]; // Module IDs to study
  estimatedHours: number;
  sessions: StudySession[];
  completed: boolean;
  actualHours?: number;
  effectiveness?: number;
}

export interface StudySession {
  id: string;
  moduleId: string;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  topics: string[];
  type: "learning" | "revision" | "practice" | "assessment";
  materials: string[];
  notes?: string;
  completed: boolean;
  effectiveness?: number; // 1-5 rating
}

export interface ProgressAnalytics {
  overallProgress: number;
  moduleProgress: Record<string, number>;
  timeSpent: Record<string, number>; // module ID -> hours
  predictedCompletion: Date;
  riskFactors: string[];
  recommendations: string[];
  performanceTrends: {
    date: Date;
    score: number;
    subject: string;
  }[];
}

export interface AIRecommendation {
  id: string;
  type:
    | "study-plan"
    | "time-management"
    | "focus-area"
    | "break-reminder"
    | "difficulty-adjustment";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  actionItems: string[];
  reasoning: string;
  impact: string;
  createdAt: Date;
  dismissed?: boolean;
}
