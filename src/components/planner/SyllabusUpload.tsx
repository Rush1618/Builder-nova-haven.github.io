import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SyllabusParser } from "@/lib/syllabus-parser";
import { ParsedSyllabus, SyllabusModule } from "@/types/syllabus";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Brain,
  Clock,
  BarChart3,
} from "lucide-react";

interface SyllabusUploadProps {
  onSyllabusUploaded: (syllabus: ParsedSyllabus) => void;
  onModulesExtracted: (modules: SyllabusModule[]) => void;
}

export default function SyllabusUpload({
  onSyllabusUploaded,
  onModulesExtracted,
}: SyllabusUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedSyllabus, setParsedSyllabus] = useState<ParsedSyllabus | null>(
    null,
  );
  const [parsingStage, setParsingStage] = useState<string>("");

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setParsingStage("Uploading file...");

    try {
      // Simulate upload progress
      const progressStages = [
        { progress: 20, stage: "Extracting text from PDF..." },
        { progress: 40, stage: "Analyzing content structure..." },
        { progress: 60, stage: "Identifying modules and topics..." },
        { progress: 80, stage: "Estimating study hours..." },
        { progress: 100, stage: "Generating study plan..." },
      ];

      for (const { progress, stage } of progressStages) {
        setUploadProgress(progress);
        setParsingStage(stage);
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      // Parse the syllabus
      const syllabus = await SyllabusParser.parsePDF(file);
      setParsedSyllabus(syllabus);
      onSyllabusUploaded(syllabus);
      onModulesExtracted(syllabus.modules);

      setParsingStage("Completed!");
    } catch (error) {
      console.error("Error parsing syllabus:", error);
      alert("Error parsing syllabus. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDifficultyStars = (difficulty: number) => {
    return "★".repeat(difficulty) + "☆".repeat(5 - difficulty);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI-Powered Syllabus Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="syllabus-upload" className="text-sm font-medium">
                Upload Your Course Syllabus (PDF)
              </Label>
              <div className="mt-2">
                <Input
                  id="syllabus-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Our AI will automatically extract modules, topics, and create a
                personalized study plan
              </p>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">{parsingStage}</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* AI Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Brain className="w-8 h-8 text-blue-600" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">
                    Smart Analysis
                  </h4>
                  <p className="text-xs text-blue-700">
                    AI extracts modules and topics automatically
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Clock className="w-8 h-8 text-green-600" />
                <div>
                  <h4 className="text-sm font-medium text-green-900">
                    Time Estimation
                  </h4>
                  <p className="text-xs text-green-700">
                    Calculates study hours for each topic
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                <div>
                  <h4 className="text-sm font-medium text-purple-900">
                    Adaptive Planning
                  </h4>
                  <p className="text-xs text-purple-700">
                    Adjusts based on your CGPA and patterns
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parsed Results */}
      {parsedSyllabus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Syllabus Analysis Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {parsedSyllabus.modules.length}
                  </div>
                  <div className="text-sm text-gray-600">Modules</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {parsedSyllabus.totalHours}h
                  </div>
                  <div className="text-sm text-gray-600">Total Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(parsedSyllabus.confidence * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(
                      parsedSyllabus.modules.reduce(
                        (sum, m) => sum + m.difficulty,
                        0,
                      ) / parsedSyllabus.modules.length,
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Avg Difficulty</div>
                </div>
              </div>

              {/* Subject Info */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {parsedSyllabus.subject}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {parsedSyllabus.semester}
                  </p>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {parsedSyllabus.fileName}
                </Badge>
              </div>

              {/* Modules List */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Extracted Modules
                </h4>
                <div className="space-y-3">
                  {parsedSyllabus.modules.map((module, index) => (
                    <div
                      key={module.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-500">
                              Module {index + 1}
                            </span>
                            <Badge
                              variant="outline"
                              className={getPriorityColor(module.priority)}
                            >
                              {module.priority} priority
                            </Badge>
                          </div>
                          <h5 className="text-md font-semibold text-gray-900">
                            {module.name}
                          </h5>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {module.estimatedHours}h
                          </div>
                          <div
                            className="text-xs text-gray-500"
                            title={`Difficulty: ${module.difficulty}/5`}
                          >
                            {getDifficultyStars(module.difficulty)}
                          </div>
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="text-xs text-gray-600 mb-1">
                          Topics:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {module.topics.map((topic, topicIndex) => (
                            <Badge
                              key={topicIndex}
                              variant="secondary"
                              className="text-xs"
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Progress: {module.progress}%
                        </div>
                        <div className="w-24">
                          <Progress value={module.progress} className="h-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Next Steps
                </h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>
                    • Upload your exam schedule to generate a personalized study
                    plan
                  </li>
                  <li>
                    • Review and adjust module priorities based on your goals
                  </li>
                  <li>
                    • Set up your study pattern preferences for optimal planning
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
