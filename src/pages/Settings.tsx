import React, { useState, useEffect } from "react";
import PlannerLayout from "@/components/planner/PlannerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { storage } from "@/lib/storage";
import { PlannerSettings } from "@/types/planner";
import { exportToCSV } from "@/lib/planner-utils";
import {
  Download,
  Upload,
  Trash2,
  Save,
  Settings as SettingsIcon,
} from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState<PlannerSettings>({
    theme: "light",
    weekStartsOn: 1,
    defaultView: "daily",
    notifications: {
      enabled: true,
      deadlineReminders: [24, 2],
      studySessionReminders: true,
    },
    ui: {
      fontSize: "medium",
      compactMode: false,
    },
  });

  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    setSettings(storage.getSettings());
  };

  const handleUpdateSettings = (updates: Partial<PlannerSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    storage.updateSettings(updates);
  };

  const handleExportData = () => {
    if (exportFormat === "json") {
      const data = storage.exportData();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `study-planner-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const tasks = storage.getTasks();
      exportToCSV(
        tasks,
        `tasks-export-${new Date().toISOString().split("T")[0]}.csv`,
      );
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        if (storage.importData(data)) {
          alert("Data imported successfully!");
          window.location.reload(); // Refresh to show imported data
        } else {
          alert("Failed to import data. Please check the file format.");
        }
      } catch (error) {
        alert("Failed to import data. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (
      confirm(
        "Are you sure you want to clear all data? This action cannot be undone.",
      )
    ) {
      storage.clearAllData();
      alert("All data has been cleared.");
      window.location.reload();
    }
  };

  return (
    <PlannerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600">
            Customize your study planner experience
          </p>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value) =>
                    handleUpdateSettings({
                      theme: value as PlannerSettings["theme"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weekStart">Week Starts On</Label>
                <Select
                  value={settings.weekStartsOn.toString()}
                  onValueChange={(value) =>
                    handleUpdateSettings({
                      weekStartsOn: parseInt(value) as 0 | 1,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Monday</SelectItem>
                    <SelectItem value="0">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultView">Default View</Label>
                <Select
                  value={settings.defaultView}
                  onValueChange={(value) =>
                    handleUpdateSettings({
                      defaultView: value as PlannerSettings["defaultView"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Planner</SelectItem>
                    <SelectItem value="weekly">Weekly Planner</SelectItem>
                    <SelectItem value="monthly">Monthly Planner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Select
                  value={settings.ui.fontSize}
                  onValueChange={(value) =>
                    handleUpdateSettings({
                      ui: {
                        ...settings.ui,
                        fontSize: value as PlannerSettings["ui"]["fontSize"],
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <Label htmlFor="compactMode" className="text-sm font-medium">
                  Compact Mode
                </Label>
                <p className="text-xs text-gray-500">
                  Use more condensed layout to fit more content
                </p>
              </div>
              <Switch
                id="compactMode"
                checked={settings.ui.compactMode}
                onCheckedChange={(checked) =>
                  handleUpdateSettings({
                    ui: { ...settings.ui, compactMode: checked },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <Label htmlFor="notifications" className="text-sm font-medium">
                  Enable Notifications
                </Label>
                <p className="text-xs text-gray-500">
                  Receive reminders for tasks and deadlines
                </p>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications.enabled}
                onCheckedChange={(checked) =>
                  handleUpdateSettings({
                    notifications: {
                      ...settings.notifications,
                      enabled: checked,
                    },
                  })
                }
              />
            </div>

            {settings.notifications.enabled && (
              <>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <Label
                      htmlFor="studyReminders"
                      className="text-sm font-medium"
                    >
                      Study Session Reminders
                    </Label>
                    <p className="text-xs text-gray-500">
                      Get notified before scheduled study sessions
                    </p>
                  </div>
                  <Switch
                    id="studyReminders"
                    checked={settings.notifications.studySessionReminders}
                    onCheckedChange={(checked) =>
                      handleUpdateSettings({
                        notifications: {
                          ...settings.notifications,
                          studySessionReminders: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <Label className="text-sm font-medium">
                    Deadline Reminders
                  </Label>
                  <p className="text-xs text-gray-500 mb-3">
                    Choose when to receive deadline reminders
                  </p>

                  <div className="space-y-2">
                    {[1, 2, 6, 24, 48].map((hours) => (
                      <div key={hours} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`reminder-${hours}`}
                          checked={settings.notifications.deadlineReminders.includes(
                            hours,
                          )}
                          onChange={(e) => {
                            const newReminders = e.target.checked
                              ? [
                                  ...settings.notifications.deadlineReminders,
                                  hours,
                                ]
                              : settings.notifications.deadlineReminders.filter(
                                  (h) => h !== hours,
                                );

                            handleUpdateSettings({
                              notifications: {
                                ...settings.notifications,
                                deadlineReminders: newReminders,
                              },
                            });
                          }}
                          className="rounded border-gray-300"
                        />
                        <Label
                          htmlFor={`reminder-${hours}`}
                          className="text-sm"
                        >
                          {hours === 1
                            ? "1 hour"
                            : hours < 24
                              ? `${hours} hours`
                              : `${hours / 24} day${hours > 24 ? "s" : ""}`}{" "}
                          before
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Export Data */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Export Data</h4>
              <p className="text-sm text-gray-600 mb-3">
                Download your planner data as a backup
              </p>

              <div className="flex items-center gap-3">
                <Select
                  value={exportFormat}
                  onValueChange={(value) =>
                    setExportFormat(value as "json" | "csv")
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={handleExportData} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Import Data */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Import Data</h4>
              <p className="text-sm text-gray-600 mb-3">
                Restore your planner data from a backup file
              </p>

              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-file"
                />
                <Button variant="outline" asChild>
                  <label htmlFor="import-file" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Import JSON
                  </label>
                </Button>
              </div>
            </div>

            {/* Clear All Data */}
            <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2">Clear All Data</h4>
              <p className="text-sm text-red-700 mb-3">
                Permanently delete all your planner data. This action cannot be
                undone.
              </p>

              <Button
                onClick={handleClearAllData}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Study Planner</strong> - A comprehensive planning
                application inspired by Olive Notion's Ultimate Student Planner.
              </p>
              <p>
                Version 1.0.0 - Built with React, TypeScript, and modern web
                technologies.
              </p>
              <p>
                All data is stored locally in your browser and is never sent to
                external servers.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PlannerLayout>
  );
}
