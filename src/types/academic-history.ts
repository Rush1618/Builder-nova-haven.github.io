export interface AcademicYear {
  year: number; // 1, 2, 3, 4
  startDate: Date;
  endDate: Date;
  semesters: Semester[];
  yearGPA: number;
  totalCredits: number;
  completedCredits: number;
  status: "completed" | "current" | "upcoming";
}

export interface Semester {
  id: string;
  year: number;
  semester: number; // 1 (Odd) or 2 (Even)
  name: string; // "First Year - Semester 1", etc.
  startDate: Date;
  endDate: Date;
  subjects: SemesterSubject[];
  sgpa: number;
  totalCredits: number;
  earnedCredits: number;
  status: "completed" | "current" | "upcoming";
  rank?: number;
  attendancePercentage: number;
}

export interface SemesterSubject {
  id: string;
  semesterId: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  instructor: string;

  // Internal Assessment (25%)
  internalAssessment: {
    totalMarks: number;
    obtainedMarks: number;
    breakdown: {
      assignments: AssignmentRecord[];
      quizzes: QuizRecord[];
      midterms: ExamRecord[];
      practicals: PracticalRecord[];
      attendance: AttendanceRecord;
      projects: ProjectRecord[];
    };
  };

  // External Assessment (75%)
  externalAssessment: {
    totalMarks: number;
    obtainedMarks: number;
    examDate: Date;
    duration: number;
    syllabusTopics: string[];
    questionPaperPattern: string;
  };

  // Final Results
  finalMarks: number;
  finalGrade: string; // A+, A, B+, B, C+, C, D, F
  gradePoints: number; // out of 10
  passed: boolean;

  // Performance Analytics
  subjectRank?: number;
  classAverage?: number;
  improvement: number; // compared to previous semester
  timeSpentStudying: number; // hours
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface AssignmentRecord {
  id: string;
  title: string;
  maxMarks: number;
  obtainedMarks: number;
  submissionDate: Date;
  dueDate: Date;
  feedback: string;
  weightage: number; // percentage within internal
}

export interface QuizRecord {
  id: string;
  title: string;
  maxMarks: number;
  obtainedMarks: number;
  date: Date;
  topics: string[];
  duration: number; // minutes
}

export interface ExamRecord {
  id: string;
  type: "midterm" | "final";
  maxMarks: number;
  obtainedMarks: number;
  date: Date;
  duration: number;
  syllabusPercentage: number;
}

export interface PracticalRecord {
  id: string;
  title: string;
  maxMarks: number;
  obtainedMarks: number;
  date: Date;
  experiment: string;
  observations: string;
  vivaMarks: number;
}

export interface AttendanceRecord {
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  details: {
    lectures: { total: number; attended: number };
    practicals: { total: number; attended: number };
    tutorials: { total: number; attended: number };
  };
}

export interface ProjectRecord {
  id: string;
  title: string;
  description: string;
  maxMarks: number;
  obtainedMarks: number;
  submissionDate: Date;
  teamMembers?: string[];
  technology: string[];
  mentor: string;
}

export interface AcademicProgressAnalytics {
  studentId: string;

  // Overall 4-Year Summary
  overallCGPA: number;
  targetCGPA: number;
  totalCredits: number;
  completedCredits: number;

  // Year-wise Performance
  yearWiseGPA: { year: number; gpa: number; credits: number }[];
  semesterWiseGPA: { semester: string; sgpa: number; cgpa: number }[];

  // Subject Performance Trends
  subjectWiseTrends: {
    subjectName: string;
    grades: { semester: string; grade: string; gradePoints: number }[];
    averageGradePoints: number;
    improvement: "improving" | "declining" | "stable";
  }[];

  // Ranking and Position
  currentRank?: number;
  batchSize?: number;
  percentile?: number;

  // Performance Patterns
  strengths: string[]; // Strong subject areas
  weaknesses: string[]; // Areas needing improvement
  consistencyScore: number; // 0-100, how consistent performance is

