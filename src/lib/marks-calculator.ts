import {
  Subject,
  InternalAssessment,
  ExternalExam,
  MarksBreakdown,
  CGPACalculation,
  INDIAN_GRADE_SCHEMA,
  GradeSchema,
  PerformancePrediction,
  AcademicRecord,
} from "@/types/marks";

export class MarksCalculator {
  static calculateInternalMarks(
    subject: Subject,
    assessments: InternalAssessment[],
  ): MarksBreakdown["internal"] {
    const subjectAssessments = assessments.filter(
      (a) => a.subjectId === subject.id && a.completed,
    );

    const breakdown = {
      assignments: { obtained: 0, total: 0 },
      quizzes: { obtained: 0, total: 0 },
      labs: { obtained: 0, total: 0 },
      midterm: { obtained: 0, total: 0 },
      attendance: { obtained: 0, total: 0 },
      projects: { obtained: 0, total: 0 },
    };

    let totalObtained = 0;
    let totalPossible = 0;

    subjectAssessments.forEach((assessment) => {
      const obtained = assessment.obtainedMarks || 0;
      const total = assessment.maxMarks;

      switch (assessment.type) {
        case "assignment":
          breakdown.assignments.obtained += obtained;
          breakdown.assignments.total += total;
          break;
        case "quiz":
          breakdown.quizzes.obtained += obtained;
          breakdown.quizzes.total += total;
          break;
        case "lab":
          breakdown.labs.obtained += obtained;
          breakdown.labs.total += total;
          break;
        case "midterm":
          breakdown.midterm.obtained += obtained;
          breakdown.midterm.total += total;
          break;
        case "attendance":
          breakdown.attendance.obtained += obtained;
          breakdown.attendance.total += total;
          break;
        case "project":
          breakdown.projects.obtained += obtained;
          breakdown.projects.total += total;
          break;
      }

      totalObtained += obtained;
      totalPossible += total;
    });

    const percentage =
      totalPossible > 0 ? (totalObtained / totalPossible) * 100 : 0;

    return {
      totalPossible,
      totalObtained,
      percentage,
      breakdown,
    };
  }

  static calculateExternalMarks(
    subject: Subject,
    exams: ExternalExam[],
  ): MarksBreakdown["external"] {
    const subjectExams = exams.filter(
      (e) => e.subjectId === subject.id && e.completed,
    );

    const breakdown = {
      theory: { obtained: 0, total: 0 },
      practical: { obtained: 0, total: 0 },
      viva: { obtained: 0, total: 0 },
    };

    let totalObtained = 0;
    let totalPossible = 0;

    subjectExams.forEach((exam) => {
      const obtained = exam.obtainedMarks || 0;
      const total = exam.maxMarks;

      switch (exam.type) {
        case "theory":
          breakdown.theory.obtained += obtained;
          breakdown.theory.total += total;
          break;
        case "practical":
          breakdown.practical.obtained += obtained;
          breakdown.practical.total += total;
          break;
        case "viva":
          breakdown.viva.obtained += obtained;
          breakdown.viva.total += total;
          break;
      }

      totalObtained += obtained;
      totalPossible += total;
    });

    const percentage =
      totalPossible > 0 ? (totalObtained / totalPossible) * 100 : 0;

    return {
      totalPossible,
      totalObtained,
      percentage,
      breakdown,
    };
  }

  static calculateFinalMarks(
    subject: Subject,
    internal: MarksBreakdown["internal"],
    external: MarksBreakdown["external"],
  ): MarksBreakdown["final"] {
    // Calculate weighted marks
    const internalWeighted =
      (internal.percentage * subject.internalWeightage) / 100;
    const externalWeighted =
      (external.percentage * subject.externalWeightage) / 100;

    const finalPercentage = internalWeighted + externalWeighted;
    const obtainedMarks = (finalPercentage * subject.totalMarks) / 100;

    const grade = this.getGradeFromMarks(finalPercentage);
    const gradePoints = grade.gradePoints;
    const status = obtainedMarks >= subject.passingMarks ? "pass" : "fail";

    return {
      totalMarks: subject.totalMarks,
      obtainedMarks: Math.round(obtainedMarks * 100) / 100,
      percentage: Math.round(finalPercentage * 100) / 100,
      gradePoints,
      grade: grade.grade,
      status: status as "pass" | "fail" | "pending",
    };
  }

  static getGradeFromMarks(percentage: number): GradeSchema {
    return (
      INDIAN_GRADE_SCHEMA.find(
        (schema) =>
          percentage >= schema.minMarks && percentage <= schema.maxMarks,
      ) || INDIAN_GRADE_SCHEMA[INDIAN_GRADE_SCHEMA.length - 1]
    );
  }

  static calculateSGPA(
    subjects: Subject[],
    marksBreakdowns: MarksBreakdown[],
  ): number {
    let totalCredits = 0;
    let totalGradePoints = 0;

    subjects.forEach((subject) => {
      const breakdown = marksBreakdowns.find(
        (mb) => mb.subjectId === subject.id,
      );
      if (breakdown && breakdown.final.status !== "pending") {
        totalCredits += subject.credits;
        totalGradePoints += breakdown.final.gradePoints * subject.credits;
      }
    });

    return totalCredits > 0
      ? Math.round((totalGradePoints / totalCredits) * 100) / 100
      : 0;
  }

  static calculateCGPA(semesterRecords: CGPACalculation[]): number {
    let totalCredits = 0;
    let totalGradePoints = 0;

    semesterRecords.forEach((semester) => {
      semester.subjects.forEach((subject) => {
        totalCredits += subject.credits;
        totalGradePoints += subject.gradePoints * subject.credits;
      });
    });

    return totalCredits > 0
      ? Math.round((totalGradePoints / totalCredits) * 100) / 100
      : 0;
  }

