import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CalendarDays,
  Target,
  Clock,
  BookOpen,
  Settings,
  Home,
  Bell,
  Plus,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface PlannerLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "AI Assistant", href: "/", icon: Home },
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Daily Planner", href: "/daily", icon: Calendar },
  { name: "Weekly Planner", href: "/weekly", icon: CalendarDays },
  { name: "Monthly Planner", href: "/monthly", icon: CalendarDays },
  { name: "Tasks", href: "/tasks", icon: BookOpen },
  { name: "Timetable", href: "/timetable", icon: Clock },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function PlannerLayout({ children }: PlannerLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Study Planner
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Quick add section */}
        <div className="px-4 py-4 border-t border-gray-200">
          <Button
            size="sm"
            className="w-full bg-black hover:bg-gray-800 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Quick Add Task
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 lg:border-b-0">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-4 h-4" />
              </Button>

              {/* Page title - dynamically set based on route */}
              <h1 className="text-lg font-semibold text-gray-900 capitalize">
                {location.pathname === "/"
                  ? "Dashboard"
                  : location.pathname.slice(1).replace("-", " ")}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 w-2 h-2 p-0 text-xs"
                >
                  <span className="sr-only">2 notifications</span>
                </Badge>
              </Button>

              {/* Today's date */}
              <div className="hidden sm:block text-sm text-gray-500">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
