import React, { useState, useEffect } from "react";
import PlannerLayout from "@/components/planner/PlannerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { storage } from "@/lib/storage";
import { ClassSchedule } from "@/types/planner";
import { generateTimeSlots } from "@/lib/planner-utils";
import { Plus, Clock, Edit, Trash2, Calendar } from "lucide-react";

const DAYS_OF_WEEK = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 0, label: "Sunday" },
];

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#84cc16",
  "#ec4899",
  "#6366f1",
];

export default function Timetable() {
  const [schedule, setSchedule] = useState<ClassSchedule[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassSchedule | null>(null);

  // New class form state
  const [newClass, setNewClass] = useState({
    subject: "",
    instructor: "",
    room: "",
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "10:00",
    color: COLORS[0],
  });

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = () => {
    setSchedule(storage.getSchedule());
  };

  const handleAddClass = () => {
    if (!newClass.subject || !newClass.startTime || !newClass.endTime) return;

    const classData = {
      subject: newClass.subject,
      instructor: newClass.instructor || undefined,
      room: newClass.room || undefined,
      dayOfWeek: newClass.dayOfWeek,
      startTime: newClass.startTime,
      endTime: newClass.endTime,
      color: newClass.color,
      recurring: true,
    };

    storage.addScheduleItem(classData);
    resetForm();
    setIsAddDialogOpen(false);
    loadSchedule();
  };

  const handleEditClass = (classItem: ClassSchedule) => {
    setEditingClass(classItem);
    setNewClass({
      subject: classItem.subject,
      instructor: classItem.instructor || "",
      room: classItem.room || "",
      dayOfWeek: classItem.dayOfWeek,
      startTime: classItem.startTime,
      endTime: classItem.endTime,
      color: classItem.color,
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateClass = () => {
    if (
      !editingClass ||
      !newClass.subject ||
      !newClass.startTime ||
      !newClass.endTime
    )
      return;

    const updates = {
      subject: newClass.subject,
      instructor: newClass.instructor || undefined,
      room: newClass.room || undefined,
      dayOfWeek: newClass.dayOfWeek,
      startTime: newClass.startTime,
      endTime: newClass.endTime,
      color: newClass.color,
    };

    storage.updateScheduleItem(editingClass.id, updates);
    resetForm();
    setIsAddDialogOpen(false);
    setEditingClass(null);
    loadSchedule();
  };

  const handleDeleteClass = (classId: string) => {
    storage.deleteScheduleItem(classId);
    loadSchedule();
  };

  const resetForm = () => {
    setNewClass({
      subject: "",
      instructor: "",
      room: "",
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "10:00",
      color: COLORS[0],
    });
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingClass(null);
    resetForm();
  };

  // Generate time slots for the grid
  const timeSlots = generateTimeSlots(7, 21, 30); // 7 AM to 9 PM, 30-minute intervals

  // Group schedule by day
  const scheduleByDay = DAYS_OF_WEEK.reduce(
    (acc, day) => {
      acc[day.value] = schedule.filter((item) => item.dayOfWeek === day.value);
      return acc;
    },
    {} as Record<number, ClassSchedule[]>,
  );

  const getTimeSlotPosition = (time: string): number => {
    return timeSlots.indexOf(time);
  };

  const calculateClassHeight = (startTime: string, endTime: string): number => {
    const startIndex = getTimeSlotPosition(startTime);
    const endIndex = getTimeSlotPosition(endTime);
    return Math.max(1, endIndex - startIndex);
  };

  return (
    <PlannerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Timetable</h2>
            <p className="text-gray-600">Manage your weekly class schedule</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={handleCloseDialog}>
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-gray-800 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingClass ? "Edit Class" : "Add New Class"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={newClass.subject}
                    onChange={(e) =>
                      setNewClass({ ...newClass, subject: e.target.value })
                    }
                    placeholder="Mathematics, Physics, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instructor">Instructor</Label>
                    <Input
                      id="instructor"
                      value={newClass.instructor}
                      onChange={(e) =>
                        setNewClass({ ...newClass, instructor: e.target.value })
                      }
                      placeholder="Dr. Smith"
                    />
                  </div>

                  <div>
                    <Label htmlFor="room">Room</Label>
                    <Input
                      id="room"
                      value={newClass.room}
                      onChange={(e) =>
                        setNewClass({ ...newClass, room: e.target.value })
                      }
                      placeholder="Room 101"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dayOfWeek">Day of Week</Label>
                  <Select
                    value={newClass.dayOfWeek.toString()}
                    onValueChange={(value) =>
                      setNewClass({ ...newClass, dayOfWeek: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day) => (
                        <SelectItem
                          key={day.value}
                          value={day.value.toString()}
                        >
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newClass.startTime}
                      onChange={(e) =>
                        setNewClass({ ...newClass, startTime: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newClass.endTime}
                      onChange={(e) =>
                        setNewClass({ ...newClass, endTime: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Color</Label>
                  <div className="flex gap-2 mt-2">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-6 h-6 rounded-full border-2 ${
                          newClass.color === color
                            ? "border-gray-900"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewClass({ ...newClass, color })}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={editingClass ? handleUpdateClass : handleAddClass}
                  >
                    {editingClass ? "Update Class" : "Add Class"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Schedule Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Classes
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {schedule.length}
                  </p>
                  <p className="text-xs text-gray-500">Per week</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Busiest Day
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {schedule.length > 0
                      ? DAYS_OF_WEEK.find(
                          (day) =>
                            day.value ===
                            (Object.entries(scheduleByDay).sort(
                              ([, a], [, b]) => b.length - a.length,
                            )[0][0] as any),
                        )?.label || "None"
                      : "None"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.max(
                      ...Object.values(scheduleByDay).map(
                        (classes) => classes.length,
                      ),
                    )}{" "}
                    classes
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
                  <p className="text-sm font-medium text-gray-600">
                    Study Hours
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {schedule.reduce((total, item) => {
                      const [startHour, startMin] = item.startTime
                        .split(":")
                        .map(Number);
                      const [endHour, endMin] = item.endTime
                        .split(":")
                        .map(Number);
                      const duration =
                        endHour * 60 + endMin - (startHour * 60 + startMin);
                      return total + duration;
                    }, 0) / 60}
                    h
                  </p>
                  <p className="text-xs text-gray-500">Per week</p>
                </div>
                <Clock className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Timetable Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header */}
                <div className="grid grid-cols-8 gap-1 mb-4">
                  <div className="text-xs font-medium text-gray-500 p-2">
                    Time
                  </div>
                  {DAYS_OF_WEEK.map((day) => (
                    <div
                      key={day.value}
                      className="text-xs font-medium text-gray-900 p-2 text-center"
                    >
                      {day.label}
                    </div>
                  ))}
                </div>

                {/* Time Grid */}
                <div className="relative">
                  {/* Time labels */}
                  <div className="absolute left-0 top-0 w-16">
                    {timeSlots
                      .filter((_, index) => index % 2 === 0)
                      .map((time, index) => (
                        <div
                          key={time}
                          className="text-xs text-gray-500 py-2"
                          style={{ height: "48px" }}
                        >
                          {time}
                        </div>
                      ))}
                  </div>

                  {/* Grid background */}
                  <div className="ml-16 grid grid-cols-7 gap-1">
                    {DAYS_OF_WEEK.map((day) => (
                      <div
                        key={day.value}
                        className="relative border border-gray-100"
                        style={{ height: `${timeSlots.length * 24}px` }}
                      >
                        {/* Grid lines */}
                        {timeSlots.map((_, index) => (
                          <div
                            key={index}
                            className="absolute w-full border-t border-gray-50"
                            style={{ top: `${index * 24}px`, height: "24px" }}
                          />
                        ))}

                        {/* Classes */}
                        {scheduleByDay[day.value]?.map((classItem) => {
                          const startPos = getTimeSlotPosition(
                            classItem.startTime,
                          );
                          const height = calculateClassHeight(
                            classItem.startTime,
                            classItem.endTime,
                          );

                          return (
                            <div
                              key={classItem.id}
                              className="absolute left-0 right-0 mx-0.5 rounded-sm p-1 text-xs text-white cursor-pointer group"
                              style={{
                                backgroundColor: classItem.color,
                                top: `${startPos * 24}px`,
                                height: `${height * 24 - 2}px`,
                              }}
                              onClick={() => handleEditClass(classItem)}
                            >
                              <div className="font-medium truncate">
                                {classItem.subject}
                              </div>
                              <div className="text-xs opacity-90 truncate">
                                {classItem.startTime} - {classItem.endTime}
                              </div>
                              {classItem.room && (
                                <div className="text-xs opacity-75 truncate">
                                  {classItem.room}
                                </div>
                              )}

                              {/* Hover actions */}
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 text-white hover:bg-white hover:bg-opacity-20"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClass(classItem.id);
                                  }}
                                >
                                  <Trash2 className="w-2 h-2" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Class List */}
        {schedule.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {schedule
                  .sort(
                    (a, b) =>
                      a.dayOfWeek - b.dayOfWeek ||
                      a.startTime.localeCompare(b.startTime),
                  )
                  .map((classItem) => (
                    <div
                      key={classItem.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: classItem.color }}
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {classItem.subject}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {
                              DAYS_OF_WEEK.find(
                                (d) => d.value === classItem.dayOfWeek,
                              )?.label
                            }{" "}
                            • {classItem.startTime} - {classItem.endTime}
                            {classItem.room && ` • ${classItem.room}`}
                            {classItem.instructor &&
                              ` • ${classItem.instructor}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClass(classItem)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClass(classItem.id)}
                          className="hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {schedule.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No classes scheduled
                </h3>
                <p className="text-gray-600 mb-4">
                  Add your first class to start building your weekly timetable
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Class
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PlannerLayout>
  );
}
