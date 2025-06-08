import {
  StudyPlan,
  DailyStudyPlan,
  StudySession,
  Exam,
  SyllabusModule,
  StudyPattern,
  AcademicProfile,
  AIRecommendation,
} from "@/types/syllabus";
import { addDays, differenceInDays, format, startOfDay } from "date-fns";

export class AIStudyPlanGenerator {
  static generateStudyPlan(
    modules: SyllabusModule[],
    exam: Exam,
    studyPattern: StudyPattern,
    academicProfile: AcademicProfile,
  ): StudyPlan {
    const startDate = new Date();
    const endDate = new Date(exam.date);
    const daysAvailable = differenceInDays(endDate, startDate) - 1; // Leave one day for final review

    const totalHours = modules.reduce(
      (sum, module) => sum + module.estimatedHours,
      0,
    );
    const adjustedHours = this.adjustHoursForDifficulty(
      totalHours,
      modules,
      academicProfile,
    );

    const dailyPlans = this.generateDailyPlans(
      modules,
      startDate,
      endDate,
      adjustedHours,
      studyPattern,
      academicProfile,
    );

    return {
      id: crypto.randomUUID(),
      name: `Study Plan for ${exam.name}`,
      subject: exam.subject,
      examId: exam.id,
      startDate,
      endDate,
      totalHours: adjustedHours,
      dailyPlans,
      adaptiveFactors: {
        difficultyAdjustment: this.calculateDifficultyAdjustment(
          modules,
          academicProfile,
        ),
        timeBufferPercentage: this.calculateTimeBuffer(
          studyPattern,
          academicProfile,
        ),
        revisionCycles: this.calculateRevisionCycles(exam, academicProfile),
      },
      generatedAt: new Date(),
      lastAdjusted: new Date(),
    };
  }

  private static adjustHoursForDifficulty(
    baseHours: number,
    modules: SyllabusModule[],
    profile: AcademicProfile,
  ): number {
    const averageDifficulty =
      modules.reduce((sum, m) => sum + m.difficulty, 0) / modules.length;
    const profileDifficultyMultiplier =
      profile.currentCGPA >= 3.5 ? 0.9 : profile.currentCGPA >= 3.0 ? 1.0 : 1.2;

    return Math.ceil(
      baseHours * (averageDifficulty / 3) * profileDifficultyMultiplier,
    );
  }

  private static generateDailyPlans(
    modules: SyllabusModule[],
    startDate: Date,
    endDate: Date,
    totalHours: number,
    pattern: StudyPattern,
    profile: AcademicProfile,
  ): DailyStudyPlan[] {
    const days = differenceInDays(endDate, startDate);
    const dailyPlans: DailyStudyPlan[] = [];

    // Calculate daily study hours based on pattern
    const averageDailyHours = Math.min(
      totalHours / days,
      (pattern.averageSessionDuration / 60) * 2,
    );

    // Distribute modules across days using AI logic
    const moduleSchedule = this.distributeModulesAcrossDays(
      modules,
      days,
      pattern,
      profile,
    );

    for (let i = 0; i < days; i++) {
      const currentDate = addDays(startDate, i);
      const dayModules = moduleSchedule[i] || [];

      if (dayModules.length > 0) {
        const sessions = this.generateStudySessions(
          dayModules,
          currentDate,
          pattern,
          averageDailyHours,
        );

        dailyPlans.push({
          date: currentDate,
          modules: dayModules.map((m) => m.id),
          estimatedHours: sessions.reduce((sum, s) => {
            const start = new Date(`2000-01-01 ${s.startTime}`);
            const end = new Date(`2000-01-01 ${s.endTime}`);
            return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          }, 0),
          sessions,
          completed: false,
        });
      }
    }

    return dailyPlans;
  }

  private static distributeModulesAcrossDays(
    modules: SyllabusModule[],
    days: number,
    pattern: StudyPattern,
    profile: AcademicProfile,
  ): SyllabusModule[][] {
    const distribution: SyllabusModule[][] = Array(days)
      .fill(null)
      .map(() => []);

    // Sort modules by priority and difficulty
    const sortedModules = [...modules].sort((a, b) => {
      if (pattern.difficultyPreference === "hard-first") {
        return b.difficulty - a.difficulty;
      } else if (pattern.difficultyPreference === "easy-first") {
        return a.difficulty - b.difficulty;
      }
      return 0; // mixed
    });

    // Distribute modules ensuring optimal spacing and revision cycles
    let currentDay = 0;
    sortedModules.forEach((module, index) => {
      // Primary learning session
      distribution[currentDay].push(module);

      // Schedule revision sessions
      const revisionDays = this.calculateRevisionSchedule(
        currentDay,
        days,
        module.difficulty,
      );
      revisionDays.forEach((day) => {
        if (day < days && !distribution[day].includes(module)) {
          distribution[day].push(module);
        }
      });

      currentDay = (currentDay + 1) % Math.min(days, 7); // Cycle through week
    });

    return distribution;
  }

