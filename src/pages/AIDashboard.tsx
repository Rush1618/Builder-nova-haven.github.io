import React, { useState, useEffect } from "react";
import PlannerLayout from "@/components/planner/PlannerLayout";
import SyllabusUpload from "@/components/planner/SyllabusUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { storage } from "@/lib/storage";
import { AIStudyPlanGenerator } from "@/lib/ai-planner";
import {
  ParsedSyllabus,
  SyllabusModule,
  Exam,
  StudyPlan,
  AcademicProfile,
  StudyPattern,
  AIRecommendation,
} from "@/types/syllabus";
import {
  Brain,
  Calendar,
  Target,
  TrendingUp,
  BookOpen,
  Clock,
  Plus,
  Upload,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Zap,
} from "lucide-react";
import { format, addDays } from "date-fns";

export default function AIDashboard() {
  const [syllabi, setSyllabi] = useState<ParsedSyllabus[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [academicProfile, setAcademicProfile] = useState<AcademicProfile>({
    id: "1",
    currentCGPA: 3.2,
    targetCGPA: 3.8,
    semester: 5,
    year: 3,
    major: "Computer Science",
    subjects: [],
    examHistory: [],
    studyGoals: [],
  });
  const [studyPattern, setStudyPattern] = useState<StudyPattern>({
    id: "1",
    userId: "1",
    preferredStudyHours: [9, 10, 11, 14, 15, 16, 20, 21],
    averageSessionDuration: 90,
    productiveTimeSlots: ["09:00-11:30", "14:00-16:30", "20:00-22:00"],
    breakFrequency: 25,
    difficultyPreference: "mixed",
    retentionRate: 0.75,
    procrastinationTendency: 0.4,
    strongSubjects: ["Programming", "Mathematics"],
    weakSubjects: ["Physics"],
    learningStyle: "visual",
    lastUpdated: new Date(),
  });
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(
    [],
  );
  const [isExamDialogOpen, setIsExamDialogOpen] = useState(false);
  const [newExam, setNewExam] = useState({
    name: "",
    subject: "",
    date: "",
    duration: "",
    totalMarks: "",
    weightage: "",
    type: "midterm" as Exam["type"],
  });

  useEffect(() => {
    loadData();
    generateInitialRecommendations();
  }, []);

  const loadData = () => {
    // Load persisted data (in real app, this would come from backend)
    const savedSyllabi = localStorage.getItem("ai-syllabi");
    if (savedSyllabi) {
      setSyllabi(JSON.parse(savedSyllabi));
    }

    const savedExams = localStorage.getItem("ai-exams");
    if (savedExams) {
      setExams(JSON.parse(savedExams));
    }

    const savedPlans = localStorage.getItem("ai-study-plans");
    if (savedPlans) {
      setStudyPlans(JSON.parse(savedPlans));
    }
  };

  const generateInitialRecommendations = () => {
    const initialRecs: AIRecommendation[] = [
      {
        id: "1",
        type: "study-plan",
        priority: "high",
        title: "Upload Your Syllabi",
        description:
          "Start by uploading your course syllabi to get AI-powered study plans.",
        actionItems: [
          "Upload PDF syllabi",
          "Add exam dates",
          "Set study preferences",
        ],
        reasoning:
          "No syllabi detected. AI analysis requires course materials.",
        impact: "Personalized study plans and better time management",
        createdAt: new Date(),
      },
    ];
    setRecommendations(initialRecs);
  };

  const handleSyllabusUploaded = (syllabus: ParsedSyllabus) => {
    const updatedSyllabi = [...syllabi, syllabus];
    setSyllabi(updatedSyllabi);
    localStorage.setItem("ai-syllabi", JSON.stringify(updatedSyllabi));

    // Generate new recommendations based on uploaded syllabus
    updateRecommendations();
  };

  const handleModulesExtracted = (modules: SyllabusModule[]) => {
    // Update recommendations based on extracted modules
    updateRecommendations();
  };

  const handleAddExam = () => {
    if (!newExam.name || !newExam.subject || !newExam.date) return;

    const exam: Exam = {
      id: crypto.randomUUID(),
      name: newExam.name,
      subject: newExam.subject,
      date: new Date(newExam.date),
      duration: parseInt(newExam.duration) || 180,
      totalMarks: parseInt(newExam.totalMarks) || 100,
      weightage: parseInt(newExam.weightage) || 50,
      type: newExam.type,
      syllabusModules: [],
      preparationStatus: "not-started",
    };

    const updatedExams = [...exams, exam];
    setExams(updatedExams);
    localStorage.setItem("ai-exams", JSON.stringify(updatedExams));

    // Generate study plan for this exam
    generateStudyPlanForExam(exam);

    setIsExamDialogOpen(false);
    resetExamForm();
  };

  const generateStudyPlanForExam = (exam: Exam) => {
    // Find syllabus for this exam's subject
    const relevantSyllabus = syllabi.find(
      (s) =>
        s.subject.toLowerCase().includes(exam.subject.toLowerCase()) ||
        exam.subject.toLowerCase().includes(s.subject.toLowerCase()),
    );

    if (!relevantSyllabus) {
      alert("Please upload the syllabus for this subject first.");
      return;
    }

    // Generate AI study plan
    const studyPlan = AIStudyPlanGenerator.generateStudyPlan(
      relevantSyllabus.modules,
      exam,
      studyPattern,
      academicProfile,
    );

    const updatedPlans = [...studyPlans, studyPlan];
    setStudyPlans(updatedPlans);
    localStorage.setItem("ai-study-plans", JSON.stringify(updatedPlans));

    // Update recommendations
    updateRecommendations();
  };

  const updateRecommendations = () => {
    const newRecommendations: AIRecommendation[] = [];

    // CGPA improvement recommendation
    if (academicProfile.currentCGPA < academicProfile.targetCGPA) {
      newRecommendations.push({
        id: crypto.randomUUID(),
        type: "focus-area",
        priority: "high",
        title: "Focus on CGPA Improvement",
        description: `Target CGPA: ${academicProfile.targetCGPA} (Current: ${academicProfile.currentCGPA})`,
        actionItems: [
          "Prioritize high-weightage exams",
          "Allocate more time to weak subjects",
          "Maintain consistent study schedule",
        ],
        reasoning: "CGPA gap detected - strategic focus needed",
        impact: "Improved academic performance and career prospects",
        createdAt: new Date(),
      });
    }

    // Study pattern optimization
    if (studyPattern.procrastinationTendency > 0.5) {
      newRecommendations.push({
        id: crypto.randomUUID(),
        type: "time-management",
        priority: "medium",
        title: "Combat Procrastination",
        description: "Your study pattern shows tendency to postpone tasks",
        actionItems: [
          "Use 25-minute focused study blocks",
          "Set daily specific goals",
          "Remove distractions during study time",
        ],
        reasoning: "High procrastination tendency detected in analysis",
        impact: "Better focus and consistent progress",
        createdAt: new Date(),
      });
    }

    // Upcoming exam alerts
    exams.forEach((exam) => {
      const daysUntilExam = Math.ceil(
        (exam.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      );
      if (daysUntilExam <= 14 && daysUntilExam > 0) {
        newRecommendations.push({
          id: crypto.randomUUID(),
          type: "study-plan",
          priority: daysUntilExam <= 7 ? "high" : "medium",
          title: `${exam.name} Approaching`,
          description: `Exam in ${daysUntilExam} days - ${exam.weightage}% of grade`,
          actionItems: [
            "Review study plan progress",
            "Schedule revision sessions",
            "Practice past papers",
          ],
          reasoning: "Important exam deadline approaching",
          impact: "Better exam preparation and performance",
          createdAt: new Date(),
        });
      }
    });

    setRecommendations(newRecommendations);
  };

  const resetExamForm = () => {
    setNewExam({
      name: "",
      subject: "",
      date: "",
      duration: "",
      totalMarks: "",
      weightage: "",
      type: "midterm",
    });
  };

  const dismissRecommendation = (id: string) => {
    setRecommendations((recs) => recs.filter((r) => r.id !== id));
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "low":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Lightbulb className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <PlannerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-8 h-8 text-blue-600" />
              AI Study Assistant
            </h2>
            <p className="text-gray-600">
              Intelligent planning based on your syllabi, patterns, and CGPA
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={isExamDialogOpen} onOpenChange={setIsExamDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Add Exam
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Exam Schedule</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="examName">Exam Name</Label>
                    <Input
                      id="examName"
                      value={newExam.name}
                      onChange={(e) =>
                        setNewExam({ ...newExam, name: e.target.value })
                      }
                      placeholder="Midterm Exam"
                    />
                  </div>
                  <div>
                    <Label htmlFor="examSubject">Subject</Label>
                    <Input
                      id="examSubject"
                      value={newExam.subject}
                      onChange={(e) =>
                        setNewExam({ ...newExam, subject: e.target.value })
                      }
                      placeholder="Advanced Mathematics"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="examDate">Date</Label>
                      <Input
                        id="examDate"
                        type="date"
                        value={newExam.date}
                        onChange={(e) =>
                          setNewExam({ ...newExam, date: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="examDuration">Duration (min)</Label>
                      <Input
                        id="examDuration"
                        type="number"
                        value={newExam.duration}
                        onChange={(e) =>
                          setNewExam({ ...newExam, duration: e.target.value })
                        }
                        placeholder="180"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="examMarks">Total Marks</Label>
                      <Input
                        id="examMarks"
                        type="number"
                        value={newExam.totalMarks}
                        onChange={(e) =>
                          setNewExam({ ...newExam, totalMarks: e.target.value })
                        }
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="examWeightage">Weightage (%)</Label>
                      <Input
                        id="examWeightage"
                        type="number"
                        value={newExam.weightage}
                        onChange={(e) =>
                          setNewExam({ ...newExam, weightage: e.target.value })
                        }
                        placeholder="50"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Exam Type</Label>
                    <Select
                      value={newExam.type}
                      onValueChange={(value) =>
                        setNewExam({ ...newExam, type: value as Exam["type"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="midterm">Midterm</SelectItem>
                        <SelectItem value="final">Final</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="assignment">Assignment</SelectItem>
                        <SelectItem value="lab">Lab</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsExamDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddExam}>Add Exam</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Academic Profile Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Current CGPA
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {academicProfile.currentCGPA}
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Target CGPA
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {academicProfile.targetCGPA}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Uploaded Syllabi
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {syllabi.length}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Plans
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {studyPlans.length}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getPriorityIcon(rec.priority)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">
                              {rec.title}
                            </h4>
                            <Badge
                              variant={
                                rec.priority === "high"
                                  ? "destructive"
                                  : rec.priority === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {rec.description}
                          </p>
                          <div className="text-xs text-gray-500 mb-2">
                            <strong>Impact:</strong> {rec.impact}
                          </div>
                          <ul className="text-xs text-gray-600 list-disc list-inside">
                            {rec.actionItems.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissRecommendation(rec.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Syllabus Upload */}
          <div>
            <SyllabusUpload
              onSyllabusUploaded={handleSyllabusUploaded}
              onModulesExtracted={handleModulesExtracted}
            />
          </div>

          {/* Upcoming Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Exams
              </CardTitle>
            </CardHeader>
            <CardContent>
              {exams.length > 0 ? (
                <div className="space-y-3">
                  {exams
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((exam) => {
                      const daysUntil = Math.ceil(
                        (exam.date.getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24),
                      );
                      return (
                        <div
                          key={exam.id}
                          className="border border-gray-200 rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">
                              {exam.name}
                            </h4>
                            <Badge
                              variant={
                                daysUntil <= 7
                                  ? "destructive"
                                  : daysUntil <= 14
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {daysUntil} days
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {exam.subject}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {format(exam.date, "MMM d, yyyy")} •{" "}
                              {exam.weightage}% weightage
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {exam.type}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">No exams scheduled</p>
                  <Button
                    className="mt-2"
                    onClick={() => setIsExamDialogOpen(true)}
                  >
                    Add Your First Exam
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Study Plans Progress */}
        {studyPlans.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                AI-Generated Study Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studyPlans.map((plan) => {
                  const progress = Math.round(
                    (plan.dailyPlans.filter((dp) => dp.completed).length /
                      plan.dailyPlans.length) *
                      100,
                  );
                  const daysRemaining = Math.max(
                    0,
                    Math.ceil(
                      (plan.endDate.getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24),
                    ),
                  );

                  return (
                    <div
                      key={plan.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          {plan.name}
                        </h4>
                        <Badge variant="outline">{plan.subject}</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span
                            className={`font-medium ${getProgressColor(progress)}`}
                          >
                            {progress}%
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />

                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{plan.totalHours}h total</span>
                          <span>{daysRemaining} days left</span>
                        </div>

                        <div className="text-xs text-gray-500">
                          Last adjusted: {format(plan.lastAdjusted, "MMM d")}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Study Pattern Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Your Study Pattern Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Productive Hours
                </h4>
                <div className="space-y-1">
                  {studyPattern.productiveTimeSlots.map((slot, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs mr-1"
                    >
                      {slot}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Learning Preferences
                </h4>
                <div className="space-y-1">
                  <div className="text-xs text-gray-600">
                    Style: {studyPattern.learningStyle}
                  </div>
                  <div className="text-xs text-gray-600">
                    Session: {studyPattern.averageSessionDuration}min
                  </div>
                  <div className="text-xs text-gray-600">
                    Retention: {Math.round(studyPattern.retentionRate * 100)}%
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Subject Strengths
                </h4>
                <div className="space-y-1">
                  {studyPattern.strongSubjects.map((subject, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs mr-1 text-green-700 border-green-200"
                    >
                      {subject}
                    </Badge>
                  ))}
                  {studyPattern.weakSubjects.map((subject, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs mr-1 text-red-700 border-red-200"
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PlannerLayout>
  );
}
