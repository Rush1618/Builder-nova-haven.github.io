import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fourYearTracker } from "@/lib/four-year-tracker";
import {
  AcademicYear,
  AcademicProgressAnalytics,
  Semester,
} from "@/types/academic-history";
import {
  TrendingUp,
  TrendingDown,
  Award,
  BookOpen,
  Calendar,
  Target,
  BarChart3,
  Users,
  Download,
  Star,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Lightbulb,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";

export default function FourYearDashboard() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [analytics, setAnalytics] = useState<AcademicProgressAnalytics | null>(
    null,
  );
  const [selectedYear, setSelectedYear] = useState<number>(1);

  useEffect(() => {
    loadAcademicData();
  }, []);

  const loadAcademicData = () => {
    const data = fourYearTracker.loadAcademicData();
    setAcademicYears(data);

    const analyticsData = fourYearTracker.calculateProgressAnalytics(data);
    setAnalytics(analyticsData);
  };

  const exportReport = () => {
    const report = fourYearTracker.exportAcademicReport(academicYears);
    const blob = new Blob([report], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `academic-report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
        return "text-green-500 bg-green-50 border-green-200";
      case "A":
        return "text-green-400 bg-green-50 border-green-200";
      case "B+":
        return "text-blue-500 bg-blue-50 border-blue-200";
      case "B":
        return "text-blue-400 bg-blue-50 border-blue-200";
      case "C+":
        return "text-yellow-500 bg-yellow-50 border-yellow-200";
      case "C":
        return "text-yellow-400 bg-yellow-50 border-yellow-200";
      case "D":
        return "text-orange-500 bg-orange-50 border-orange-200";
      case "F":
        return "text-red-500 bg-red-50 border-red-200";
      default:
        return "text-gray-500 bg-gray-50 border-gray-200";
    }
  };

  const getCurrentSemester = (): Semester | null => {
    for (const year of academicYears) {
      for (const semester of year.semesters) {
        if (semester.status === "current") {
          return semester;
        }
      }
    }
    return null;
  };

  const getCompletedSemesters = (): Semester[] => {
    return academicYears
      .flatMap((year) => year.semesters)
      .filter((sem) => sem.status === "completed");
  };

  if (!analytics) {
    return (
      <div className="text-center py-8">
        Loading your 4-year academic journey...
      </div>
    );
  }

  const currentSemester = getCurrentSemester();
  const completedSemesters = getCompletedSemesters();

  // Data for charts
  const cgpaData = analytics.semesterWiseGPA.map((item, index) => ({
    semester: `S${index + 1}`,
    sgpa: item.sgpa,
    cgpa: item.cgpa,
    name: item.semester,
  }));

  const yearlyData = analytics.yearWiseGPA.map((item) => ({
    year: `Year ${item.year}`,
    gpa: item.gpa,
    credits: item.credits,
  }));

  const subjectPerformanceData = analytics.subjectWiseTrends.map((subject) => ({
    name: subject.subjectName,
    average: subject.averageGradePoints,
    trend: subject.improvement,
  }));

  const pieColors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            4-Year Academic Journey
          </h2>
          <p className="text-gray-600">
            Complete performance tracking and analytics
          </p>
        </div>
        <Button onClick={exportReport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Overall CGPA
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.overallCGPA}/10
                </p>
                <p className="text-xs text-gray-500">
                  Target: {analytics.targetCGPA}/10
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Credits Completed
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.completedCredits}
                </p>
                <p className="text-xs text-gray-500">
                  of {analytics.totalCredits} total
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Semesters Completed
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedSemesters.length}
                </p>
                <p className="text-xs text-gray-500">of 8 total</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Projected Final CGPA
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.projectedFinalCGPA}/10
                </p>
                <p className="text-xs text-gray-500">Based on current trend</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="yearly">Year-wise</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* CGPA Progression Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                CGPA Progression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={cgpaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="semester"
                    axisLine={true}
                    tickLine={true}
                    tick={true}
                  />
                  <YAxis
                    domain={[0, 10]}
                    axisLine={true}
                    tickLine={true}
                    tick={true}
                  />
                  <Tooltip
                    labelFormatter={(label) =>
                      cgpaData.find((d) => d.semester === label)?.name || label
                    }
                    formatter={(value: number, name: string) => [
                      value.toFixed(2),
                      name === "sgpa" ? "SGPA" : "CGPA",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="cgpa"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                  <Line
                    type="monotone"
                    dataKey="sgpa"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Current Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Semester Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {currentSemester ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {currentSemester.name}
                      </span>
                      <Badge variant="outline">{currentSemester.status}</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Credits Progress</span>
                        <span>
                          {currentSemester.earnedCredits}/
                          {currentSemester.totalCredits}
                        </span>
                      </div>
                      <Progress
                        value={
                          (currentSemester.earnedCredits /
                            currentSemester.totalCredits) *
                          100
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Attendance</span>
                        <span>{currentSemester.attendancePercentage}%</span>
                      </div>
                      <Progress value={currentSemester.attendancePercentage} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {currentSemester.subjects.length}
                        </div>
                        <div className="text-xs text-gray-500">
                          Active Subjects
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {currentSemester.sgpa}/10
                        </div>
                        <div className="text-xs text-gray-500">
                          Current SGPA
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No current semester found</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Academic Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {analytics.honorsEligibility ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-orange-500" />
                    )}
                    <div>
                      <p className="font-medium">Honors Eligibility</p>
                      <p className="text-sm text-gray-500">
                        {analytics.honorsEligibility
                          ? "Eligible for graduation with honors"
                          : "Need 8.0+ CGPA for honors"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {analytics.scholarshipEligibility ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-orange-500" />
                    )}
                    <div>
                      <p className="font-medium">Scholarship Eligibility</p>
                      <p className="text-sm text-gray-500">
                        {analytics.scholarshipEligibility
                          ? "Eligible for merit scholarships"
                          : "Need 7.5+ CGPA for scholarships"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Consistency Score</p>
                      <p className="text-sm text-gray-500">
                        {Math.round(analytics.consistencyScore)}% -{" "}
                        {analytics.consistencyScore >= 80
                          ? "Excellent"
                          : analytics.consistencyScore >= 60
                            ? "Good"
                            : "Needs Improvement"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Graduation Probability</p>
                      <p className="text-sm text-gray-500">
                        {Math.round(analytics.graduationProbability * 100)}%
                        chance of graduating on time
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Semester-wise Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Semester-wise SGPA</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cgpaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="semester"
                      axisLine={true}
                      tickLine={true}
                      tick={true}
                    />
                    <YAxis
                      domain={[0, 10]}
                      axisLine={true}
                      tickLine={true}
                      tick={true}
                    />
                    <Tooltip />
                    <Bar dataKey="sgpa" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
                  <div className="flex flex-wrap gap-2">
                    {analytics.strengths.map((strength, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-green-700 border-green-200"
                      >
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-orange-700 mb-2">
                    Areas for Improvement
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analytics.weaknesses.map((weakness, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-orange-700 border-orange-200"
                      >
                        {weakness}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">
                    Best Performing Semesters
                  </h4>
                  <div className="space-y-1">
                    {analytics.peakPerformanceSemesters.map(
                      (semester, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">{semester}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Areas of Concern</h4>
                  <div className="space-y-1">
                    {analytics.lowPerformanceSemesters.map(
                      (semester, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-sm">{semester}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.subjectWiseTrends.map((subject, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{subject.subjectName}</h4>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`${subject.improvement === "improving" ? "text-green-600 border-green-200" : subject.improvement === "declining" ? "text-red-600 border-red-200" : "text-gray-600 border-gray-200"}`}
                        >
                          {subject.improvement === "improving" ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : subject.improvement === "declining" ? (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          ) : null}
                          {subject.improvement}
                        </Badge>
                        <span className="text-sm font-medium">
                          {subject.averageGradePoints}/10
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {subject.grades.map((grade, gradeIndex) => (
                        <Badge
                          key={gradeIndex}
                          variant="outline"
                          className={getGradeColor(grade.grade)}
                        >
                          {grade.semester.split(" - ")[1]}: {grade.grade}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Yearly Tab */}
        <TabsContent value="yearly" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Year-wise Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Bar dataKey="gpa" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Credits Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={yearlyData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="credits"
                      label={({ name, credits }) => `${name}: ${credits}`}
                    >
                      {yearlyData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={pieColors[index % pieColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Year-wise Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {academicYears.map((year) => (
              <Card
                key={year.year}
                className={
                  year.status === "current" ? "ring-2 ring-blue-500" : ""
                }
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Year {year.year}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Year GPA:</span>
                      <span className="font-medium">{year.yearGPA}/10</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Credits:</span>
                      <span>
                        {year.completedCredits}/{year.totalCredits}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <Badge
                        variant={
                          year.status === "completed"
                            ? "default"
                            : year.status === "current"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {year.status}
                      </Badge>
                    </div>
                    <Progress
                      value={(year.completedCredits / year.totalCredits) * 100}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                AI-Powered Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Performance Insights */}
              <div>
                <h4 className="font-medium mb-3">Performance Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="font-medium text-blue-900 mb-2">
                      Academic Trajectory
                    </h5>
                    <p className="text-sm text-blue-800">
                      Your CGPA has{" "}
                      {analytics.overallCGPA >= 7.5
                        ? "been consistently strong"
                        : "shown room for improvement"}
                      . Based on current trends, you're projected to achieve a
                      final CGPA of {analytics.projectedFinalCGPA}/10.
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">
                      Strengths
                    </h5>
                    <p className="text-sm text-green-800">
                      You excel in {analytics.strengths.join(", ")}. These
                      subjects show consistent high performance and can be
                      leveraged for specialization or career focus.
                    </p>
                  </div>
                </div>
              </div>

              {/* Career Guidance */}
              <div>
                <h4 className="font-medium mb-3">Career Guidance</h4>
                <div className="space-y-3">
                  {fourYearTracker
                    .generateCareerGuidance(analytics)
                    .recommendedCareerPaths.map((path, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{path.path}</h5>
                          <Badge
                            variant={
                              path.currentEligibility ? "default" : "secondary"
                            }
                          >
                            {path.currentEligibility
                              ? "Eligible"
                              : "Not Yet Eligible"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {path.eligibilityCriteria}
                        </p>
                        <div className="text-xs text-gray-500">
                          Required CGPA: {path.requiredCGPA}/10 | Your CGPA:{" "}
                          {analytics.overallCGPA}/10
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Improvement Recommendations */}
              <div>
                <h4 className="font-medium mb-3">
                  Improvement Recommendations
                </h4>
                <div className="space-y-2">
                  {analytics.overallCGPA < analytics.targetCGPA && (
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-sm text-orange-800">
                        📈 To reach your target CGPA of {analytics.targetCGPA},
                        focus on improving performance in{" "}
                        {analytics.weaknesses.join(", ")}.
                      </p>
                    </div>
                  )}

                  {analytics.consistencyScore < 80 && (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        📊 Your consistency score is{" "}
                        {Math.round(analytics.consistencyScore)}%. Work on
                        maintaining steady performance across all semesters.
                      </p>
                    </div>
                  )}

                  {analytics.overallAttendance < 85 && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800">
                        ⚠️ Your attendance is{" "}
                        {Math.round(analytics.overallAttendance)}%. Improving
                        attendance can positively impact your grades.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
