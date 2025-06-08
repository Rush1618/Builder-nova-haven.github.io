import {
  AcademicYear,
  Semester,
  SemesterSubject,
  AcademicProgressAnalytics,
  ComparisonMetrics,
  HistoricalPerformance,
  CareerGuidance,
  FourYearPlan,
} from "@/types/academic-history";

export class FourYearAcademicTracker {
  private static instance: FourYearAcademicTracker;
  private readonly STORAGE_KEY = "four-year-academic-data";

  static getInstance(): FourYearAcademicTracker {
    if (!FourYearAcademicTracker.instance) {
      FourYearAcademicTracker.instance = new FourYearAcademicTracker();
    }
    return FourYearAcademicTracker.instance;
  }

  // Initialize 4-year academic structure
  initializeAcademicStructure(startYear: number): AcademicYear[] {
    const academicYears: AcademicYear[] = [];

    for (let year = 1; year <= 4; year++) {
      const academicYear: AcademicYear = {
        year,
        startDate: new Date(startYear + year - 1, 7, 1), // August 1st
        endDate: new Date(startYear + year, 6, 30), // July 30th
        semesters: this.createSemestersForYear(year, startYear),
        yearGPA: 0,
        totalCredits: year <= 2 ? 50 : 54, // Typical credit distribution
        completedCredits: 0,
        status: year === 1 ? "current" : "upcoming",
      };
      academicYears.push(academicYear);
    }

    return academicYears;
  }

  private createSemestersForYear(year: number, startYear: number): Semester[] {
    const semesters: Semester[] = [];

    // Odd Semester (Aug-Dec)
    const oddSemester: Semester = {
      id: `${year}-1`,
      year,
      semester: 1,
      name: `Year ${year} - Semester ${(year - 1) * 2 + 1}`,
      startDate: new Date(startYear + year - 1, 7, 1),
      endDate: new Date(startYear + year - 1, 11, 31),
      subjects: this.getSubjectsForSemester(year, 1),
      sgpa: 0,
      totalCredits: year <= 2 ? 25 : 27,
      earnedCredits: 0,
      status: "upcoming",
      attendancePercentage: 0,
    };

    // Even Semester (Jan-May)
    const evenSemester: Semester = {
      id: `${year}-2`,
      year,
      semester: 2,
      name: `Year ${year} - Semester ${(year - 1) * 2 + 2}`,
      startDate: new Date(startYear + year, 0, 1),
      endDate: new Date(startYear + year, 4, 31),
      subjects: this.getSubjectsForSemester(year, 2),
      sgpa: 0,
      totalCredits: year <= 2 ? 25 : 27,
      earnedCredits: 0,
      status: "upcoming",
      attendancePercentage: 0,
    };

    return [oddSemester, evenSemester];
  }

