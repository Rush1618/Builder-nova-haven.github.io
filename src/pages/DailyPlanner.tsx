import React, { useState, useEffect } from "react";
import PlannerLayout from "@/components/planner/PlannerLayout";
import TaskCard from "@/components/planner/TaskCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { storage } from "@/lib/storage";
import { Task, ClassSchedule, StudySession } from "@/types/planner";
import {
  getTasksForDate,
  getScheduleForDay,
  getStudySessionsForDate,
  formatTime,
} from "@/lib/planner-utils";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  BookOpen,
} from "lucide-react";
import { format, addDays, subDays, isToday } from "date-fns";

export default function DailyPlanner() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedule, setSchedule] = useState<ClassSchedule[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTasks(storage.getTasks());
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

  const navigateDate = (direction: "prev" | "next") => {
    setSelectedDate(
      direction === "prev"
        ? subDays(selectedDate, 1)
        : addDays(selectedDate, 1),
    );
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const dayTasks = getTasksForDate(tasks, selectedDate);
  const daySchedule = getScheduleForDay(schedule, selectedDate.getDay());
  const daySessions = getStudySessionsForDate(studySessions, selectedDate);

  // Combine schedule and sessions into timeline
  const timelineItems = [
    ...daySchedule.map((item) => ({
      id: item.id,
      type: "class" as const,
      title: item.subject,
      subtitle: item.instructor || item.room,
      startTime: item.startTime,
      endTime: item.endTime,
      color: item.color,
    })),
    ...daySessions.map((session) => ({
      id: session.id,
      type: "study" as const,
      title: `Study: ${session.subject}`,
      subtitle: session.notes,
      startTime: format(session.startTime, "HH:mm"),
      endTime: format(session.endTime, "HH:mm"),
      color: "#8b5cf6",
    })),
  ].sort((a, b) => a.startTime.localeCompare(b.startTime));

  const completedTasks = dayTasks.filter((task) => task.completed);
  const pendingTasks = dayTasks.filter((task) => !task.completed);

  return (
    <PlannerLayout>
      <div className="space-y-6">
        {/* Header with Date Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("prev")}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="text-center min-w-[200px]">
                <h2 className="text-xl font-bold text-gray-900">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </h2>
                {isToday(selectedDate) && (
                  <Badge variant="secondary" className="mt-1">
                    Today
                  </Badge>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("next")}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isToday(selectedDate) && (
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
            )}
            <Button size="sm" className="bg-black hover:bg-gray-800 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Daily Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dayTasks.length}
                  </p>
                  <p className="text-xs text-gray-500">
                    {completedTasks.length} completed
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
                  <p className="text-sm font-medium text-gray-600">Classes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {daySchedule.length}
                  </p>
                  <p className="text-xs text-gray-500">
                    {daySchedule.length > 0
                      ? `${daySchedule[0].startTime} - ${daySchedule[daySchedule.length - 1].endTime}`
                      : "No classes"}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Study Sessions
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {daySessions.length}
                  </p>
                  <p className="text-xs text-gray-500">
                    {daySessions
                      .reduce((total, session) => {
                        const duration =
                          (session.endTime.getTime() -
                            session.startTime.getTime()) /
                          (1000 * 60);
                        return total + duration;
                      }, 0)
                      .toFixed(0)}{" "}
                    minutes total
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Daily Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timelineItems.length > 0 ? (
                <div className="space-y-4">
                  {timelineItems.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="flex items-start gap-3"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="w-px h-8 bg-gray-200 mt-1" />
                      </div>

                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
                            {item.title}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {item.type === "class" ? "Class" : "Study"}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 mt-1">
                          {item.startTime} - {item.endTime}
                        </p>

                        {item.subtitle && (
                          <p className="text-xs text-gray-500 mt-1">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">No scheduled events</p>
                  <p className="text-xs text-gray-400">
                    Add classes or study sessions to see them here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Tasks Due Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dayTasks.length > 0 ? (
                <div className="space-y-3">
                  {/* Pending Tasks */}
                  {pendingTasks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Pending ({pendingTasks.length})
                      </h4>
                      <div className="space-y-2">
                        {pendingTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onToggleComplete={handleToggleTask}
                            compact
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Completed Tasks */}
                  {completedTasks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Completed ({completedTasks.length})
                      </h4>
                      <div className="space-y-2">
                        {completedTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onToggleComplete={handleToggleTask}
                            compact
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">No tasks due today</p>
                  <p className="text-xs text-gray-400">
                    Great! You can focus on your scheduled activities
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 justify-start">
                <div className="text-left">
                  <div className="font-medium">Add Task</div>
                  <div className="text-xs text-gray-500">
                    Create a new task for today
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto p-4 justify-start">
                <div className="text-left">
                  <div className="font-medium">Schedule Study Session</div>
                  <div className="text-xs text-gray-500">
                    Block time for focused study
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto p-4 justify-start">
                <div className="text-left">
                  <div className="font-medium">Review Progress</div>
                  <div className="text-xs text-gray-500">
                    Check your daily achievements
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Daily Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full h-24 p-3 text-sm border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder={`Notes for ${format(selectedDate, "MMMM d, yyyy")}...`}
            />
            <div className="flex justify-end mt-2">
              <Button size="sm" variant="outline">
                Save Notes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PlannerLayout>
  );
}
