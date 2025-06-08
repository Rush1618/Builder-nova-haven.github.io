export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  instructor?: string;
  totalMarks: number;
  passingMarks: number;
  internalWeightage: number; // percentage (e.g., 25 for 25%)
  externalWeightage: number; // percentage (e.g., 75 for 75%)
}

export interface InternalAssessment {
  id: string;
  subjectId: string;
  type:
    | "assignment"
    | "quiz"
    | "presentation"
    | "lab"
    | "midterm"
    | "project"
    | "attendance";
  name: string;
  maxMarks: number;
  obtainedMarks?: number;
  dueDate: Date;
  submittedDate?: Date;
  feedback?: string;
  weightage: number; // percentage within internal assessment
  completed: boolean;
}

export interface ExternalExam {
  id: string;
  subjectId: string;
  type: "theory" | "practical" | "viva" | "project";
  name: string;
  maxMarks: number;
  obtainedMarks?: number;
  examDate: Date;
  duration: number; // in minutes
  syllabusCoverage: string[]; // topics covered
  difficulty: 1 | 2 | 3 | 4 | 5;
  completed: boolean;
  grade?: string;
}

export interface CGPACalculation {
  semesterNumber: number;
  subjects: {
    subjectId: string;
    credits: number;
    gradePoints: number; // out of 10
    grade: string; // A+, A, B+, B, C, etc.
  }[];
  sgpa: number; // Semester GPA
  cgpa: number; // Cumulative GPA
  totalCredits: number;
  totalCreditsEarned: number;
}

export interface MarksBreakdown {
  subjectId: string;
  subjectName: string;

  // Internal Assessment Breakdown
  internal: {
    totalPossible: number;
    totalObtained: number;
    percentage: number;
    breakdown: {
      assignments: { obtained: number; total: number };
      quizzes: { obtained: number; total: number };
      labs: { obtained: number; total: number };
      midterm: { obtained: number; total: number };
      attendance: { obtained: number; total: number };
      projects: { obtained: number; total: number };
    };
  };

  // External Assessment
  external: {
    totalPossible: number;
    totalObtained: number;
    percentage: number;
    breakdown: {
      theory: { obtained: number; total: number };
      practical: { obtained: number; total: number };
      viva: { obtained: number; total: number };
    };
  };

  // Final Calculation
  final: {
    totalMarks: number;
    obtainedMarks: number;
    percentage: number;
    gradePoints: number; // out of 10
    grade: string;
    status: "pass" | "fail" | "pending";
  };
}

export interface AcademicRecord {
  studentId: string;
  studentName: string;
  rollNumber: string;
  course: string;
  batch: string;
  currentSemester: number;

  subjects: Subject[];
  internalAssessments: InternalAssessment[];
  externalExams: ExternalExam[];

  semesterRecords: CGPACalculation[];
  currentCGPA: number;
  targetCGPA: number;

  // Performance Analytics
  analytics: {
    strongSubjects: string[];
    weakSubjects: string[];
    improvementAreas: string[];
    consistencyScore: number; // 0-100
    attendancePercentage: number;
  };
}

export interface GradeSchema {
  minMarks: number;
  maxMarks: number;
  grade: string;
  gradePoints: number;
  description: string;
}

// Indian CGPA Grading System (out of 10)
export const INDIAN_GRADE_SCHEMA: GradeSchema[] = [
  {
    minMarks: 90,
    maxMarks: 100,
    grade: "A+",
    gradePoints: 10,
    description: "Outstanding",
  },
  {
    minMarks: 80,
    maxMarks: 89,
    grade: "A",
    gradePoints: 9,
    description: "Excellent",
  },
  {
    minMarks: 70,
    maxMarks: 79,
    grade: "B+",
    gradePoints: 8,
    description: "Very Good",
  },
  {
    minMarks: 60,
    maxMarks: 69,
    grade: "B",
    gradePoints: 7,
    description: "Good",
  },
  {
    minMarks: 55,
    maxMarks: 59,
    grade: "C+",
    gradePoints: 6,
    description: "Above Average",
  },
  {
    minMarks: 50,
    maxMarks: 54,
    grade: "C",
    gradePoints: 5,
    description: "Average",
  },
  {
    minMarks: 45,
    maxMarks: 49,
    grade: "D",
    gradePoints: 4,
    description: "Below Average",
  },
  {
    minMarks: 40,
    maxMarks: 44,
    grade: "E",
    gradePoints: 0,
    description: "Poor",
  },
  {
    minMarks: 0,
    maxMarks: 39,
    grade: "F",
    gradePoints: 0,
    description: "Fail",
  },
];

export interface PerformancePrediction {
  subjectId: string;
  currentPerformance: number;
  predictedFinalMarks: number;
  predictedGrade: string;
  confidenceLevel: number; // 0-100
  improvementSuggestions: string[];
  requiredMarksForTarget: {
    gradeA: number;
    gradeBPlus: number;
    gradeB: number;
  };
}

export interface AttendanceRecord {
  id: string;
  subjectId: string;
  date: Date;
  type: "lecture" | "lab" | "tutorial";
  status: "present" | "absent" | "late";
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
}

export interface StudyRecommendation {
  id: string;
  subjectId: string;
  type: "weakness" | "improvement" | "maintenance" | "exam-prep";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  actionItems: string[];
  estimatedHours: number;
  deadline?: Date;
  impact: string; // Expected improvement in marks/grade
}