  private getSubjectsForSemester(
    year: number,
    semester: number,
  ): SemesterSubject[] {
    // Define curriculum structure - this would come from your actual syllabus
    const curriculumMap: Record<
      string,
      { code: string; name: string; credits: number; instructor: string }[]
    > = {
      "1-1": [
        {
          code: "MATH101",
          name: "Engineering Mathematics I",
          credits: 4,
          instructor: "Dr. Sharma",
        },
        {
          code: "PHY101",
          name: "Engineering Physics",
          credits: 3,
          instructor: "Prof. Kumar",
        },
        {
          code: "CHEM101",
          name: "Engineering Chemistry",
          credits: 3,
          instructor: "Dr. Patel",
        },
        {
          code: "CS101",
          name: "Programming Fundamentals",
          credits: 4,
          instructor: "Prof. Singh",
        },
        {
          code: "ENG101",
          name: "Communication Skills",
          credits: 2,
          instructor: "Dr. Verma",
        },
        {
          code: "ME101",
          name: "Engineering Drawing",
          credits: 3,
          instructor: "Prof. Gupta",
        },
        {
          code: "LAB101",
          name: "Physics Lab",
          credits: 1,
          instructor: "Dr. Jain",
        },
        {
          code: "LAB102",
          name: "Chemistry Lab",
          credits: 1,
          instructor: "Prof. Rao",
        },
        {
          code: "LAB103",
          name: "Programming Lab",
          credits: 2,
          instructor: "Dr. Agarwal",
        },
        {
          code: "LAB104",
          name: "Engineering Drawing Lab",
          credits: 2,
          instructor: "Prof. Mishra",
        },
      ],
      "1-2": [
        {
          code: "MATH102",
          name: "Engineering Mathematics II",
          credits: 4,
          instructor: "Dr. Sharma",
        },
        {
          code: "PHY102",
          name: "Applied Physics",
          credits: 3,
          instructor: "Prof. Kumar",
        },
        {
          code: "CS102",
          name: "Data Structures",
          credits: 4,
          instructor: "Prof. Singh",
        },
        {
          code: "EE101",
          name: "Basic Electrical Engineering",
          credits: 3,
          instructor: "Dr. Reddy",
        },
        {
          code: "ME102",
          name: "Engineering Mechanics",
          credits: 3,
          instructor: "Prof. Gupta",
        },
        {
          code: "ENV101",
          name: "Environmental Science",
          credits: 2,
          instructor: "Dr. Das",
        },
        {
          code: "LAB105",
          name: "Applied Physics Lab",
          credits: 1,
          instructor: "Dr. Jain",
        },
        {
          code: "LAB106",
          name: "Data Structures Lab",
          credits: 2,
          instructor: "Dr. Agarwal",
        },
        {
          code: "LAB107",
          name: "Electrical Lab",
          credits: 1,
          instructor: "Prof. Rao",
        },
        {
          code: "LAB108",
          name: "Workshop Practice",
          credits: 2,
          instructor: "Prof. Mishra",
        },
      ],
      "2-1": [
        {
          code: "MATH201",
          name: "Engineering Mathematics III",
          credits: 4,
          instructor: "Dr. Sharma",
        },
        {
          code: "CS201",
          name: "Computer Organization",
          credits: 4,
          instructor: "Prof. Singh",
        },
        {
          code: "CS202",
          name: "Object Oriented Programming",
          credits: 3,
          instructor: "Dr. Agarwal",
        },
        {
          code: "CS203",
          name: "Discrete Mathematics",
          credits: 3,
          instructor: "Prof. Verma",
        },
        {
          code: "EE201",
          name: "Digital Electronics",
          credits: 3,
          instructor: "Dr. Reddy",
        },
        {
          code: "MGMT201",
          name: "Engineering Economics",
          credits: 2,
          instructor: "Prof. Jain",
        },
        {
          code: "LAB201",
          name: "OOP Lab",
          credits: 2,
          instructor: "Dr. Singh",
        },
        {
          code: "LAB202",
          name: "Digital Electronics Lab",
          credits: 2,
          instructor: "Prof. Kumar",
        },
        {
          code: "LAB203",
          name: "Computer Organization Lab",
          credits: 2,
          instructor: "Dr. Gupta",
        },
      ],
      "2-2": [
        {
          code: "MATH202",
          name: "Probability and Statistics",
          credits: 4,
          instructor: "Dr. Patel",
        },
        {
          code: "CS204",
          name: "Algorithms",
          credits: 4,
          instructor: "Prof. Singh",
        },
        {
          code: "CS205",
          name: "Database Systems",
          credits: 3,
          instructor: "Dr. Agarwal",
        },
        {
          code: "CS206",
          name: "Operating Systems",
          credits: 3,
          instructor: "Prof. Verma",
        },
        {
          code: "CS207",
          name: "Software Engineering",
          credits: 3,
          instructor: "Dr. Kumar",
        },
        {
          code: "HUM201",
          name: "Technical Communication",
          credits: 2,
          instructor: "Prof. Das",
        },
        {
          code: "LAB204",
          name: "Algorithms Lab",
          credits: 2,
          instructor: "Dr. Singh",
        },
        {
          code: "LAB205",
          name: "Database Lab",
          credits: 2,
          instructor: "Prof. Jain",
        },
        { code: "LAB206", name: "OS Lab", credits: 2, instructor: "Dr. Reddy" },
      ],
      "3-1": [
        {
          code: "CS301",
          name: "Computer Networks",
          credits: 4,
          instructor: "Prof. Singh",
        },
        {
          code: "CS302",
          name: "Theory of Computation",
          credits: 3,
          instructor: "Dr. Verma",
        },
        {
          code: "CS303",
          name: "Compiler Design",
          credits: 4,
          instructor: "Prof. Kumar",
        },
        {
          code: "CS304",
          name: "Machine Learning",
          credits: 4,
          instructor: "Dr. Agarwal",
        },
        {
          code: "ELEC301",
          name: "Technical Elective I",
          credits: 3,
          instructor: "Prof. Patel",
        },
        {
          code: "MGMT301",
          name: "Engineering Management",
          credits: 2,
          instructor: "Dr. Das",
        },
        {
          code: "LAB301",
          name: "Networks Lab",
          credits: 2,
          instructor: "Dr. Singh",
        },
        {
          code: "LAB302",
          name: "Compiler Lab",
          credits: 2,
          instructor: "Prof. Jain",
        },
        { code: "LAB303", name: "ML Lab", credits: 3, instructor: "Dr. Gupta" },
      ],
      "3-2": [
        {
          code: "CS305",
          name: "Artificial Intelligence",
          credits: 4,
          instructor: "Dr. Agarwal",
        },
        {
          code: "CS306",
          name: "Web Technologies",
          credits: 3,
          instructor: "Prof. Singh",
        },
        {
          code: "CS307",
          name: "Information Security",
          credits: 3,
          instructor: "Dr. Kumar",
        },
        {
          code: "ELEC302",
          name: "Technical Elective II",
          credits: 3,
          instructor: "Prof. Verma",
        },
        {
          code: "ELEC303",
          name: "Technical Elective III",
          credits: 3,
          instructor: "Dr. Patel",
        },
        {
          code: "PROJ301",
          name: "Minor Project",
          credits: 4,
          instructor: "Prof. Das",
        },
        {
          code: "LAB304",
          name: "AI Lab",
          credits: 2,
          instructor: "Dr. Agarwal",
        },
        {
          code: "LAB305",
          name: "Web Tech Lab",
          credits: 2,
          instructor: "Prof. Singh",
        },
        {
          code: "LAB306",
          name: "Security Lab",
          credits: 3,
          instructor: "Dr. Kumar",
        },
      ],
      "4-1": [
        {
          code: "ELEC401",
          name: "Technical Elective IV",
          credits: 3,
          instructor: "Prof. Singh",
        },
        {
          code: "ELEC402",
          name: "Technical Elective V",
          credits: 3,
          instructor: "Dr. Kumar",
        },
        {
          code: "ELEC403",
          name: "Technical Elective VI",
          credits: 3,
          instructor: "Prof. Verma",
        },
        {
          code: "PROJ401",
          name: "Major Project I",
          credits: 6,
          instructor: "Dr. Agarwal",
        },
        {
          code: "TRAIN401",
          name: "Industrial Training",
          credits: 2,
          instructor: "Prof. Das",
        },
        {
          code: "SEM401",
          name: "Seminar",
          credits: 2,
          instructor: "Dr. Patel",
        },
        {
          code: "LAB401",
          name: "Project Lab I",
          credits: 4,
          instructor: "Prof. Jain",
        },
        {
          code: "LAB402",
          name: "Advanced Lab",
          credits: 4,
          instructor: "Dr. Gupta",
        },
      ],
      "4-2": [
        {
          code: "ELEC404",
          name: "Technical Elective VII",
          credits: 3,
          instructor: "Prof. Kumar",
        },
        {
          code: "ELEC405",
          name: "Technical Elective VIII",
          credits: 3,
          instructor: "Dr. Verma",
        },
        {
          code: "PROJ402",
          name: "Major Project II",
          credits: 8,
          instructor: "Dr. Agarwal",
        },
        {
          code: "INTERN401",
          name: "Internship",
          credits: 4,
          instructor: "Prof. Singh",
        },
        {
          code: "COMP401",
          name: "Comprehensive Viva",
          credits: 2,
          instructor: "Dr. Das",
        },
        {
          code: "LAB403",
          name: "Project Lab II",
          credits: 6,
          instructor: "Prof. Jain",
        },
        {
          code: "PLACE401",
          name: "Placement Preparation",
          credits: 1,
          instructor: "Dr. Patel",
        },
      ],
    };

    const key = `${year}-${semester}`;
    const subjects = curriculumMap[key] || [];

    return subjects.map((subject) => ({
      id: `${subject.code}-${year}-${semester}`,
      semesterId: `${year}-${semester}`,
      subjectCode: subject.code,
      subjectName: subject.name,
      credits: subject.credits,
      instructor: subject.instructor,

      internalAssessment: {
        totalMarks: 25,
        obtainedMarks: 0,
        breakdown: {
          assignments: [],
          quizzes: [],
          midterms: [],
          practicals: [],
          attendance: {
            totalClasses: 60,
            attendedClasses: 0,
            percentage: 0,
            details: {
              lectures: { total: 40, attended: 0 },
              practicals: { total: 15, attended: 0 },
              tutorials: { total: 5, attended: 0 },
            },
          },
          projects: [],
        },
      },

      externalAssessment: {
        totalMarks: 75,
        obtainedMarks: 0,
        examDate: new Date(),
        duration: 180,
        syllabusTopics: [],
        questionPaperPattern: "5 questions, attempt any 4",
      },

      finalMarks: 0,
      finalGrade: "",
      gradePoints: 0,
      passed: false,

      improvement: 0,
      timeSpentStudying: 0,
      difficulty: 3,
    }));
  }

