import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIChatbot from "@/components/planner/AIChatbot";
import FourYearDashboard from "@/components/planner/FourYearDashboard";
import { SyllabusParser } from "@/lib/syllabus-parser";
import { MarksCalculator } from "@/lib/marks-calculator";
import { ParsedSyllabus, Subject, MarksBreakdown } from "@/types/syllabus";
import {
  Upload,
  Settings,
  Search,
  Quote,
  BookOpen,
  Star,
  Bot,
  BarChart3,
  TrendingUp,
  MessageCircle,
  Brain,
} from "lucide-react";

export default function OliveAIDashboard() {
  const [syllabi, setSyllabi] = useState<ParsedSyllabus[]>([]);
  const [showChatbot, setShowChatbot] = useState(false);

  // Updated academic data with Indian CGPA system (out of 10)
  const academicData = {
    currentCGPA: 7.2,
    targetCGPA: 8.5,
    semester: 5,
    totalCredits: 156,
    completedCredits: 124,
  };

  // Mock subjects from syllabus
  const subjects = [
    {
      id: "1",
      name: "Advanced Mathematics",
      code: "MATH401",
      credits: 4,
      internal: { obtained: 19, total: 25 },
      external: { total: 75, required: 45 },
      currentGrade: "B+",
      gradePoints: 8.0,
    },
    {
      id: "2",
      name: "Organic Chemistry",
      code: "CHEM301",
      credits: 3,
      internal: { obtained: 21, total: 25 },
      external: { total: 75, required: 40 },
      currentGrade: "A",
      gradePoints: 9.0,
    },
    {
      id: "3",
      name: "Computer Networks",
      code: "CS402",
      credits: 4,
      internal: { obtained: 17, total: 25 },
      external: { total: 75, required: 50 },
      currentGrade: "B",
      gradePoints: 7.0,
    },
    {
      id: "4",
      name: "Database Systems",
      code: "CS403",
      credits: 3,
      internal: { obtained: 23, total: 25 },
      external: { total: 75, required: 35 },
      currentGrade: "A",
      gradePoints: 9.0,
    },
  ];

  // Real dynamic dates - tracks actual current date
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = currentDate;
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Update date every minute to keep it current
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Mock data matching the Olive Notion design exactly
  const wednesdayTasks = [
    {
      id: "1",
      title: "7:30 Advanced Mathematics",
      completed: false,
      tag: "Math",
      internal: true,
    },
    {
      id: "2",
      title: "9:15 Organic Chemistry Lab",
      completed: false,
      tag: "Chemistry",
      internal: true,
    },
    {
      id: "3",
      title: "11:00 Database Systems",
      completed: false,
      tag: "CS",
      internal: false,
    },
    {
      id: "4",
      title: "13:30 Network Assignment Due",
      completed: false,
      tag: "CS",
      internal: true,
    },
    {
      id: "5",
      title: "15:30 Math Tutorial",
      completed: false,
      tag: "Math",
      internal: true,
    },
  ];

  const thursdayTasks = [
    {
      id: "6",
      title: "7:30 Chemistry Practical",
      completed: false,
      tag: "Chemistry",
      internal: true,
    },
    {
      id: "7",
      title: "11:00 Database Project Demo",
      completed: false,
      tag: "CS",
      internal: true,
    },
    {
      id: "8",
      title: "13:00 Math Problem Solving",
      completed: false,
      tag: "Math",
      internal: false,
    },
    {
      id: "9",
      title: "15:00 Network Theory",
      completed: false,
      tag: "CS",
      internal: false,
    },
  ];

  // Generate weekly todos based on current date
  const getWeeklyTodos = () => {
    const currentWeek = Math.ceil(today.getDate() / 7);
    const month = today.toLocaleDateString("en-US", { month: "long" });

    return [
      `Submit assignments due this week (Week ${currentWeek} of ${month})`,
      "Complete pending lab reports (Internal Assessment)",
      "Prepare for upcoming exams and tests",
      "Update study progress and CGPA tracker",
      "Review weak subjects identified by AI",
      "Complete project milestones on schedule",
      `Plan next week's study schedule`,
    ];
  };

  const weeklyTodos = getWeeklyTodos();

  // Generate tasks based on current day of the week
  const getDailyTasks = (dayOffset: number = 0) => {
    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + dayOffset);
    const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    const allTasks = {
      0: [
        // Sunday
        {
          id: "sun1",
          title: "9:00 Review Weekly Progress",
          completed: false,
          tag: "Study",
          internal: false,
        },
        {
          id: "sun2",
          title: "11:00 Plan Next Week",
          completed: false,
          tag: "Planning",
          internal: false,
        },
        {
          id: "sun3",
          title: "14:00 Complete Pending Assignments",
          completed: false,
          tag: "Study",
          internal: true,
        },
        {
          id: "sun4",
          title: "16:00 Revision Session",
          completed: false,
          tag: "Study",
          internal: false,
        },
      ],
      1: [
        // Monday
        {
          id: "mon1",
          title: "7:30 Advanced Mathematics",
          completed: false,
          tag: "Math",
          internal: true,
        },
        {
          id: "mon2",
          title: "9:15 Computer Networks",
          completed: false,
          tag: "CS",
          internal: false,
        },
        {
          id: "mon3",
          title: "11:00 Database Systems",
          completed: false,
          tag: "CS",
          internal: false,
        },
        {
          id: "mon4",
          title: "13:30 Math Assignment Due",
          completed: false,
          tag: "Math",
          internal: true,
        },
        {
          id: "mon5",
          title: "15:30 Study Group",
          completed: false,
          tag: "Study",
          internal: false,
        },
      ],
      2: [
        // Tuesday
        {
          id: "tue1",
          title: "8:00 Chemistry Lab",
          completed: false,
          tag: "Chemistry",
          internal: true,
        },
        {
          id: "tue2",
          title: "10:00 Database Project Work",
          completed: false,
          tag: "CS",
          internal: true,
        },
        {
          id: "tue3",
          title: "12:00 Math Tutorial",
          completed: false,
          tag: "Math",
          internal: true,
        },
        {
          id: "tue4",
          title: "14:00 Network Theory",
          completed: false,
          tag: "CS",
          internal: false,
        },
        {
          id: "tue5",
          title: "16:00 Chemistry Assignment",
          completed: false,
          tag: "Chemistry",
          internal: true,
        },
      ],
      3: wednesdayTasks, // Wednesday - use existing data
      4: thursdayTasks, // Thursday - use existing data
      5: [
        // Friday
        {
          id: "fri1",
          title: "7:30 Chemistry Practical",
          completed: false,
          tag: "Chemistry",
          internal: true,
        },
        {
          id: "fri2",
          title: "9:30 Database Systems Exam",
          completed: false,
          tag: "CS",
          internal: false,
        },
        {
          id: "fri3",
          title: "11:30 Math Problem Solving",
          completed: false,
          tag: "Math",
          internal: false,
        },
        {
          id: "fri4",
          title: "13:30 Project Submission",
          completed: false,
          tag: "CS",
          internal: true,
        },
        {
          id: "fri5",
          title: "15:30 Week Review",
          completed: false,
          tag: "Study",
          internal: false,
        },
      ],
      6: [
        // Saturday
        {
          id: "sat1",
          title: "9:00 Extra Math Practice",
          completed: false,
          tag: "Math",
          internal: false,
        },
        {
          id: "sat2",
          title: "11:00 Lab Report Writing",
          completed: false,
          tag: "Chemistry",
          internal: true,
        },
        {
          id: "sat3",
          title: "13:00 Computer Networks Study",
          completed: false,
          tag: "CS",
          internal: false,
        },
        {
          id: "sat4",
          title: "15:00 Assignment Catch-up",
          completed: false,
          tag: "Study",
          internal: true,
        },
      ],
    };

    return allTasks[dayOfWeek as keyof typeof allTasks] || [];
  };

  // Get today's and tomorrow's tasks dynamically
  const todaysTasks = getDailyTasks(0);
  const tomorrowsTasks = getDailyTasks(1);

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

  const getTagColor = (tag: string) => {
    const colors = {
      Math: "text-blue-400 bg-blue-400/10",
      Chemistry: "text-green-400 bg-green-400/10",
      CS: "text-purple-400 bg-purple-400/10",
      Physics: "text-yellow-400 bg-yellow-400/10",
    };
    return colors[tag as keyof typeof colors] || "text-gray-400 bg-gray-400/10";
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
      case "A":
        return "text-green-400";
      case "B+":
        return "text-blue-400";
      case "B":
        return "text-yellow-400";
      case "C+":
      case "C":
        return "text-orange-400";
      default:
        return "text-red-400";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Fixed AI Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowChatbot(true)}
          className="bg-green-600 hover:bg-green-700 rounded-full w-14 h-14 shadow-lg"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>

      {/* AI Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <Button
              onClick={() => setShowChatbot(false)}
              className="absolute top-4 right-4 z-10 bg-gray-800 hover:bg-gray-700"
            >
              ×
            </Button>
            <AIChatbot />
          </div>
        </div>
      )}

      <Tabs defaultValue="dashboard" className="w-full">
        <div className="border-b border-gray-800 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-8">
            <TabsList className="bg-transparent border-b-0 h-16">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-transparent data-[state=active]:text-green-400 data-[state=active]:border-b-2 data-[state=active]:border-green-400 rounded-none"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="marks"
                className="data-[state=active]:bg-transparent data-[state=active]:text-green-400 data-[state=active]:border-b-2 data-[state=active]:border-green-400 rounded-none"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Marks & CGPA
              </TabsTrigger>
              <TabsTrigger
                value="four-year"
                className="data-[state=active]:bg-transparent data-[state=active]:text-green-400 data-[state=active]:border-b-2 data-[state=active]:border-green-400 rounded-none"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                4-Year Journey
              </TabsTrigger>
              <TabsTrigger
                value="ai-chat"
                className="data-[state=active]:bg-transparent data-[state=active]:text-green-400 data-[state=active]:border-b-2 data-[state=active]:border-green-400 rounded-none"
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Assistant
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="dashboard" className="m-0">
          {/* Nature Header */}
          <div className="h-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800">
              <div className="absolute inset-0 opacity-50">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                ></div>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between h-full px-8">
              <h1 className="text-2xl font-semibold text-white">
                Ultimate Student Planner
              </h1>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10 p-2"
                >
                  <Search className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10 p-2"
                >
                  <Settings className="w-5 h-5" />
                </Button>
                <label htmlFor="syllabus-upload" className="cursor-pointer">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/80 hover:text-white hover:bg-white/10 p-2"
                  >
                    <Upload className="w-5 h-5" />
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

          {/* Main Content */}
          <div className="p-8">
            <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
              {/* Left Column - Date Cards & CGPA */}
              <div className="col-span-2 space-y-4">
                {/* Today's Date */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-center shadow-xl">
                  <div className="text-6xl font-bold text-white mb-2">
                    {today.getDate()}
                  </div>
                  <div className="text-sm text-white/90 uppercase tracking-wider font-medium">
                    {today
                      .toLocaleDateString("en-US", { month: "short" })
                      .toUpperCase()}
                  </div>
                  <div className="text-xs text-white/75 mt-3 uppercase font-semibold">
                    TODAY
                  </div>
                  <div className="text-xs text-white/60 mt-1">
                    {today
                      .toLocaleDateString("en-US", { weekday: "short" })
                      .toUpperCase()}
                  </div>
                </div>

                {/* Tomorrow's Date */}
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 text-center shadow-xl">
                  <div className="text-6xl font-bold text-white mb-2">
                    {tomorrow.getDate()}
                  </div>
                  <div className="text-sm text-white/90 uppercase tracking-wider font-medium">
                    {tomorrow
                      .toLocaleDateString("en-US", { month: "short" })
                      .toUpperCase()}
                  </div>
                  <div className="text-xs text-white/75 mt-3 uppercase font-semibold">
                    TOMORROW
                  </div>
                  <div className="text-xs text-white/60 mt-1">
                    {tomorrow
                      .toLocaleDateString("en-US", { weekday: "short" })
                      .toUpperCase()}
                  </div>
                </div>
                {/* CGPA Card */}
                <div className="bg-gray-900/80 backdrop-blur rounded-2xl p-6 border border-gray-800/50">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {academicData.currentCGPA}
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      Current CGPA
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(academicData.currentCGPA / 10) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400">
                      Target: {academicData.targetCGPA}/10
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Column - Task Lists */}
              <div className="col-span-7 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Today's Tasks */}
                  <div className="bg-gray-900/80 backdrop-blur rounded-2xl p-6 border border-gray-800/50">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <h3 className="text-white font-semibold text-lg">
                        {today.toLocaleDateString("en-US", { weekday: "long" })}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {todaysTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-4 group"
                        >
                          <input
                            type="checkbox"
                            checked={task.completed}
                            className="w-4 h-4 rounded border-2 border-gray-600 bg-transparent text-green-500 focus:ring-green-500"
                            readOnly
                          />
                          <div className="flex-1">
                            <div className="text-gray-300 font-medium text-sm">
                              {task.title}
                            </div>
                            {task.internal && (
                              <div className="text-xs text-blue-400 mt-1">
                                Internal Assessment
                              </div>
                            )}
                          </div>
                          <div
                            className={`text-xs px-3 py-1 rounded-full font-medium ${getTagColor(task.tag)}`}
                          >
                            {task.tag}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tomorrow's Tasks */}
                  <div className="bg-gray-900/80 backdrop-blur rounded-2xl p-6 border border-gray-800/50">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <h3 className="text-white font-semibold text-lg">
                        {tomorrow.toLocaleDateString("en-US", {
                          weekday: "long",
                        })}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {tomorrowsTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-4 group"
                        >
                          <input
                            type="checkbox"
                            checked={task.completed}
                            className="w-4 h-4 rounded border-2 border-gray-600 bg-transparent text-green-500 focus:ring-green-500"
                            readOnly
                          />
                          <div className="flex-1">
                            <div className="text-gray-300 font-medium text-sm">
                              {task.title}
                            </div>
                            {task.internal && (
                              <div className="text-xs text-blue-400 mt-1">
                                Internal Assessment
                              </div>
                            )}
                          </div>
                          <div
                            className={`text-xs px-3 py-1 rounded-full font-medium ${getTagColor(task.tag)}`}
                          >
                            {task.tag}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Row - Study Image and AI Chat Preview */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-900/80 backdrop-blur rounded-2xl overflow-hidden border border-gray-800/50">
                    <div className="aspect-[4/3] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative">
                      <div className="absolute inset-0">
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                          <div className="text-white">
                            <div className="w-8 h-8 bg-white/20 rounded-lg mb-3 flex items-center justify-center">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <h4 className="font-semibold mb-1">Study Space</h4>
                            <p className="text-sm text-white/80">
                              Your optimal learning environment
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Assistant Preview */}
                  <div className="bg-gray-900/80 backdrop-blur rounded-2xl p-6 border border-gray-800/50">
                    <div className="flex items-center gap-3 mb-4">
                      <Bot className="w-5 h-5 text-green-500" />
                      <h3 className="text-white font-semibold">AI Assistant</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-300">
                        "Based on your current internal marks, you need 65+ in
                        external exams to maintain your target CGPA of 8.5"
                      </div>
                      <Button
                        onClick={() => setShowChatbot(true)}
                        className="w-full bg-green-600 hover:bg-green-700 text-sm"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Open AI Chat
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Weekly Todos and Subjects */}
              <div className="col-span-3 space-y-6">
                {/* Weekly Todos */}
                <div className="bg-gray-900/80 backdrop-blur rounded-2xl p-6 border border-gray-800/50">
                  <h3 className="text-green-500 font-bold text-sm tracking-[0.2em] mb-6 uppercase">
                    WEEKLY TODOS
                  </h3>
                  <div className="space-y-3">
                    {weeklyTodos.map((todo, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-gray-300 text-sm font-medium leading-relaxed">
                          {todo}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Subjects */}
                <div className="bg-gray-900/80 backdrop-blur rounded-2xl p-6 border border-gray-800/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <h3 className="text-white font-semibold">
                      Current Subjects
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {subjects.map((subject) => (
                      <div key={subject.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-gray-300 font-medium text-sm">
                              {subject.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {subject.code} • {subject.credits} credits
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-sm font-bold ${getGradeColor(subject.currentGrade)}`}
                            >
                              {subject.currentGrade}
                            </div>
                            <div className="text-xs text-gray-500">
                              {subject.gradePoints}/10
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>
                            Internal: {subject.internal.obtained}/
                            {subject.internal.total}
                          </span>
                          <span>External: {subject.external.total} marks</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gray-900/80 backdrop-blur rounded-2xl p-6 border border-gray-800/50">
                  <h3 className="text-white font-semibold mb-4">
                    Academic Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Semester</span>
                      <span className="text-white text-sm font-medium">
                        {academicData.semester}/8
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">
                        Credits Completed
                      </span>
                      <span className="text-white text-sm font-medium">
                        {academicData.completedCredits}/
                        {academicData.totalCredits}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Progress</span>
                      <span className="text-green-400 text-sm font-medium">
                        79.5%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="marks" className="m-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              Detailed Marks & CGPA Analysis
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject-wise Breakdown */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-4">
                    Subject-wise Performance
                  </h3>
                  <div className="space-y-4">
                    {subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className="bg-gray-800 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-white font-medium">
                              {subject.name}
                            </h4>
                            <p className="text-gray-400 text-sm">
                              {subject.code}
                            </p>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-lg font-bold ${getGradeColor(subject.currentGrade)}`}
                            >
                              {subject.currentGrade}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {subject.gradePoints}/10
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">
                              Internal Assessment
                            </span>
                            <span className="text-white">
                              {subject.internal.obtained}/
                              {subject.internal.total} (25%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{
                                width: `${(subject.internal.obtained / subject.internal.total) * 100}%`,
                              }}
                            ></div>
                          </div>

                          <div className="flex justify-between text-sm mt-2">
                            <span className="text-gray-400">External Exam</span>
                            <span className="text-white">
                              Required: {subject.external.required}/
                              {subject.external.total} (75%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{
                                width: `${(subject.external.required / subject.external.total) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CGPA Projection */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-4">
                    CGPA Analysis & Projections
                  </h3>

                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-400 mb-2">
                        {academicData.currentCGPA}
                      </div>
                      <div className="text-gray-400">Current CGPA</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Based on {academicData.completedCredits} credits
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-3">
                        Target Analysis
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Target CGPA:</span>
                          <span className="text-green-400">
                            {academicData.targetCGPA}/10
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Gap to close:</span>
                          <span className="text-yellow-400">
                            +
                            {(
                              academicData.targetCGPA - academicData.currentCGPA
                            ).toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Required SGPA:</span>
                          <span className="text-orange-400">8.8/10</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-3">
                        Improvement Strategy
                      </h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>
                          • Focus on Computer Networks (Currently B grade)
                        </li>
                        <li>• Maintain excellence in Chemistry & Database</li>
                        <li>• Aim for 70+ marks in external exams</li>
                        <li>• Complete all internal assessments on time</li>
                      </ul>
                    </div>

                    <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                      <h4 className="text-green-400 font-medium mb-2">
                        💡 AI Recommendation
                      </h4>
                      <p className="text-sm text-gray-300">
                        Based on your current performance, achieving 8.5 CGPA is
                        realistic. Focus on external exam preparation,
                        especially for Computer Networks.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="four-year" className="m-0 p-8">
          <div className="max-w-7xl mx-auto">
            <FourYearDashboard />
          </div>
        </TabsContent>

        <TabsContent value="ai-chat" className="m-0 p-8">
          <div className="max-w-7xl mx-auto">
            <AIChatbot />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
