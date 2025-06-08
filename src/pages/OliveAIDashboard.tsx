import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { SyllabusParser } from "@/lib/syllabus-parser";
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
  BookOpen,
  Clock,
  Plus,
  Upload,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Zap,
  TrendingUp,
  Star,
  Users,
  Image as ImageIcon,
  Quote,
} from "lucide-react";
import { format, addDays } from "date-fns";

export default function OliveAIDashboard() {
  const [syllabi, setSyllabi] = useState<ParsedSyllabus[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [currentDate] = useState(new Date());
  const [academicProfile] = useState<AcademicProfile>({
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

  // Today's date cards
  const today = new Date();
  const dayOfMonth = today.getDate();
  const month = today.getMonth() + 1;

  // Mock data for demo
  const todaysTasks = [
    {
      id: "1",
      title: "Complete Math Assignment Chapter 5",
      subject: "Mathematics",
      time: "10:00 AM",
      completed: false,
      priority: "high",
    },
    {
      id: "2",
      title: "Review Physics Lab Report",
      subject: "Physics",
      time: "2:00 PM",
      completed: true,
      priority: "medium",
    },
    {
      id: "3",
      title: "Study for Chemistry Exam",
      subject: "Chemistry",
      time: "4:00 PM",
      completed: false,
      priority: "high",
    },
    {
      id: "4",
      title: "Read History Chapter 12",
      subject: "History",
      time: "7:00 PM",
      completed: false,
      priority: "low",
    },
    {
      id: "5",
      title: "Programming Project Research",
      subject: "Computer Science",
      time: "8:30 PM",
      completed: false,
      priority: "medium",
    },
  ];

  const tomorrowTasks = [
    {
      id: "6",
      title: "Submit Chemistry Lab Report",
      subject: "Chemistry",
      time: "9:00 AM",
      completed: false,
      priority: "high",
    },
    {
      id: "7",
      title: "Math Quiz Preparation",
      subject: "Mathematics",
      time: "11:00 AM",
      completed: false,
      priority: "medium",
    },
    {
      id: "8",
      title: "Group Study Session",
      subject: "Physics",
      time: "3:00 PM",
      completed: false,
      priority: "low",
    },
    {
      id: "9",
      title: "Essay Outline Draft",
      subject: "History",
      time: "5:00 PM",
      completed: false,
      priority: "medium",
    },
  ];

  const weeklyTodos = [
    "Complete differential equations homework",
    "Review organic chemistry notes",
    "Finish history essay draft",
    "Practice programming algorithms",
    "Study for midterm exams",
    "Update study plan progress",
    "Review weekly goals",
  ];

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    try {
      const syllabus = await SyllabusParser.parsePDF(file);
      setSyllabi((prev) => [...prev, syllabus]);
      localStorage.setItem(
        "ai-syllabi",
        JSON.stringify([...syllabi, syllabus]),
      );
    } catch (error) {
      console.error("Error parsing syllabus:", error);
      alert("Error parsing syllabus. Please try again.");
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      Mathematics: "bg-blue-500",
      Physics: "bg-purple-500",
      Chemistry: "bg-green-500",
      History: "bg-orange-500",
      "Computer Science": "bg-red-500",
    };
    return colors[subject as keyof typeof colors] || "bg-gray-500";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400 border-red-400";
      case "medium":
        return "text-yellow-400 border-yellow-400";
      case "low":
        return "text-green-400 border-green-400";
      default:
        return "text-gray-400 border-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-gray-800 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-foreground">
                  Ultimate Student Planner
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground-secondary hover:text-foreground"
              >
                <Users className="w-4 h-4 mr-2" />
                Study Groups
              </Button>

              <label htmlFor="syllabus-upload" className="cursor-pointer">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-foreground hover:bg-gray-800"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Syllabus
                </Button>
                <input
                  id="syllabus-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Section - Date Cards */}
          <div className="col-span-12 lg:col-span-2">
            <div className="space-y-4">
              {/* Today's Date */}
              <Card className="bg-primary-500 border-primary-600 text-white overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-1">{dayOfMonth}</div>
                  <div className="text-sm opacity-90">
                    {format(today, "MMMM")}
                  </div>
                  <div className="text-xs opacity-75 mt-2">TODAY</div>
                </CardContent>
              </Card>

              {/* Tomorrow's Date */}
              <Card className="bg-primary-600 border-primary-700 text-white overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-1">
                    {addDays(today, 1).getDate()}
                  </div>
                  <div className="text-sm opacity-90">
                    {format(addDays(today, 1), "MMMM")}
                  </div>
                  <div className="text-xs opacity-75 mt-2">TOMORROW</div>
                </CardContent>
              </Card>

              {/* CGPA Progress */}
              <Card className="bg-background-tertiary border-gray-800">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {academicProfile.currentCGPA}
                    </div>
                    <div className="text-xs text-foreground-secondary mb-2">
                      Current CGPA
                    </div>
                    <Progress
                      value={(academicProfile.currentCGPA / 4.0) * 100}
                      className="h-2 bg-gray-700"
                    />
                    <div className="text-xs text-foreground-muted mt-1">
                      Target: {academicProfile.targetCGPA}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Center Section - Task Lists */}
          <div className="col-span-12 lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Today's Tasks */}
              <Card className="bg-background-tertiary border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {todaysTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg border border-gray-800"
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        className="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                        readOnly
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-foreground-muted">
                            {task.time}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <div
                          className={`text-sm ${task.completed ? "line-through text-foreground-muted" : "text-foreground"}`}
                        >
                          {task.title}
                        </div>
                        <div className="text-xs text-foreground-secondary">
                          {task.subject}
                        </div>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${getSubjectColor(task.subject)}`}
                      ></div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Tomorrow's Tasks */}
              <Card className="bg-background-tertiary border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-foreground flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary-400 rounded-full"></div>
                    Tomorrow's Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tomorrowTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg border border-gray-800"
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        className="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                        readOnly
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-foreground-muted">
                            {task.time}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <div className="text-sm text-foreground">
                          {task.title}
                        </div>
                        <div className="text-xs text-foreground-secondary">
                          {task.subject}
                        </div>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${getSubjectColor(task.subject)}`}
                      ></div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Bottom Section - Visual Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Study Environment Image */}
              <Card className="bg-background-tertiary border-gray-800 overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-white/70" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-foreground mb-1">
                      Study Environment
                    </h3>
                    <p className="text-xs text-foreground-secondary">
                      Your personalized study space recommendations
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Inspiration Quote */}
              <Card className="bg-background-tertiary border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-foreground flex items-center gap-2">
                    <Quote className="w-4 h-4 text-primary-500" />
                    Inspiration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-sm text-foreground-secondary italic leading-relaxed">
                    "Success is not final, failure is not fatal: it is the
                    courage to continue that counts."
                  </blockquote>
                  <div className="text-xs text-foreground-muted mt-3">
                    - Winston Churchill
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-foreground-muted">
                        Favorite quotes
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Section - Weekly Todos & Progress */}
          <div className="col-span-12 lg:col-span-3">
            <div className="space-y-6">
              {/* Weekly Todos */}
              <Card className="bg-background-tertiary border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-primary-500 font-semibold tracking-wider">
                    WEEKLY TODOS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {weeklyTodos.map((todo, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-1 h-1 bg-primary-500 rounded-full flex-shrink-0"></div>
                      <span className="text-foreground-secondary">{todo}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Study Subjects */}
              <Card className="bg-background-tertiary border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-foreground flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary-500" />
                    Subjects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Mathematics", progress: 85, color: "bg-blue-500" },
                    { name: "Physics", progress: 72, color: "bg-purple-500" },
                    { name: "Chemistry", progress: 90, color: "bg-green-500" },
                    { name: "History", progress: 65, color: "bg-orange-500" },
                    {
                      name: "Computer Science",
                      progress: 78,
                      color: "bg-red-500",
                    },
                  ].map((subject) => (
                    <div key={subject.name} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${subject.color}`}
                          ></div>
                          <span className="text-xs text-foreground">
                            {subject.name}
                          </span>
                        </div>
                        <span className="text-xs text-foreground-muted">
                          {subject.progress}%
                        </span>
                      </div>
                      <Progress
                        value={subject.progress}
                        className="h-1 bg-gray-700"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card className="bg-background-tertiary border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-foreground flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary-500" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-primary-500/10 rounded-lg border border-primary-500/20">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-primary-400 mb-1">
                          Focus Recommendation
                        </div>
                        <div className="text-xs text-foreground-secondary leading-relaxed">
                          Based on your CGPA goal, prioritize Mathematics and
                          Chemistry this week for maximum impact.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-yellow-400 mb-1">
                          Time Alert
                        </div>
                        <div className="text-xs text-foreground-secondary leading-relaxed">
                          Chemistry exam in 5 days. Consider increasing daily
                          study time by 30 minutes.
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