  // Calculate comprehensive analytics
  calculateProgressAnalytics(
    academicYears: AcademicYear[],
  ): AcademicProgressAnalytics {
    const completedSemesters = academicYears
      .flatMap((year) => year.semesters)
      .filter((sem) => sem.status === "completed");

    const totalCredits = academicYears.reduce(
      (sum, year) => sum + year.totalCredits,
      0,
    );
    const completedCredits = academicYears.reduce(
      (sum, year) => sum + year.completedCredits,
      0,
    );

    // Calculate overall CGPA
    let totalGradePoints = 0;
    let totalCreditsForCGPA = 0;

    completedSemesters.forEach((semester) => {
      semester.subjects.forEach((subject) => {
        if (subject.passed) {
          totalGradePoints += subject.gradePoints * subject.credits;
          totalCreditsForCGPA += subject.credits;
        }
      });
    });

    const overallCGPA =
      totalCreditsForCGPA > 0 ? totalGradePoints / totalCreditsForCGPA : 0;

    // Year-wise performance
    const yearWiseGPA = academicYears
      .filter((year) => year.status === "completed")
      .map((year) => ({
        year: year.year,
        gpa: year.yearGPA,
        credits: year.completedCredits,
      }));

    // Semester-wise trends
    const semesterWiseGPA = completedSemesters.map((semester) => ({
      semester: semester.name,
      sgpa: semester.sgpa,
      cgpa: this.calculateCGPAUpToSemester(academicYears, semester.id),
    }));

    // Subject performance trends
    const subjectWiseTrends = this.analyzeSubjectTrends(academicYears);

    // Performance patterns
    const { strengths, weaknesses } =
      this.identifyStrengthsWeaknesses(academicYears);
    const consistencyScore = this.calculateConsistencyScore(academicYears);

    // Predictive analytics
    const projectedFinalCGPA = this.predictFinalCGPA(academicYears);

    return {
      studentId: "current-student",
      overallCGPA: Math.round(overallCGPA * 100) / 100,
      targetCGPA: 8.5, // This should be user-configurable
      totalCredits,
      completedCredits,
      yearWiseGPA,
      semesterWiseGPA,
      subjectWiseTrends,
      strengths,
      weaknesses,
      consistencyScore,
      projectedFinalCGPA,
      graduationProbability: overallCGPA >= 5.0 ? 0.95 : 0.7,
      honorsEligibility: overallCGPA >= 8.0,
      scholarshipEligibility: overallCGPA >= 7.5,
      averageStudyHours: 6, // This would be tracked separately
      peakPerformanceSemesters: this.identifyPeakSemesters(completedSemesters),
      lowPerformanceSemesters: this.identifyLowSemesters(completedSemesters),
      overallAttendance: this.calculateOverallAttendance(academicYears),
      attendanceTrend: "stable",
    };
  }

