import React, { useState, useEffect } from "react";
import PlannerLayout from "@/components/planner/PlannerLayout";
import TaskCard from "@/components/planner/TaskCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { storage } from "@/lib/storage";
import { Task, ClassSchedule } from "@/types/planner";
import {
  getTasksForWeek,
  getDaysInWeek,
  getScheduleForDay,
  formatTaskDate,
} from "@/lib/planner-utils";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarDays,
} from "lucide-react";
import { format, startOfWeek, isToday, isSameDay } from "date-fns";

export default function WeeklyPlanner() {
  const [selectedWeek, setSelectedWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedule, setSchedule] = useState<ClassSchedule[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTasks(storage.getTasks());
    setSchedule(storage.getSchedule());
  };

  const handleToggleTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      storage.updateTask(taskId, { completed: !task.completed });
      loadData();
    }
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const days = direction === "prev" ? -7 : 7;
    setSelectedWeek(
      new Date(selectedWeek.getTime() + days * 24 * 60 * 60 * 1000),
    );
  };

  const goToCurrentWeek = () => {
    setSelectedWeek(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const weekDays = getDaysInWeek(selectedWeek, 1);
  const weekTasks = getTasksForWeek(tasks, selectedWeek, 1);

  // Group tasks by day
  const tasksByDay = weekDays.reduce(
    (acc, day) => {
      acc[day.toISOString().split("T")[0]] = tasks.filter((task) =>
        isSameDay(task.dueDate, day),
      );
      return acc;
    },
    {} as Record<string, Task[]>,
  );

  // Group schedule by day
  const scheduleByDay = weekDays.reduce(
    (acc, day) => {
      acc[day.toISOString().split("T")[0]] = getScheduleForDay(
        schedule,
        day.getDay(),
      );
      return acc;
    },
    {} as Record<string, ClassSchedule[]>,
  );

  const weekStats = {
    totalTasks: weekTasks.length,
    completedTasks: weekTasks.filter((task) => task.completed).length,
    totalClasses: Object.values(scheduleByDay).flat().length,
  };

  return (
    <PlannerLayout>
      <div className="space-y-6">
        {/* Header with Week Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek("prev")}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="text-center min-w-[300px]">
                <h2 className="text-xl font-bold text-gray-900">
                  {format(weekDays[0], "MMM d")} -{" "}
                  {format(weekDays[6], "MMM d, yyyy")}
                </h2>
                <p className="text-sm text-gray-600">
                  Week{" "}
                  {Math.ceil(
                    (weekDays[0].getTime() -
                      new Date(weekDays[0].getFullYear(), 0, 1).getTime()) /
                      (7 * 24 * 60 * 60 * 1000),
                  )}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek("next")}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
              Current Week
            </Button>
            <Button size="sm" className="bg-black hover:bg-gray-800 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tasks This Week
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {weekStats.totalTasks}
                  </p>
                  <p className="text-xs text-gray-500">
                    {weekStats.completedTasks} completed
                  </p>
                </div>
                <CalendarDays className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Completion Rate
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {weekStats.totalTasks > 0
                      ? Math.round(
                          (weekStats.completedTasks / weekStats.totalTasks) *
                            100,
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-gray-500">This week</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {weekStats.totalTasks > 0
                      ? Math.round(
                          (weekStats.completedTasks / weekStats.totalTasks) *
                            100,
                        )
                      : 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Classes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {weekStats.totalClasses}
                  </p>
                  <p className="text-xs text-gray-500">Scheduled</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const dayKey = day.toISOString().split("T")[0];
            const dayTasks = tasksByDay[dayKey] || [];
            const daySchedule = scheduleByDay[dayKey] || [];
            const isCurrentDay = isToday(day);

            return (
              <Card
                key={dayKey}
                className={isCurrentDay ? "ring-2 ring-blue-500" : ""}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {format(day, "EEEE")}
                      </div>
                      <div
                        className={`text-lg font-bold ${isCurrentDay ? "text-blue-600" : "text-gray-700"}`}
                      >
                        {format(day, "d")}
                      </div>
                    </div>
                    {isCurrentDay && (
                      <Badge variant="default" className="bg-blue-500">
                        Today
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Schedule Items */}
                  {daySchedule.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-600 mb-2">
                        Classes
                      </h4>
                      <div className="space-y-1">
                        {daySchedule.map((item) => (
                          <div
                            key={item.id}
                            className="p-2 rounded text-xs text-white"
                            style={{ backgroundColor: item.color }}
                          >
                            <div className="font-medium">{item.subject}</div>
                            <div className="text-xs opacity-90">
                              {item.startTime} - {item.endTime}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tasks */}
                  {dayTasks.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-600 mb-2">
                        Tasks ({dayTasks.filter((t) => !t.completed).length}{" "}
                        pending)
                      </h4>
                      <div className="space-y-2">
                        {dayTasks.slice(0, 3).map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onToggleComplete={handleToggleTask}
                            compact
                            showActions={false}
                          />
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="text-xs text-gray-500 text-center py-1">
                            +{dayTasks.length - 3} more tasks
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {dayTasks.length === 0 && daySchedule.length === 0 && (
                    <div className="text-center py-4 text-gray-400">
                      <Calendar className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-xs">No events</p>
                    </div>
                  )}

                  {/* Quick Add Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-6 text-xs text-gray-500 border-dashed border border-gray-300 hover:border-gray-400"
                  >
                    + Add task
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Week Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* All Week Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Tasks This Week</CardTitle>
            </CardHeader>
            <CardContent>
              {weekTasks.length > 0 ? (
                <div className="space-y-3">
                  {weekTasks
                    .sort((a, b) => {
                      if (a.completed !== b.completed) {
                        return a.completed ? 1 : -1;
                      }
                      return (
                        new Date(a.dueDate).getTime() -
                        new Date(b.dueDate).getTime()
                      );
                    })
                    .map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggleComplete={handleToggleTask}
                        compact
                      />
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CalendarDays className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">No tasks scheduled this week</p>
                  <p className="text-xs text-gray-400">Enjoy your free time!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Week Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Week Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Task Distribution by Day */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Task Distribution
                </h4>
                <div className="space-y-2">
                  {weekDays.map((day) => {
                    const dayKey = day.toISOString().split("T")[0];
                    const dayTaskCount = tasksByDay[dayKey]?.length || 0;
                    const maxTasks = Math.max(
                      ...Object.values(tasksByDay).map((tasks) => tasks.length),
                    );
                    const percentage =
                      maxTasks > 0 ? (dayTaskCount / maxTasks) * 100 : 0;

                    return (
                      <div key={dayKey} className="flex items-center gap-3">
                        <div className="w-16 text-xs text-gray-600">
                          {format(day, "EEE")}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="w-8 text-xs text-gray-600 text-right">
                          {dayTaskCount}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Priority Breakdown */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Priority Breakdown
                </h4>
                <div className="space-y-2">
                  {["high", "medium", "low"].map((priority) => {
                    const priorityTasks = weekTasks.filter(
                      (task) => task.priority === priority,
                    );
                    const percentage =
                      weekTasks.length > 0
                        ? (priorityTasks.length / weekTasks.length) * 100
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
                        <div className="w-8 text-xs text-gray-600 text-right">
                          {priorityTasks.length}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PlannerLayout>
  );
}