  private static calculateRevisionSchedule(
    startDay: number,
    totalDays: number,
    difficulty: number,
  ): number[] {
    // Spaced repetition algorithm
    const revisionDays: number[] = [];

    // First revision: 1-2 days after initial learning
    let nextRevision = startDay + (difficulty >= 4 ? 1 : 2);
    if (nextRevision < totalDays) revisionDays.push(nextRevision);

    // Second revision: 3-5 days after first revision
    nextRevision = nextRevision + (difficulty >= 4 ? 3 : 5);
    if (nextRevision < totalDays) revisionDays.push(nextRevision);

    // Final revision: 2-3 days before exam
    const finalRevision = totalDays - (difficulty >= 4 ? 2 : 3);
    if (finalRevision > nextRevision && finalRevision >= 0) {
      revisionDays.push(finalRevision);
    }

    return revisionDays;
  }

  private static generateStudySessions(
    modules: SyllabusModule[],
    date: Date,
    pattern: StudyPattern,
    targetHours: number,
  ): StudySession[] {
    const sessions: StudySession[] = [];
    const productiveSlots = pattern.productiveTimeSlots;

    let remainingHours = targetHours;
    let slotIndex = 0;

    modules.forEach((module) => {
      if (remainingHours <= 0 || slotIndex >= productiveSlots.length) return;

      const slot = productiveSlots[slotIndex];
      const [startTime, endTime] = slot.split("-");

      // Calculate session duration based on module difficulty and remaining time
      const maxSessionTime = Math.min(
        remainingHours,
        pattern.averageSessionDuration / 60,
        module.difficulty >= 4 ? 1.5 : 2.0, // Shorter sessions for difficult topics
      );

      const sessionStartTime = startTime;
      const sessionEnd = new Date(`2000-01-01 ${startTime}`);
      sessionEnd.setHours(sessionEnd.getHours() + Math.floor(maxSessionTime));
      sessionEnd.setMinutes(
        sessionEnd.getMinutes() + (maxSessionTime % 1) * 60,
      );

      const sessionEndTime = format(sessionEnd, "HH:mm");

      sessions.push({
        id: crypto.randomUUID(),
        moduleId: module.id,
        startTime: sessionStartTime,
        endTime: sessionEndTime,
        topics: module.topics.slice(0, Math.ceil(module.topics.length / 3)), // Focus on subset
        type: module.progress === 0 ? "learning" : "revision",
        materials: this.suggestMaterials(module),
        completed: false,
      });

      remainingHours -= maxSessionTime;
      slotIndex++;
    });

    return sessions;
  }

  private static suggestMaterials(module: SyllabusModule): string[] {
    // AI-powered material suggestions based on module content
    const materials = ["Textbook readings", "Lecture notes"];

    if (module.difficulty >= 4) {
      materials.push("Practice problems", "Video tutorials");
    }

    if (
      module.name.toLowerCase().includes("calculus") ||
      module.name.toLowerCase().includes("algebra")
    ) {
      materials.push("Formula sheets", "Graphing tools");
    }

    return materials;
  }

  private static calculateDifficultyAdjustment(
    modules: SyllabusModule[],
    profile: AcademicProfile,
  ): number {
    const avgDifficulty =
      modules.reduce((sum, m) => sum + m.difficulty, 0) / modules.length;
    const cgpaFactor = profile.currentCGPA / 4.0;

    return Math.max(0.5, Math.min(2.0, avgDifficulty / 3 / cgpaFactor));
  }

  private static calculateTimeBuffer(
    pattern: StudyPattern,
    profile: AcademicProfile,
  ): number {
    // Higher buffer for procrastinators and lower CGPA students
    const procrastinationBuffer = pattern.procrastinationTendency * 0.3;
    const cgpaBuffer = (4.0 - profile.currentCGPA) * 0.1;

    return Math.min(0.5, procrastinationBuffer + cgpaBuffer + 0.1);
  }

  private static calculateRevisionCycles(
    exam: Exam,
    profile: AcademicProfile,
  ): number {
    // More revision cycles for important exams and struggling students
    const importanceFactor =
      exam.weightage >= 30 ? 3 : exam.weightage >= 20 ? 2 : 1;
    const cgpaFactor = profile.currentCGPA < 3.0 ? 1 : 0;

    return importanceFactor + cgpaFactor;
  }