  private calculateCGPAUpToSemester(
    academicYears: AcademicYear[],
    semesterId: string,
  ): number {
    let totalGradePoints = 0;
    let totalCredits = 0;

    for (const year of academicYears) {
      for (const semester of year.semesters) {
        for (const subject of semester.subjects) {
          if (subject.passed) {
            totalGradePoints += subject.gradePoints * subject.credits;
            totalCredits += subject.credits;
          }
        }
        if (semester.id === semesterId) {
          return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
        }
      }
    }

    return 0;
  }

  private analyzeSubjectTrends(academicYears: AcademicYear[]) {
    const subjectMap = new Map<string, any[]>();

    academicYears.forEach((year) => {
      year.semesters.forEach((semester) => {
        semester.subjects.forEach((subject) => {
          const baseName = this.extractBaseSubjectName(subject.subjectName);
          if (!subjectMap.has(baseName)) {
            subjectMap.set(baseName, []);
          }
          subjectMap.get(baseName)!.push({
            semester: semester.name,
            grade: subject.finalGrade,
            gradePoints: subject.gradePoints,
          });
        });
      });
    });

    return Array.from(subjectMap.entries()).map(([subjectName, grades]) => {
      const validGrades = grades.filter((g) => g.gradePoints > 0);
      const averageGradePoints =
        validGrades.length > 0
          ? validGrades.reduce((sum, g) => sum + g.gradePoints, 0) /
            validGrades.length
          : 0;

      let improvement: "improving" | "declining" | "stable" = "stable";
      if (validGrades.length >= 2) {
        const recent = validGrades.slice(-2);
        if (recent[1].gradePoints > recent[0].gradePoints) {
          improvement = "improving";
        } else if (recent[1].gradePoints < recent[0].gradePoints) {
          improvement = "declining";
        }
      }

      return {
        subjectName,
        grades: validGrades,
        averageGradePoints: Math.round(averageGradePoints * 100) / 100,
        improvement,
      };
    });
  }

