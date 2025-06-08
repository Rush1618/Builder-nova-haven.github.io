import React from "react";
import { Task } from "@/types/planner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  formatTaskDate,
  getTaskPriorityColor,
  getTaskCategoryColor,
  isTaskOverdue,
  isTaskDueSoon,
} from "@/lib/planner-utils";
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Edit,
  Trash2,
} from "lucide-react";

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  compact?: boolean;
  showActions?: boolean;
}

export default function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  compact = false,
  showActions = true,
}: TaskCardProps) {
  const isOverdue = isTaskOverdue(task);
  const isDueSoon = isTaskDueSoon(task);

  const handleToggleComplete = () => {
    onToggleComplete?.(task.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(task.id);
  };

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md group",
        task.completed && "opacity-75",
        isOverdue && !task.completed && "border-red-200 bg-red-50/30",
        compact ? "p-3" : "p-4",
      )}
    >
      <CardContent className={compact ? "p-0" : "p-0"}>
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div className="pt-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={handleToggleComplete}
              className={cn(
                "w-4 h-4",
                task.completed &&
                  "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600",
              )}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h3
                  className={cn(
                    "font-medium text-sm leading-tight",
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-gray-900",
                  )}
                >
                  {task.title}
                </h3>

                {/* Description */}
                {task.description && !compact && (
                  <p
                    className={cn(
                      "text-xs mt-1 leading-relaxed",
                      task.completed ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    {task.description}
                  </p>
                )}

                {/* Meta information */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {/* Due date */}
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs",
                      isOverdue && !task.completed
                        ? "text-red-600"
                        : isDueSoon && !task.completed
                          ? "text-orange-600"
                          : "text-gray-500",
                    )}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>{formatTaskDate(task.dueDate)}</span>
                    {isOverdue && !task.completed && (
                      <AlertCircle className="w-3 h-3" />
                    )}
                  </div>

                  {/* Estimated time */}
                  {task.estimatedTime && !compact && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{task.estimatedTime}m</span>
                    </div>
                  )}

                  {/* Priority badge */}
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs px-1.5 py-0.5 h-auto",
                      getTaskPriorityColor(task.priority),
                    )}
                  >
                    {task.priority}
                  </Badge>

                  {/* Category badge */}
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs px-1.5 py-0.5 h-auto capitalize",
                      getTaskCategoryColor(task.category),
                    )}
                  >
                    {task.category}
                  </Badge>

                  {/* Completion status */}
                  {task.completed && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {task.tags && task.tags.length > 0 && !compact && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {task.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs px-1.5 py-0.5 h-auto bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              {showActions && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="h-6 w-6 p-0 hover:bg-gray-100"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
