import React, { useState, useEffect } from "react";
import PlannerLayout from "@/components/planner/PlannerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { storage } from "@/lib/storage";
import { Task, Goal } from "@/types/planner";
import { getTasksForMonth } from "@/lib/planner-utils";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Target,
  BookOpen,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  isSameMonth,
} from "date-fns";

export default function MonthlyPlanner() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTasks(storage.getTasks());
    setGoals(storage.getGoals());
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setSelectedMonth(
      direction === "prev"
        ? subMonths(selectedMonth, 1)
        : addMonths(selectedMonth, 1),
    );
  };

  const goToCurrentMonth = () => {
    setSelectedMonth(new Date());
  };

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const monthTasks = getTasksForMonth(tasks, selectedMonth);

  // Create calendar grid (6 weeks = 42 days)
  const firstDayOfMonth = monthStart.getDay();
  const startDate = new Date(monthStart);
  startDate.setDate(
    startDate.getDate() - (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1),
  );

  const calendarDays = [];
  for (let i = 0; i < 42; i++) {
    const day = new Date(startDate);
    day.setDate(day.getDate() + i);
    calendarDays.push(day);
  }

  // Group tasks by day
  const tasksByDay = tasks.reduce(
    (acc, task) => {
      const dayKey = task.dueDate.toISOString().split("T")[0];
      if (!acc[dayKey]) acc[dayKey] = [];
      acc[dayKey].push(task);
      return acc;
    },
    {} as Record<string, Task[]>,
  );

  // Month statistics
  const monthStats = {
    totalTasks: monthTasks.length,
    completedTasks: monthTasks.filter((task) => task.completed).length,
    overdueTasks: monthTasks.filter(
      (task) => !task.completed && task.dueDate < new Date(),
    ).length,
    goalsThisMonth: goals.filter((goal) =>
      isSameMonth(goal.targetDate, selectedMonth),
    ).length,
  };

  const getTaskCountForDay = (day: Date): number => {
    const dayKey = day.toISOString().split("T")[0];
    return tasksByDay[dayKey]?.length || 0;
  };

  const getCompletedTasksForDay = (day: Date): number => {
    const dayKey = day.toISOString().split("T")[0];
    return tasksByDay[dayKey]?.filter((task) => task.completed).length || 0;
  };

  const hasHighPriorityTask = (day: Date): boolean => {
    const dayKey = day.toISOString().split("T")[0];
    return (
      tasksByDay[dayKey]?.some(
        (task) => task.priority === "high" && !task.completed,
      ) || false
    );
  };

  return (
    <PlannerLayout>
      <div className="space-y-6">
        {/* Header with Month Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("prev")}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="text-center min-w-[200px]">
                <h2 className="text-2xl font-bold text-gray-900">
                  {format(selectedMonth, "MMMM yyyy")}
                </h2>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("next")}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isSameMonth(selectedMonth, new Date()) && (
              <Button variant="outline" size="sm" onClick={goToCurrentMonth}>
                Current Month
              </Button>
            )}
            <Button size="sm" className="bg-black hover:bg-gray-800 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tasks This Month
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {monthStats.totalTasks}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {monthStats.completedTasks}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">
                    {monthStats.overdueTasks}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Goal Deadlines
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {monthStats.goalsThisMonth}
                  </p>
                </div>
                <Target className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Week Headers */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const isCurrentMonth = isSameMonth(day, selectedMonth);
                const isCurrentDay = isToday(day);
                const taskCount = getTaskCountForDay(day);
                const completedCount = getCompletedTasksForDay(day);
                const hasHighPriority = hasHighPriorityTask(day);

                return (
                  <div
                    key={index}
                    className={`
                      min-h-[80px] p-2 border border-gray-200 rounded-lg cursor-pointer transition-colors
                      ${isCurrentMonth ? "bg-white" : "bg-gray-50"}
                      ${isCurrentDay ? "ring-2 ring-blue-500 bg-blue-50" : ""}
                      hover:bg-gray-50
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`
                        text-sm font-medium
                        ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                        ${isCurrentDay ? "text-blue-600" : ""}
                      `}
                      >
                        {format(day, "d")}
                      </span>

                      {taskCount > 0 && (
                        <Badge
                          variant={
                            hasHighPriority ? "destructive" : "secondary"
                          }
                          className="text-xs h-4 px-1"
                        >
                          {taskCount}
                        </Badge>
                      )}
                    </div>

                    {/* Task indicators */}
                    {taskCount > 0 && (
                      <div className="space-y-1">
                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-green-500 h-1 rounded-full"
                            style={{
                              width: `${taskCount > 0 ? (completedCount / taskCount) * 100 : 0}%`,
                            }}
                          />
                        </div>

                        {/* Task preview dots */}
                        <div className="flex gap-1 flex-wrap">
                          {Array.from({ length: Math.min(taskCount, 4) }).map(
                            (_, i) => (
                              <div
                                key={i}
                                className="w-1 h-1 rounded-full bg-blue-400"
                              />
                            ),
                          )}
                          {taskCount > 4 && (
                            <span className="text-xs text-gray-500">
                              +{taskCount - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Today indicator */}
                    {isCurrentDay && (
                      <div className="mt-1">
                        <Badge
                          variant="default"
                          className="text-xs bg-blue-500"
                        >
                          Today
                        </Badge>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Month Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Upcoming Tasks This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              {monthTasks.length > 0 ? (
                <div className="space-y-3">
                  {monthTasks
                    .filter((task) => !task.completed)
                    .sort(
                      (a, b) =>
                        new Date(a.dueDate).getTime() -
                        new Date(b.dueDate).getTime(),
                    )
                    .slice(0, 8)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-2 border border-gray-200 rounded"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {task.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Due {format(task.dueDate, "MMM d")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              task.priority === "high"
                                ? "border-red-200 text-red-600"
                                : task.priority === "medium"
                                  ? "border-orange-200 text-orange-600"
                                  : "border-green-200 text-green-600"
                            }`}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}

                  {monthTasks.filter((task) => !task.completed).length > 8 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{monthTasks.filter((task) => !task.completed).length - 8}{" "}
                      more tasks this month
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">No tasks scheduled this month</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Goals This Month */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Goals Due This Month</CardTitle>
            </CardHeader>
            <CardContent>
              {goals.filter((goal) =>
                isSameMonth(goal.targetDate, selectedMonth),
              ).length > 0 ? (
                <div className="space-y-4">
                  {goals
                    .filter((goal) =>
                      isSameMonth(goal.targetDate, selectedMonth),
                    )
                    .map((goal) => (
                      <div
                        key={goal.id}
                        className="p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {goal.title}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {goal.category}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Progress</span>
                            <span>{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-purple-500 h-1.5 rounded-full"
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            Due {format(goal.targetDate, "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">No goal deadlines this month</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Month Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Month Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Task Categories */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Task Categories
                </h4>
                <div className="space-y-2">
                  {["assignment", "study", "exam", "project", "other"].map(
                    (category) => {
                      const categoryTasks = monthTasks.filter(
                        (task) => task.category === category,
                      );
                      const percentage =
                        monthTasks.length > 0
                          ? (categoryTasks.length / monthTasks.length) * 100
                          : 0;

                      return (
                        <div key={category} className="flex items-center gap-3">
                          <div className="w-20 text-xs text-gray-600 capitalize">
                            {category}
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="w-6 text-xs text-gray-600 text-right">
                            {categoryTasks.length}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              {/* Priority Distribution */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Priority Distribution
                </h4>
                <div className="space-y-2">
                  {["high", "medium", "low"].map((priority) => {
                    const priorityTasks = monthTasks.filter(
                      (task) => task.priority === priority,
                    );
                    const percentage =
                      monthTasks.length > 0
                        ? (priorityTasks.length / monthTasks.length) * 100
                        : 0;
                    const colors = {
                      high: "bg-red-500",
                      medium: "bg-orange-500",
                      low: "bg-green-500",
                    };

                    return (
                      <div key={priority} className="flex items-center gap-3">
                        <div className="w-16 text-xs text-gray-600 capitalize">
                          {priority}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`${colors[priority as keyof typeof colors]} h-2 rounded-full`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="w-6 text-xs text-gray-600 text-right">
                          {priorityTasks.length}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Completion Rate */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Completion Rate
                </h4>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-2 relative">
                    <svg
                      className="w-20 h-20 transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - (monthStats.totalTasks > 0 ? monthStats.completedTasks / monthStats.totalTasks : 0))}`}
                        className="text-green-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-900">
                        {monthStats.totalTasks > 0
                          ? Math.round(
                              (monthStats.completedTasks /
                                monthStats.totalTasks) *
                                100,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {monthStats.completedTasks} of {monthStats.totalTasks} tasks
                    completed
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PlannerLayout>
  );
}