  private extractBaseSubjectName(fullName: string): string {
    // Extract base subject name (e.g., "Engineering Mathematics I" -> "Mathematics")
    if (fullName.includes("Mathematics")) return "Mathematics";
    if (fullName.includes("Physics")) return "Physics";
    if (fullName.includes("Chemistry")) return "Chemistry";
    if (fullName.includes("Programming") || fullName.includes("Computer"))
      return "Computer Science";
    if (fullName.includes("Electronics") || fullName.includes("Electrical"))
      return "Electronics";
    return fullName;
  }

  private identifyStrengthsWeaknesses(academicYears: AcademicYear[]) {
    const subjectPerformance = new Map<string, number[]>();

    academicYears.forEach((year) => {
      year.semesters.forEach((semester) => {
        semester.subjects.forEach((subject) => {
          if (subject.gradePoints > 0) {
            const baseName = this.extractBaseSubjectName(subject.subjectName);
            if (!subjectPerformance.has(baseName)) {
              subjectPerformance.set(baseName, []);
            }
            subjectPerformance.get(baseName)!.push(subject.gradePoints);
          }
        });
      });
    });

    const averages = Array.from(subjectPerformance.entries()).map(
      ([subject, grades]) => ({
        subject,
        average: grades.reduce((sum, grade) => sum + grade, 0) / grades.length,
      }),
    );

    averages.sort((a, b) => b.average - a.average);

    const strengths = averages
      .slice(0, Math.ceil(averages.length / 3))
      .map((item) => item.subject);
    const weaknesses = averages
      .slice(-Math.ceil(averages.length / 3))
      .map((item) => item.subject);

    return { strengths, weaknesses };
  }

