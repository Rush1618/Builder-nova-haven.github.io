import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Task, Goal } from "@/types/planner";
import { getCompletionStats } from "@/lib/planner-utils";

interface ProgressChartProps {
  tasks: Task[];
  goals: Goal[];
  className?: string;
}

export default function ProgressChart({
  tasks,
  goals,
  className,
}: ProgressChartProps) {
  const stats = getCompletionStats(tasks, goals);

  // Weekly progress data (mock data for now - in real app, this would come from historical data)
  const weeklyData = [
    { day: "Mon", completed: 5 },
    { day: "Tue", completed: 3 },
    { day: "Wed", completed: 8 },
    { day: "Thu", completed: 6 },
    { day: "Fri", completed: 4 },
    { day: "Sat", completed: 2 },
    { day: "Sun", completed: 1 },
  ];

  // Task categories breakdown
  const categoryData = tasks.reduce(
    (acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"];

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Tasks Completed</span>
                <span>
                  {stats.tasksCompleted}/{stats.totalTasks}
                </span>
              </div>
              <Progress value={stats.completionRate} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Goals On Track</span>
                <span>
                  {stats.goalsOnTrack}/{stats.totalGoals}
                </span>
              </div>
              <Progress
                value={
                  stats.totalGoals > 0
                    ? (stats.goalsOnTrack / stats.totalGoals) * 100
                    : 0
                }
                className="h-2"
              />
            </div>

            <div className="pt-2 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.completionRate}%
                </div>
                <div className="text-xs text-gray-500">Completion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar dataKey="completed" fill="#000000" radius={2} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Categories */}
        {pieData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Task Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="flex flex-wrap gap-2 mt-2">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-xs text-gray-600">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Goal Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {goals.slice(0, 3).map((goal) => (
              <div key={goal.id}>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span className="truncate">{goal.title}</span>
                  <span>{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}

            {goals.length === 0 && (
              <div className="text-center text-xs text-gray-500 py-4">
                No active goals yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
