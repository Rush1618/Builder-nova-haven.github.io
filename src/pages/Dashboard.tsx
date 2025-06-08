import React, { useState, useEffect } from "react";
import PlannerLayout from "@/components/planner/PlannerLayout";
import TaskCard from "@/components/planner/TaskCard";
import ProgressChart from "@/components/planner/ProgressChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { storage } from "@/lib/storage";
import { Task, Goal, ClassSchedule, StudySession } from "@/types/planner";
import {
  getUpcomingDeadlines,
  getOverdueTasks,
  getScheduleForDay,
  formatTime,
  getCompletionStats,
  formatTaskDate,
} from "@/lib/planner-utils";
import {
  Calendar,
  Clock,
  Target,
  AlertTriangle,
  BookOpen,
  TrendingUp,
  Plus,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [schedule, setSchedule] = useState<ClassSchedule[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTasks(storage.getTasks());
    setGoals(storage.getGoals());
    setSchedule(storage.getSchedule());
    setStudySessions(storage.getStudySessions());
  };

  const handleToggleTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      storage.updateTask(taskId, { completed: !task.completed });
      loadData();
    }
  };

  const today = new Date();
  const todaySchedule = getScheduleForDay(schedule, today.getDay());
  const upcomingDeadlines = getUpcomingDeadlines(tasks, 7);
  const overdueTasks = getOverdueTasks(tasks);
  const stats = getCompletionStats(tasks, goals);

  // Today's tasks
  const todaysTasks = tasks.filter((task) => {
    const taskDate = new Date(task.dueDate);
    return taskDate.toDateString() === today.toDateString();
  });

  // Quick stats
  const quickStats = [
    {
      title: "Tasks Due Today",
      value: todaysTasks.length,
      subtitle: `${todaysTasks.filter((t) => t.completed).length} completed`,
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      title: "Overdue Tasks",
      value: overdueTasks.length,
      subtitle: "Need attention",
      icon: AlertTriangle,
      color: "bg-red-500",
    },
    {
      title: "Active Goals",
      value: goals.length,
      subtitle: `${stats.goalsOnTrack} on track`,
      icon: Target,
      color: "bg-green-500",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      subtitle: "This week",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  return (
    <PlannerLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Good{" "}
            {new Date().getHours() < 12
              ? "morning"
              : new Date().getHours() < 18
                ? "afternoon"
                : "evening"}
            ! 👋
          </h2>
          <p className="text-gray-600">
            Here's your study progress and what's coming up today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  </div>
                  <div className={`p-2 rounded-full ${stat.color}`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tasks and Schedule */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overdue Tasks Alert */}
            {overdueTasks.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-red-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Overdue Tasks ({overdueTasks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {overdueTasks.slice(0, 3).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleTask}
                      compact
                    />
                  ))}
                  {overdueTasks.length > 3 && (
                    <Link to="/tasks">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-red-700 hover:text-red-800"
                      >
                        View all {overdueTasks.length} overdue tasks
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Today's Tasks */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium">
                  Today's Tasks
                </CardTitle>
                <Link to="/tasks">
                  <Button variant="ghost" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Task
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {todaysTasks.length > 0 ? (
                  <>
                    {todaysTasks.slice(0, 4).map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggleComplete={handleToggleTask}
                        compact
                      />
                    ))}
                    {todaysTasks.length > 4 && (
                      <Link to="/daily">
                        <Button variant="ghost" size="sm" className="w-full">
                          View all {todaysTasks.length} tasks for today
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    )}
                  </>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No tasks due today</p>
                    <p className="text-xs text-gray-400">
                      Great job staying on top of things!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium">
                  Today's Schedule
                </CardTitle>
                <Link to="/timetable">
                  <Button variant="ghost" size="sm">
                    <Clock className="w-4 h-4 mr-1" />
                    Edit Schedule
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {todaySchedule.length > 0 ? (
                  <div className="space-y-2">
                    {todaySchedule.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.subject}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.startTime} - {item.endTime}
                            {item.room && ` • ${item.room}`}
                            {item.instructor && ` • ${item.instructor}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No classes scheduled today</p>
                    <p className="text-xs text-gray-400">
                      Enjoy your free day!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Progress and Upcoming */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <ProgressChart tasks={tasks} goals={goals} />

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium">
                  Upcoming Deadlines
                </CardTitle>
                <Link to="/tasks">
                  <Button variant="ghost" size="sm">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {upcomingDeadlines.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingDeadlines.slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            Due {formatTaskDate(task.dueDate)}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs px-1.5 py-0.5 h-auto"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No upcoming deadlines</p>
                    <p className="text-xs text-gray-400">
                      You're all caught up!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Goals */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium">
                  Active Goals
                </CardTitle>
                <Link to="/goals">
                  <Button variant="ghost" size="sm">
                    <Target className="w-4 h-4 mr-1" />
                    Manage Goals
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {goals.length > 0 ? (
                  <div className="space-y-4">
                    {goals.slice(0, 3).map((goal) => (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {goal.title}
                          </h4>
                          <span className="text-xs text-gray-500 ml-2">
                            {goal.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-black h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Target: {formatTaskDate(goal.targetDate)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Target className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No active goals</p>
                    <Link to="/goals">
                      <Button variant="outline" size="sm" className="mt-2">
                        Set Your First Goal
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PlannerLayout>
  );
}
