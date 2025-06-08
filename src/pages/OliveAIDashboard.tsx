import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SyllabusParser } from "@/lib/syllabus-parser";
import { ParsedSyllabus } from "@/types/syllabus";
import { Upload, Settings, Search, Quote, BookOpen, Star } from "lucide-react";

export default function OliveAIDashboard() {
  const [syllabi, setSyllabi] = useState<ParsedSyllabus[]>([]);

  // Mock data matching the Olive Notion design exactly
  const wednesdayTasks = [
    { id: "1", title: "7:30 Calculus A", completed: false, tag: "Math" },
    { id: "2", title: "9:15 Math A", completed: false, tag: "Math" },
    { id: "3", title: "11:00 English A", completed: false, tag: "English" },
    { id: "4", title: "13:30 Biology A", completed: false, tag: "Biology" },
    { id: "5", title: "15:30 Math B", completed: false, tag: "Math" },
  ];

  const thursdayTasks = [
    { id: "6", title: "7:30 First Year A", completed: false, tag: "General" },
    { id: "7", title: "11:00 English A", completed: false, tag: "English" },
    { id: "8", title: "13:00 Math A", completed: false, tag: "Math" },
    { id: "9", title: "15:00 English B", completed: false, tag: "English" },
  ];

  const weeklyTodos = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const subjects = [
    { name: "Calculus", icon: "📐" },
    { name: "Chemistry", icon: "🧪" },
    { name: "History", icon: "📚" },
    { name: "Science", icon: "🔬" },
  ];

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    try {
      const syllabus = await SyllabusParser.parsePDF(file);
      setSyllabi((prev) => [...prev, syllabus]);
      localStorage.setItem(
        "ai-syllabi",
        JSON.stringify([...syllabi, syllabus]),
      );
    } catch (error) {
      console.error("Error parsing syllabus:", error);
      alert("Error parsing syllabus. Please try again.");
    }
  };

  const getTagColor = (tag: string) => {
    const colors = {
      Math: "text-blue-400 bg-blue-400/10",
      English: "text-green-400 bg-green-400/10",
      Biology: "text-purple-400 bg-purple-400/10",
      General: "text-yellow-400 bg-yellow-400/10",
    };
    return colors[tag as keyof typeof colors] || "text-gray-400 bg-gray-400/10";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nature Header - Exact match to the image */}
      <div className="h-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800">
          {/* Nature pattern overlay */}
          <div className="absolute inset-0 opacity-50">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
        </div>

        {/* Header content */}
        <div className="relative z-10 flex items-center justify-between h-full px-8">
          <h1 className="text-2xl font-semibold text-white">
            Ultimate Student Planner
          </h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 p-2"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 p-2"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <label htmlFor="syllabus-upload" className="cursor-pointer">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10 p-2"
              >
                <Upload className="w-5 h-5" />
              </Button>
              <input
                id="syllabus-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Main Content - Exact grid layout */}
      <div className="p-8">
        <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* Left Column - Date Cards */}
          <div className="col-span-2 space-y-4">
            {/* Date Card 11 */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-center shadow-xl">
              <div className="text-6xl font-bold text-white mb-2">11</div>
              <div className="text-sm text-white/90 uppercase tracking-wider font-medium">
                DEC
              </div>
              <div className="text-xs text-white/75 mt-3 uppercase font-semibold">
                TODAY
              </div>
            </div>

            {/* Date Card 10 */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 text-center shadow-xl">
              <div className="text-6xl font-bold text-white mb-2">10</div>
              <div className="text-sm text-white/90 uppercase tracking-wider font-medium">
                DEC
              </div>
              <div className="text-xs text-white/75 mt-3 uppercase font-semibold">
                TOMORROW
              </div>
            </div>
          </div>

          {/* Center Column - Task Lists */}
          <div className="col-span-7 space-y-6">
            {/* Task Lists Row */}
            <div className="grid grid-cols-2 gap-6">
              {/* Wednesday Tasks */}
              <div className="bg-gray-900/80 backdrop-blur rounded-2xl p-6 border border-gray-800/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h3 className="text-white font-semibold text-lg">
                    Wednesday
                  </h3>
                </div>
                <div className="space-y-4">
                  {wednesdayTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-4 group"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          className="w-4 h-4 rounded border-2 border-gray-600 bg-transparent text-green-500 focus:ring-green-500 focus:ring-2 focus:ring-offset-0"
                          readOnly
                        />
                      </div>
                      <div className="flex-1 text-gray-300 font-medium">
                        {task.title}
                      </div>
                      <div
                        className={`text-xs px-3 py-1 rounded-full font-medium ${getTagColor(task.tag)}`}
                      >
                        {task.tag}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thursday Tasks */}
              <div className="bg-gray-900/80 backdrop-blur rounded-2xl p-6 border border-gray-800/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <h3 className="text-white font-semibold text-lg">Thursday</h3>
                </div>
                <div className="space-y-4">
                  {thursdayTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-4 group"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          className="w-4 h-4 rounded border-2 border-gray-600 bg-transparent text-green-500 focus:ring-green-500 focus:ring-2 focus:ring-offset-0"
                          readOnly
                        />
                      </div>
                      <div className="flex-1 text-gray-300 font-medium">
                        {task.title}
                      </div>
                      <div
                        className={`text-xs px-3 py-1 rounded-full font-medium ${getTagColor(task.tag)}`}
                      >
                        {task.tag}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row - Study Image and Inspiration */}
            <div className="grid grid-cols-2 gap-6">
              {/* Study Environment Image */}
              <div className="bg-gray-900/80 backdrop-blur rounded-2xl overflow-hidden border border-gray-800/50">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative">
                  <div className="absolute inset-0">
                    {/* Simulated study environment */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                      <div className="text-white">
                        <div className="w-8 h-8 bg-white/20 rounded-lg mb-3 flex items-center justify-center">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <h4 className="font-semibold mb-1">Study Space</h4>
                        <p className="text-sm text-white/80">
                          Your optimal learning environment
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inspiration Card */}
              <div className="bg-gray-900/80 backdrop-blur rounded-2xl p-6 border border-gray-800/50">
                <div className="flex items-center gap-3 mb-4">
                  <Quote className="w-5 h-5 text-green-500" />
                  <h3 className="text-white font-semibold">Inspiration</h3>
                </div>
                <blockquote className="text-gray-300 italic leading-relaxed mb-4">
                  "Never forget why you started your journey."
                </blockquote>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-black fill-current" />
                  </div>
                  <span className="text-gray-500 text-sm">Motivational</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Weekly Todos and Subjects */}
          <div className="col-span-3 space-y-6">
            {/* Weekly Todos */}
            <div className="bg-gray-900/80 backdrop-blur rounded-2xl p-6 border border-gray-800/50">
              <h3 className="text-green-500 font-bold text-sm tracking-[0.2em] mb-6 uppercase">
                WEEKLY TODOS
              </h3>
              <div className="space-y-3">
                {weeklyTodos.map((todo, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-300 text-sm font-medium">
                      {todo}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subjects */}
            <div className="bg-gray-900/80 backdrop-blur rounded-2xl p-6 border border-gray-800/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h3 className="text-white font-semibold">Subjects</h3>
              </div>
              <div className="space-y-4">
                {subjects.map((subject, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center text-lg">
                      {subject.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-300 font-medium">
                        {subject.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Study Space Image */}
            <div className="bg-gray-900/80 backdrop-blur rounded-2xl overflow-hidden border border-gray-800/50">
              <div className="aspect-square bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <span className="text-sm font-medium">Study Gallery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