  // Predictive Analytics
  projectedFinalCGPA: number;
  graduationProbability: number; // 0-1
  honorsEligibility: boolean;
  scholarshipEligibility: boolean;

  // Study Patterns
  averageStudyHours: number;
  peakPerformanceSemesters: string[];
  lowPerformanceSemesters: string[];

  // Attendance Patterns
  overallAttendance: number;
  attendanceTrend: "improving" | "declining" | "stable";
}

export interface ComparisonMetrics {
  // Compare with previous semesters
  semesterComparison: {
    currentSemester: string;
    previousSemester: string;
    cgpaChange: number;
    sgpaChange: number;
    creditsChange: number;
    performanceChange: "improved" | "declined" | "same";
  };

  // Compare with batch average
  batchComparison: {
    studentCGPA: number;
    batchAverageCGPA: number;
    positionInBatch: number;
    totalStudents: number;
    subjectsAboveAverage: number;
    subjectsBelowAverage: number;
  };

  // Compare yearly performance
  yearlyComparison: {
    year: number;
    yearGPA: number;
    previousYearGPA?: number;
    improvement: number;
    bestYear: boolean;
    worstYear: boolean;
  }[];
}

export interface CareerGuidance {
  // Based on 4-year performance
  recommendedCareerPaths: {
    path: string;
    eligibilityCriteria: string;
    currentEligibility: boolean;
    requiredCGPA: number;
    additionalRequirements: string[];
  }[];

  // Higher education options
  higherEducationOptions: {
    course: string;
    eligibleUniversities: string[];
    minimumCGPA: number;
    competitiveAdvantage: string;
  }[];

  // Skill development recommendations
  skillRecommendations: {
    skill: string;
    priority: "high" | "medium" | "low";
    reasoning: string;
    resources: string[];
  }[];
}

export interface AcademicMilestones {
  milestones: {
    id: string;
    title: string;
    description: string;
    achievedDate?: Date;
    semester: string;
    category: "academic" | "extracurricular" | "personal";
    impact: string;
  }[];

  upcomingMilestones: {
    title: string;
    targetDate: Date;
    requirements: string[];
    currentProgress: number; // 0-100
  }[];
}

export interface FourYearPlan {
  studentId: string;
  degree: string;
  specialization?: string;
  expectedGraduation: Date;

  // Planned academic trajectory
  yearlyPlans: {
    year: number;
    targetGPA: number;
    majorSubjects: string[];
    electiveSubjects: string[];
    goals: string[];
    challenges: string[];
    strategies: string[];
  }[];

  // Career preparation timeline
  careerPreparation: {
    year: number;
    activities: string[];
    internships: string[];
    projects: string[];
    certifications: string[];
  }[];
}

// Historical data for trends and analytics
export interface HistoricalPerformance {
  studentId: string;
  recordDate: Date;

  // Snapshot of performance at this point
  cgpaAtTime: number;
  creditsAtTime: number;
  semesterAtTime: string;

  // Subjects being studied at this time
  activeSubjects: string[];

  // Key metrics at this point
  attendanceAtTime: number;
  studyHoursPerWeek: number;

  // Events that might have influenced performance
  significantEvents: {
    event: string;
    impact: "positive" | "negative" | "neutral";
    description: string;
  }[];
}

export interface PerformanceGoals {
  // Short-term goals (current semester)
  currentSemesterGoals: {
    targetSGPA: number;
    targetAttendance: number;
    subjectSpecificGoals: {
      subject: string;
      targetGrade: string;
      targetMarks: number;
    }[];
  };

  // Medium-term goals (current year)
  currentYearGoals: {
    targetYearGPA: number;
    majorAchievements: string[];
    skillsToAcquire: string[];
  };

  // Long-term goals (4-year degree)
  degreeGoals: {
    targetFinalCGPA: number;
    careerObjective: string;
    majorProjects: string[];
    networkingGoals: string[];
    preparationForFuture: string[];
  };
}