  static generateRecommendations(
    studyPlan: StudyPlan,
    actualProgress: Record<string, number>,
    pattern: StudyPattern,
    profile: AcademicProfile,
  ): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];

    // Analyze progress vs plan
    const overallProgress =
      Object.values(actualProgress).reduce((sum, p) => sum + p, 0) /
      Object.keys(actualProgress).length;
    const expectedProgress = this.calculateExpectedProgress(studyPlan);

    if (overallProgress < expectedProgress * 0.8) {
      recommendations.push({
        id: crypto.randomUUID(),
        type: "study-plan",
        priority: "high",
        title: "Study Plan Adjustment Needed",
        description:
          "You're falling behind schedule. Consider adjusting your study plan.",
        actionItems: [
          "Increase daily study hours by 30%",
          "Focus on high-priority modules first",
          "Consider group study sessions",
        ],
        reasoning: "Current progress is significantly below expected timeline.",
        impact: "Improved exam preparation and reduced stress",
        createdAt: new Date(),
      });
    }

    // Time management recommendations
    if (pattern.procrastinationTendency > 0.7) {
      recommendations.push({
        id: crypto.randomUUID(),
        type: "time-management",
        priority: "medium",
        title: "Combat Procrastination",
        description: "Break down large tasks into smaller, manageable chunks.",
        actionItems: [
          "Use Pomodoro technique (25-min focused sessions)",
          "Set specific daily goals",
          "Remove distractions from study environment",
        ],
        reasoning: "High procrastination tendency detected in study patterns.",
        impact: "Better focus and consistent progress",
        createdAt: new Date(),
      });
    }

    // CGPA-based recommendations
    if (profile.currentCGPA < profile.targetCGPA) {
      const cgpaGap = profile.targetCGPA - profile.currentCGPA;
      recommendations.push({
        id: crypto.randomUUID(),
        type: "focus-area",
        priority: cgpaGap > 0.5 ? "high" : "medium",
        title: "CGPA Improvement Strategy",
        description: `Focus on improving performance to reach target CGPA of ${profile.targetCGPA}`,
        actionItems: [
          "Prioritize high-credit courses",
          "Seek additional help for weak subjects",
          "Maintain consistent study schedule",
        ],
        reasoning: `Current CGPA (${profile.currentCGPA}) is ${cgpaGap.toFixed(1)} points below target.`,
        impact: "Gradual CGPA improvement and better academic standing",
        createdAt: new Date(),
      });
    }

    return recommendations;
  }

  private static calculateExpectedProgress(studyPlan: StudyPlan): number {
    const today = new Date();
    const totalDays = differenceInDays(studyPlan.endDate, studyPlan.startDate);
    const daysPassed = differenceInDays(today, studyPlan.startDate);

    return Math.max(0, Math.min(1, daysPassed / totalDays));
  }

  static adaptPlanBasedOnProgress(
    studyPlan: StudyPlan,
    actualProgress: Record<string, number>,
    pattern: StudyPattern,
  ): StudyPlan {
    // AI-powered plan adaptation based on actual performance
    const updatedDailyPlans = studyPlan.dailyPlans.map((dailyPlan) => {
      const moduleProgress = dailyPlan.modules.map(
        (moduleId) => actualProgress[moduleId] || 0,
      );
      const avgProgress =
        moduleProgress.reduce((sum, p) => sum + p, 0) / moduleProgress.length;

      // Adjust future sessions based on progress
      if (avgProgress < 0.5 && new Date(dailyPlan.date) > new Date()) {
        // Add more time for struggling modules
        const adjustedSessions = dailyPlan.sessions.map((session) => {
          const moduleProgress = actualProgress[session.moduleId] || 0;
          if (moduleProgress < 0.3) {
            // Extend session time for struggling modules
            const startTime = new Date(`2000-01-01 ${session.startTime}`);
            const endTime = new Date(`2000-01-01 ${session.endTime}`);
            endTime.setMinutes(endTime.getMinutes() + 30); // Add 30 minutes

            return {
              ...session,
              endTime: format(endTime, "HH:mm"),
              type: "revision" as const,
            };
          }
          return session;
        });

        return {
          ...dailyPlan,
          sessions: adjustedSessions,
        };
      }

      return dailyPlan;
    });

    return {
      ...studyPlan,
      dailyPlans: updatedDailyPlans,
      lastAdjusted: new Date(),
    };
  }
}
