import React, { useState, useEffect } from "react";
import PlannerLayout from "@/components/planner/PlannerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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
import { Checkbox } from "@/components/ui/checkbox";
import { storage } from "@/lib/storage";
import { Goal, Milestone } from "@/types/planner";
import {
  calculateGoalProgress,
  formatTaskDate,
  getGoalCategoryColor,
} from "@/lib/planner-utils";
import {
  Plus,
  Target,
  Calendar,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
} from "lucide-react";

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // New goal form state
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetDate: "",
    category: "academic" as Goal["category"],
    milestones: [] as { title: string; dueDate?: string }[],
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    setGoals(storage.getGoals());
  };

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetDate) return;

    const goalData = {
      title: newGoal.title,
      description: newGoal.description || undefined,
      targetDate: new Date(newGoal.targetDate),
      category: newGoal.category,
      progress: 0,
      milestones: newGoal.milestones.map((m) => ({
        id: crypto.randomUUID(),
        title: m.title,
        completed: false,
        dueDate: m.dueDate ? new Date(m.dueDate) : undefined,
      })),
    };

    storage.addGoal(goalData);
    resetForm();
    setIsAddDialogOpen(false);
    loadGoals();
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setNewGoal({
      title: goal.title,
      description: goal.description || "",
      targetDate: goal.targetDate.toISOString().split("T")[0],
      category: goal.category,
      milestones: goal.milestones.map((m) => ({
        title: m.title,
        dueDate: m.dueDate?.toISOString().split("T")[0],
      })),
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateGoal = () => {
    if (!editingGoal || !newGoal.title || !newGoal.targetDate) return;

    const updates = {
      title: newGoal.title,
      description: newGoal.description || undefined,
      targetDate: new Date(newGoal.targetDate),
      category: newGoal.category,
      milestones: newGoal.milestones.map((m) => ({
        id: crypto.randomUUID(),
        title: m.title,
        completed: false,
        dueDate: m.dueDate ? new Date(m.dueDate) : undefined,
      })),
    };

    storage.updateGoal(editingGoal.id, updates);
    resetForm();
    setIsAddDialogOpen(false);
    setEditingGoal(null);
    loadGoals();
  };

  const handleDeleteGoal = (goalId: string) => {
    storage.deleteGoal(goalId);
    loadGoals();
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const updatedMilestones = goal.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m,
    );

    const progress = calculateGoalProgress({
      ...goal,
      milestones: updatedMilestones,
    });

    storage.updateGoal(goalId, {
      milestones: updatedMilestones,
      progress,
    });
    loadGoals();
  };

  const handleUpdateProgress = (goalId: string, progress: number) => {
    storage.updateGoal(goalId, { progress });
    loadGoals();
  };

  const addMilestone = () => {
    setNewGoal({
      ...newGoal,
      milestones: [...newGoal.milestones, { title: "" }],
    });
  };

  const removeMilestone = (index: number) => {
    setNewGoal({
      ...newGoal,
      milestones: newGoal.milestones.filter((_, i) => i !== index),
    });
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    const updatedMilestones = newGoal.milestones.map((milestone, i) =>
      i === index ? { ...milestone, [field]: value } : milestone,
    );
    setNewGoal({ ...newGoal, milestones: updatedMilestones });
  };

  const resetForm = () => {
    setNewGoal({
      title: "",
      description: "",
      targetDate: "",
      category: "academic",
      milestones: [],
    });
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingGoal(null);
    resetForm();
  };

  const activeGoals = goals.filter((goal) => goal.progress < 100);
  const completedGoals = goals.filter((goal) => goal.progress === 100);

  return (
    <PlannerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Goals</h2>
            <p className="text-gray-600">
              Set and track your academic and personal goals
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={handleCloseDialog}>
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-gray-800 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingGoal ? "Edit Goal" : "Add New Goal"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Goal Title *</Label>
                  <Input
                    id="title"
                    value={newGoal.title}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, title: e.target.value })
                    }
                    placeholder="Enter your goal"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newGoal.description}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, description: e.target.value })
                    }
                    placeholder="Describe your goal in detail"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="targetDate">Target Date *</Label>
                    <Input
                      id="targetDate"
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, targetDate: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newGoal.category}
                      onValueChange={(value) =>
                        setNewGoal({
                          ...newGoal,
                          category: value as Goal["category"],
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="skill">Skill</SelectItem>
                        <SelectItem value="career">Career</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Milestones</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addMilestone}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>

                  {newGoal.milestones.map((milestone, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        placeholder="Milestone title"
                        value={milestone.title}
                        onChange={(e) =>
                          updateMilestone(index, "title", e.target.value)
                        }
                        className="flex-1"
                      />
                      <Input
                        type="date"
                        value={milestone.dueDate || ""}
                        onChange={(e) =>
                          updateMilestone(index, "dueDate", e.target.value)
                        }
                        className="w-40"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMilestone(index)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={editingGoal ? handleUpdateGoal : handleAddGoal}
                  >
                    {editingGoal ? "Update Goal" : "Add Goal"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Goals Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Goals
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {goals.length}
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
                    Active Goals
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {activeGoals.length}
                  </p>
                </div>
                <Circle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {completedGoals.length}
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">
                          {goal.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getGoalCategoryColor(goal.category)}`}
                        >
                          {goal.category}
                        </Badge>
                      </div>
                      {goal.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {goal.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Target: {formatTaskDate(goal.targetDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          <span>{goal.progress}% complete</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditGoal(goal)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="hover:bg-red-100 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <Progress value={goal.progress} className="h-2" />
                  </div>

                  {/* Manual Progress Adjustment */}
                  <div className="flex items-center gap-2 mb-3">
                    <Label className="text-xs">Update progress:</Label>
                    <Input
                      type="range"
                      min="0"
                      max="100"
                      value={goal.progress}
                      onChange={(e) =>
                        handleUpdateProgress(goal.id, parseInt(e.target.value))
                      }
                      className="flex-1 h-2"
                    />
                    <span className="text-xs font-medium w-8">
                      {goal.progress}%
                    </span>
                  </div>

                  {/* Milestones */}
                  {goal.milestones.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-700 mb-2">
                        Milestones (
                        {goal.milestones.filter((m) => m.completed).length}/
                        {goal.milestones.length})
                      </h4>
                      <div className="space-y-1">
                        {goal.milestones.map((milestone) => (
                          <div
                            key={milestone.id}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              checked={milestone.completed}
                              onCheckedChange={() =>
                                handleToggleMilestone(goal.id, milestone.id)
                              }
                              className="w-3 h-3"
                            />
                            <span
                              className={`text-xs flex-1 ${milestone.completed ? "line-through text-gray-500" : "text-gray-700"}`}
                            >
                              {milestone.title}
                            </span>
                            {milestone.dueDate && (
                              <span className="text-xs text-gray-500">
                                {formatTaskDate(milestone.dueDate)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-green-700">
                Completed Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="border border-green-200 bg-green-50 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-green-900">
                        {goal.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="text-xs text-green-700 border-green-300"
                        >
                          {goal.category}
                        </Badge>
                        <span className="text-xs text-green-600">
                          Completed {formatTaskDate(goal.targetDate)}
                        </span>
                      </div>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {goals.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No goals yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by setting your first goal to track your progress
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Set Your First Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PlannerLayout>
  );
}
