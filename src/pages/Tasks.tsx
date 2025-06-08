import React, { useState, useEffect } from "react";
import PlannerLayout from "@/components/planner/PlannerLayout";
import TaskCard from "@/components/planner/TaskCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { storage } from "@/lib/storage";
import { Task, FilterType } from "@/types/planner";
import { getOverdueTasks, isTaskDueSoon } from "@/lib/planner-utils";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // New task form state
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium" as Task["priority"],
    category: "study" as Task["category"],
    estimatedTime: "",
    tags: "",
  });

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, activeFilter, searchTerm]);

  const loadTasks = () => {
    const allTasks = storage.getTasks();
    setTasks(allTasks);
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // Apply status filter
    switch (activeFilter) {
      case "completed":
        filtered = filtered.filter((task) => task.completed);
        break;
      case "pending":
        filtered = filtered.filter((task) => !task.completed);
        break;
      case "overdue":
        filtered = getOverdueTasks(filtered);
        break;
      default:
        break;
    }

    // Sort by due date
    filtered.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    setFilteredTasks(filtered);
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate) return;

    const taskData = {
      title: newTask.title,
      description: newTask.description || undefined,
      dueDate: new Date(newTask.dueDate),
      priority: newTask.priority,
      category: newTask.category,
      completed: false,
      estimatedTime: newTask.estimatedTime
        ? parseInt(newTask.estimatedTime)
        : undefined,
      tags: newTask.tags
        ? newTask.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : undefined,
    };

    storage.addTask(taskData);
    resetForm();
    setIsAddDialogOpen(false);
    loadTasks();
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate.toISOString().split("T")[0],
      priority: task.priority,
      category: task.category,
      estimatedTime: task.estimatedTime?.toString() || "",
      tags: task.tags?.join(", ") || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateTask = () => {
    if (!editingTask || !newTask.title || !newTask.dueDate) return;

    const updates = {
      title: newTask.title,
      description: newTask.description || undefined,
      dueDate: new Date(newTask.dueDate),
      priority: newTask.priority,
      category: newTask.category,
      estimatedTime: newTask.estimatedTime
        ? parseInt(newTask.estimatedTime)
        : undefined,
      tags: newTask.tags
        ? newTask.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : undefined,
    };

    storage.updateTask(editingTask.id, updates);
    resetForm();
    setIsAddDialogOpen(false);
    setEditingTask(null);
    loadTasks();
  };

  const handleToggleTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      storage.updateTask(taskId, { completed: !task.completed });
      loadTasks();
    }
  };

  const handleDeleteTask = (taskId: string) => {
    storage.deleteTask(taskId);
    loadTasks();
  };

  const resetForm = () => {
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      category: "study",
      estimatedTime: "",
      tags: "",
    });
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingTask(null);
    resetForm();
  };

  const overdueTasks = getOverdueTasks(tasks);
  const dueSoonTasks = tasks.filter(
    (task) => !task.completed && isTaskDueSoon(task),
  );
  const completedTasks = tasks.filter((task) => task.completed);

  const filterCounts = {
    all: tasks.length,
    pending: tasks.filter((task) => !task.completed).length,
    completed: completedTasks.length,
    overdue: overdueTasks.length,
  };

  return (
    <PlannerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
            <p className="text-gray-600">Manage your assignments and to-dos</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={handleCloseDialog}>
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-gray-800 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingTask ? "Edit Task" : "Add New Task"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    placeholder="Enter task description (optional)"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="estimatedTime">Est. Time (min)</Label>
                    <Input
                      id="estimatedTime"
                      type="number"
                      value={newTask.estimatedTime}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          estimatedTime: e.target.value,
                        })
                      }
                      placeholder="30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) =>
                        setNewTask({
                          ...newTask,
                          priority: value as Task["priority"],
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newTask.category}
                      onValueChange={(value) =>
                        setNewTask({
                          ...newTask,
                          category: value as Task["category"],
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assignment">Assignment</SelectItem>
                        <SelectItem value="study">Study</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={newTask.tags}
                    onChange={(e) =>
                      setNewTask({ ...newTask, tags: e.target.value })
                    }
                    placeholder="math, homework, chapter1"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={editingTask ? handleUpdateTask : handleAddTask}
                  >
                    {editingTask ? "Update Task" : "Add Task"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Tasks
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tasks.length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {completedTasks.length}
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Due Soon</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {dueSoonTasks.length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">
                    {overdueTasks.length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Tabs
                value={activeFilter}
                onValueChange={(value) => setActiveFilter(value as FilterType)}
              >
                <TabsList>
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    All
                    <Badge variant="secondary" className="ml-1 h-4 text-xs">
                      {filterCounts.all}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="pending"
                    className="flex items-center gap-2"
                  >
                    Pending
                    <Badge variant="secondary" className="ml-1 h-4 text-xs">
                      {filterCounts.pending}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="flex items-center gap-2"
                  >
                    Completed
                    <Badge variant="secondary" className="ml-1 h-4 text-xs">
                      {filterCounts.completed}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="overdue"
                    className="flex items-center gap-2"
                  >
                    Overdue
                    <Badge variant="destructive" className="ml-1 h-4 text-xs">
                      {filterCounts.overdue}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {activeFilter === "all" && "All Tasks"}
              {activeFilter === "pending" && "Pending Tasks"}
              {activeFilter === "completed" && "Completed Tasks"}
              {activeFilter === "overdue" && "Overdue Tasks"}
              {searchTerm && ` matching "${searchTerm}"`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleTask}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "No tasks found" : "No tasks yet"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? "Try adjusting your search or filters"
                    : "Get started by creating your first task"}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Task
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PlannerLayout>
  );
}