  static predictPerformance(
    subject: Subject,
    currentInternal: MarksBreakdown["internal"],
    historicalData?: MarksBreakdown[],
  ): PerformancePrediction {
    // Simple prediction based on current internal performance
    const currentInternalPercent = currentInternal.percentage;

    // Assume external performance correlates with internal (with some variance)
    const predictedExternal = Math.max(
      0,
      Math.min(
        100,
        currentInternalPercent + (Math.random() * 20 - 10), // ±10% variance
      ),
    );

    const internalWeighted =
      (currentInternalPercent * subject.internalWeightage) / 100;
    const externalWeighted =
      (predictedExternal * subject.externalWeightage) / 100;
    const predictedFinalMarks = internalWeighted + externalWeighted;

    const predictedGrade = this.getGradeFromMarks(predictedFinalMarks);

    // Calculate required marks for different grades
    const requiredForA = Math.max(
      0,
      (90 - internalWeighted) * (100 / subject.externalWeightage),
    );
    const requiredForBPlus = Math.max(
      0,
      (80 - internalWeighted) * (100 / subject.externalWeightage),
    );
    const requiredForB = Math.max(
      0,
      (70 - internalWeighted) * (100 / subject.externalWeightage),
    );

    const improvementSuggestions = this.generateImprovementSuggestions(
      currentInternalPercent,
      predictedFinalMarks,
      subject,
    );

    return {
      subjectId: subject.id,
      currentPerformance: currentInternalPercent,
      predictedFinalMarks: Math.round(predictedFinalMarks * 100) / 100,
      predictedGrade: predictedGrade.grade,
      confidenceLevel: Math.max(
        60,
        Math.min(95, 80 + (currentInternalPercent - 70) * 0.5),
      ),
      improvementSuggestions,
      requiredMarksForTarget: {
        gradeA: Math.round(requiredForA),
        gradeBPlus: Math.round(requiredForBPlus),
        gradeB: Math.round(requiredForB),
      },
    };
  }

  private static generateImprovementSuggestions(
    currentInternal: number,
    predictedFinal: number,
    subject: Subject,
  ): string[] {
    const suggestions: string[] = [];

    if (currentInternal < 70) {
      suggestions.push(
        "Focus on completing all assignments and attending all classes",
      );
      suggestions.push("Seek help from instructors during office hours");
      suggestions.push("Form study groups with classmates");
    }

    if (predictedFinal < 60) {
      suggestions.push("Dedicate extra 2-3 hours daily for this subject");
      suggestions.push("Practice previous year question papers");
      suggestions.push("Consider getting a tutor for additional support");
    }

    if (currentInternal >= 70 && predictedFinal >= 70) {
      suggestions.push("Maintain current study routine");
      suggestions.push("Focus on advanced topics for external exam");
      suggestions.push("Help weaker students to reinforce your understanding");
    }

    return suggestions;
  }

  static generateMarksBreakdown(
    subject: Subject,
    assessments: InternalAssessment[],
    exams: ExternalExam[],
  ): MarksBreakdown {
    const internal = this.calculateInternalMarks(subject, assessments);
    const external = this.calculateExternalMarks(subject, exams);
    const final = this.calculateFinalMarks(subject, internal, external);

    return {
      subjectId: subject.id,
      subjectName: subject.name,
      internal,
      external,
      final,
    };
  }

  static calculateTargetMarks(
    currentCGPA: number,
    targetCGPA: number,
    remainingSubjects: Subject[],
    completedCredits: number,
  ): { requiredSGPA: number; difficultyLevel: string } {
    const totalRemainingCredits = remainingSubjects.reduce(
      (sum, s) => sum + s.credits,
      0,
    );
    const totalCredits = completedCredits + totalRemainingCredits;

    const requiredTotalGradePoints = targetCGPA * totalCredits;
    const currentTotalGradePoints = currentCGPA * completedCredits;
    const requiredRemainingGradePoints =
      requiredTotalGradePoints - currentTotalGradePoints;

    const requiredSGPA =
      totalRemainingCredits > 0
        ? requiredRemainingGradePoints / totalRemainingCredits
        : 0;

    let difficultyLevel = "";
    if (requiredSGPA <= 7) difficultyLevel = "Easy";
    else if (requiredSGPA <= 8) difficultyLevel = "Moderate";
    else if (requiredSGPA <= 9) difficultyLevel = "Challenging";
    else difficultyLevel = "Very Difficult";

    return {
      requiredSGPA: Math.round(requiredSGPA * 100) / 100,
      difficultyLevel,
    };
  }

  static getAttendanceImpact(attendancePercentage: number): {
    impactOnInternalMarks: number;
    recommendations: string[];
  } {
    let impact = 0;
    const recommendations: string[] = [];

    if (attendancePercentage < 75) {
      impact = -5; // 5% reduction in internal marks
      recommendations.push(
        "Attendance below 75% - you may not be eligible for exams",
      );
      recommendations.push("Contact academic office immediately");
      recommendations.push("Submit medical certificates if applicable");
    } else if (attendancePercentage < 85) {
      impact = -2; // 2% reduction
      recommendations.push("Improve attendance to secure full internal marks");
      recommendations.push("Avoid unnecessary absences");
    } else if (attendancePercentage >= 95) {
      impact = 2; // 2% bonus
      recommendations.push("Excellent attendance! You may get bonus marks");
    }

    return {
      impactOnInternalMarks: impact,
      recommendations,
    };
  }
}