  private calculateConsistencyScore(academicYears: AcademicYear[]): number {
    const sgpas = academicYears
      .flatMap((year) => year.semesters)
      .filter((sem) => sem.status === "completed")
      .map((sem) => sem.sgpa)
      .filter((sgpa) => sgpa > 0);

    if (sgpas.length < 2) return 100;

    const mean = sgpas.reduce((sum, sgpa) => sum + sgpa, 0) / sgpas.length;
    const variance =
      sgpas.reduce((sum, sgpa) => sum + Math.pow(sgpa - mean, 2), 0) /
      sgpas.length;
    const standardDeviation = Math.sqrt(variance);

    // Lower standard deviation = higher consistency
    // Scale to 0-100 where 100 is perfect consistency
    return Math.max(0, Math.min(100, 100 - standardDeviation * 20));
  }

  private predictFinalCGPA(academicYears: AcademicYear[]): number {
    const completedSemesters = academicYears
      .flatMap((year) => year.semesters)
      .filter((sem) => sem.status === "completed");

    if (completedSemesters.length === 0) return 0;

    // Simple trend-based prediction
    const recentSGPAs = completedSemesters.slice(-3).map((sem) => sem.sgpa);
    const averageRecent =
      recentSGPAs.reduce((sum, sgpa) => sum + sgpa, 0) / recentSGPAs.length;

    // Factor in current CGPA and recent trend
    const currentCGPA = this.calculateCurrentCGPA(academicYears);
    const trendFactor =
      recentSGPAs.length >= 2
        ? (recentSGPAs[recentSGPAs.length - 1] - recentSGPAs[0]) * 0.1
        : 0;

    return Math.max(0, Math.min(10, currentCGPA + trendFactor));
  }

  private calculateCurrentCGPA(academicYears: AcademicYear[]): number {
    let totalGradePoints = 0;
    let totalCredits = 0;

    academicYears.forEach((year) => {
      year.semesters.forEach((semester) => {
        if (semester.status === "completed") {
          semester.subjects.forEach((subject) => {
            if (subject.passed) {
              totalGradePoints += subject.gradePoints * subject.credits;
              totalCredits += subject.credits;
            }
          });
        }
      });
    });

    return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  }

  private identifyPeakSemesters(semesters: Semester[]): string[] {
    const sorted = [...semesters].sort((a, b) => b.sgpa - a.sgpa);
    return sorted.slice(0, 2).map((sem) => sem.name);
  }

  private identifyLowSemesters(semesters: Semester[]): string[] {
    const sorted = [...semesters].sort((a, b) => a.sgpa - b.sgpa);
    return sorted.slice(0, 2).map((sem) => sem.name);
  }

  private calculateOverallAttendance(academicYears: AcademicYear[]): number {
    let totalClasses = 0;
    let attendedClasses = 0;

    academicYears.forEach((year) => {
      year.semesters.forEach((semester) => {
        semester.subjects.forEach((subject) => {
          const attendance = subject.internalAssessment.breakdown.attendance;
          totalClasses += attendance.totalClasses;
          attendedClasses += attendance.attendedClasses;
        });
      });
    });

    return totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
  }

  // Generate career guidance based on 4-year performance
  generateCareerGuidance(analytics: AcademicProgressAnalytics): CareerGuidance {
    const cgpa = analytics.overallCGPA;

    const recommendedCareerPaths = [
      {
        path: "Software Engineering",
        eligibilityCriteria: "CGPA >= 6.5, Strong Programming Skills",
        currentEligibility: cgpa >= 6.5,
        requiredCGPA: 6.5,
        additionalRequirements: [
          "Portfolio of projects",
          "Industry internship",
          "Coding competition participation",
        ],
      },
      {
        path: "Data Science/AI",
        eligibilityCriteria: "CGPA >= 7.0, Strong Math/Stats",
        currentEligibility: cgpa >= 7.0,
        requiredCGPA: 7.0,
        additionalRequirements: [
          "Machine Learning projects",
          "Python/R proficiency",
          "Statistics background",
        ],
      },
      {
        path: "Product Management",
        eligibilityCriteria: "CGPA >= 7.5, Leadership Experience",
        currentEligibility: cgpa >= 7.5,
        requiredCGPA: 7.5,
        additionalRequirements: [
          "Leadership roles",
          "Business acumen",
          "Communication skills",
        ],
      },
      {
        path: "Research/PhD",
        eligibilityCriteria: "CGPA >= 8.0, Research Publications",
        currentEligibility: cgpa >= 8.0,
        requiredCGPA: 8.0,
        additionalRequirements: [
          "Research papers",
          "Faculty recommendations",
          "GRE/GATE scores",
        ],
      },
    ];

    const higherEducationOptions = [
      {
        course: "MS in Computer Science",
        eligibleUniversities:
          cgpa >= 8.0
            ? ["Top US Universities", "European Universities"]
            : cgpa >= 7.0
              ? ["Good US Universities", "Canadian Universities"]
              : ["State Universities", "Private Colleges"],
        minimumCGPA: 6.5,
        competitiveAdvantage:
          cgpa >= 8.0
            ? "Highly competitive"
            : cgpa >= 7.0
              ? "Competitive"
              : "Consider improving CGPA",
      },
      {
        course: "MBA",
        eligibleUniversities:
          cgpa >= 8.0
            ? ["IIMs", "Top B-Schools"]
            : cgpa >= 7.0
              ? ["Good B-Schools"]
              : ["Regional B-Schools"],
        minimumCGPA: 6.0,
        competitiveAdvantage: "Work experience recommended",
      },
    ];

    const skillRecommendations = [
      {
        skill: "Cloud Computing (AWS/Azure)",
        priority: "high" as const,
        reasoning: "High demand in industry",
        resources: [
          "AWS Certification",
          "Azure Fundamentals",
          "Hands-on projects",
        ],
      },
      {
        skill: "DevOps & CI/CD",
        priority: "medium" as const,
        reasoning: "Essential for software development",
        resources: ["Docker", "Kubernetes", "Jenkins", "Git workflows"],
      },
      {
        skill: "Data Analysis",
        priority: cgpa >= 7.0 ? ("high" as const) : ("medium" as const),
        reasoning: "Growing field with good opportunities",
        resources: ["Python/R", "SQL", "Tableau/PowerBI", "Statistics"],
      },
    ];

    return {
      recommendedCareerPaths,
      higherEducationOptions,
      skillRecommendations,
    };
  }

  // Save and load data
  saveAcademicData(academicYears: AcademicYear[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(academicYears));
  }

  loadAcademicData(): AcademicYear[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    // Initialize with default structure if no data
    return this.initializeAcademicStructure(2021); // Current batch year
  }

  // Export comprehensive report
  exportAcademicReport(academicYears: AcademicYear[]): string {
    const analytics = this.calculateProgressAnalytics(academicYears);
    const report = {
      studentData: {
        totalYears: 4,
        completedSemesters: academicYears
          .flatMap((y) => y.semesters)
          .filter((s) => s.status === "completed").length,
        overallCGPA: analytics.overallCGPA,
        totalCredits: analytics.totalCredits,
        completedCredits: analytics.completedCredits,
      },
      yearWisePerformance: analytics.yearWiseGPA,
      semesterWisePerformance: analytics.semesterWiseGPA,
      subjectTrends: analytics.subjectWiseTrends,
      strengthsAndWeaknesses: {
        strengths: analytics.strengths,
        weaknesses: analytics.weaknesses,
      },
      academicYears,
      generatedAt: new Date().toISOString(),
    };

    return JSON.stringify(report, null, 2);
  }
}

// Export singleton instance
export const fourYearTracker = FourYearAcademicTracker.getInstance();
