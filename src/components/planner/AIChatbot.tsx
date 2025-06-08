import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  Send,
  Upload,
  BookOpen,
  TrendingUp,
  Brain,
  FileText,
  DollarSign,
  Mic,
  Paperclip,
  MessageSquare,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  category?: "study" | "stock" | "general";
  attachments?: { name: string; type: string }[];
}

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  recommendation: "BUY" | "SELL" | "HOLD";
}

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hi! I'm your AI Study Assistant. I can help you with:\n\n📚 Study questions from your textbooks\n📊 Stock market analysis and investment advice\n🎯 CGPA tracking and academic planning\n📝 Exam preparation strategies\n\nWhat would you like to explore today?",
      timestamp: new Date(),
      category: "general",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock stock data
  const [watchedStocks] = useState<StockData[]>([
    {
      symbol: "RELIANCE",
      price: 2456.75,
      change: +23.45,
      changePercent: +0.96,
      recommendation: "BUY",
    },
    {
      symbol: "TCS",
      price: 3234.2,
      change: -12.3,
      changePercent: -0.38,
      recommendation: "HOLD",
    },
    {
      symbol: "INFY",
      price: 1567.8,
      change: +45.6,
      changePercent: +2.99,
      recommendation: "BUY",
    },
    {
      symbol: "HDFC",
      price: 1678.9,
      change: -8.75,
      changePercent: -0.52,
      recommendation: "HOLD",
    },
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
      attachments:
        uploadedFiles.length > 0
          ? uploadedFiles.map((f) => ({ name: f.name, type: f.type }))
          : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    setUploadedFiles([]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    let content = "";
    let category: "study" | "stock" | "general" = "general";

    // Study-related responses
    if (
      input.includes("study") ||
      input.includes("exam") ||
      input.includes("textbook") ||
      input.includes("subject")
    ) {
      category = "study";
      if (
        input.includes("mathematics") ||
        input.includes("math") ||
        input.includes("calculus")
      ) {
        content =
          "📐 **Mathematics Study Help**\n\nBased on your uploaded textbook, here are key concepts to focus on:\n\n• **Differential Calculus**: Focus on limits, derivatives, and applications\n• **Integration**: Practice substitution and integration by parts\n• **Practice Problems**: Solve 5-10 problems daily from chapters 3-5\n\n**Study Plan**: Allocate 2 hours daily, break into 45-min focused sessions with 15-min breaks.\n\n**Expected Internal Marks**: 18-20/25 based on your current progress\n**External Exam Weight**: 75 marks - aim for 60+ for 8+ CGPA";
      } else if (
        input.includes("chemistry") ||
        input.includes("organic") ||
        input.includes("inorganic")
      ) {
        content =
          "🧪 **Chemistry Study Guide**\n\nFrom your syllabus analysis:\n\n• **Organic Chemistry**: Focus on reaction mechanisms and nomenclature\n• **Physical Chemistry**: Thermodynamics and kinetics are high-weightage topics\n• **Practicals**: Lab work contributes 25% to internal assessment\n\n**Marks Breakdown**:\n- Internal Assessment: 25 marks (Lab: 15, Viva: 10)\n- External Exam: 75 marks\n- Your current internal: 19/25 (Good performance!)\n\n**Recommendation**: Strengthen Physical Chemistry for external exam";
      } else {
        content =
          "📚 **Study Assistant Ready**\n\nI can help you with:\n\n• **Subject-specific guidance** from your uploaded textbooks\n• **Exam strategies** based on your syllabus\n• **Time management** for optimal CGPA\n• **Practice questions** and explanations\n\nWhich specific subject or topic would you like to focus on? Upload your textbook PDF for personalized help!";
      }
    }
    // Stock-related responses
    else if (
      input.includes("stock") ||
      input.includes("invest") ||
      input.includes("market") ||
      input.includes("trading")
    ) {
      category = "stock";
      if (
        input.includes("reliance") ||
        input.includes("tcs") ||
        input.includes("infosys")
      ) {
        content =
          "📈 **Stock Analysis & Recommendations**\n\n**Top Picks for Students:**\n\n🟢 **RELIANCE** - ₹2,456.75 (+0.96%)\n- Strong fundamentals, good for long-term\n- Recommendation: **BUY** for 6-12 months\n- Investment: Start with ₹5,000-10,000\n\n🟡 **TCS** - ₹3,234.20 (-0.38%)\n- Stable IT stock, suitable for beginners\n- Recommendation: **HOLD** current levels\n\n🟢 **INFOSYS** - ₹1,567.80 (+2.99%)\n- High growth potential\n- Good for SIP investment\n\n**Student Investment Tips:**\n• Start with ₹1,000-2,000 monthly SIP\n• Focus on large-cap stocks initially\n• Diversify across 3-4 sectors";
      } else {
        content =
          "💹 **Investment Guidance for Students**\n\n**Market Overview:**\n- Nifty: Bullish trend, good entry points\n- Banking sector: Showing strength\n- IT stocks: Mixed signals\n\n**Beginner Strategy:**\n1. **Emergency Fund**: Keep 3-6 months expenses\n2. **SIP Investment**: Start with ₹1,000/month\n3. **Stock Selection**: Focus on blue-chip stocks\n4. **Time Horizon**: Minimum 3-5 years\n\n**Recommended Portfolio for Students:**\n- 40% Large-cap stocks\n- 30% Mutual funds\n- 20% Mid-cap stocks\n- 10% Emergency liquid funds\n\nWould you like specific stock recommendations?";
      }
    }
    // CGPA and marks related
    else if (
      input.includes("cgpa") ||
      input.includes("marks") ||
      input.includes("grade") ||
      input.includes("internal")
    ) {
      category = "study";
      content =
        "���� **CGPA & Marks Analysis**\n\n**Current Academic Status:**\n- Current CGPA: 7.2/10\n- Target CGPA: 8.5/10\n- Improvement needed: +1.3 points\n\n**Semester Breakdown:**\n\n**Mathematics:**\n- Internal: 19/25 (Assignment: 8/10, Mid-term: 11/15)\n- External weightage: 75 marks\n- Expected grade: B+ (7-8 points)\n\n**Chemistry:**\n- Internal: 21/25 (Lab: 15/15, Viva: 6/10)\n- External weightage: 75 marks\n- Expected grade: A (8-9 points)\n\n**Physics:**\n- Internal: 17/25 (Need improvement in practicals)\n- External weightage: 75 marks\n- Current projection: B (6-7 points)\n\n**Action Plan to reach 8.5 CGPA:**\n1. Focus on Physics practicals (+2 points possible)\n2. Excel in external exams (aim for 65+ in each)\n3. Complete all assignments on time";
    }
    // General responses
    else {
      content =
        "🤖 **AI Assistant**\n\nI understand you need help! I can assist with:\n\n**📚 Study Support:**\n- Textbook analysis and explanations\n- Subject-specific guidance\n- Exam preparation strategies\n- CGPA optimization\n\n**📈 Investment Guidance:**\n- Stock market analysis\n- Investment recommendations\n- Portfolio planning for students\n- Market trends and insights\n\n**📊 Academic Tracking:**\n- Internal vs External marks breakdown\n- Grade predictions\n- Performance analytics\n\nPlease specify what you'd like help with, or upload your textbook/syllabus for personalized assistance!";
    }

    return {
      id: Date.now().toString(),
      type: "ai",
      content,
      timestamp: new Date(),
      category,
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900 border border-gray-800">
          <TabsTrigger
            value="chat"
            className="data-[state=active]:bg-green-600"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger
            value="stocks"
            className="data-[state=active]:bg-green-600"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Stocks
          </TabsTrigger>
          <TabsTrigger
            value="study"
            className="data-[state=active]:bg-green-600"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Study Help
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="mt-4">
          <Card className="bg-gray-900 border-gray-800 h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <Bot className="w-5 h-5 text-green-500" />
                AI Study & Investment Assistant
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === "user"
                            ? "bg-green-600 text-white"
                            : "bg-gray-800 text-gray-100 border border-gray-700"
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </div>

                        {message.attachments && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 text-xs bg-black/20 rounded p-1"
                              >
                                <FileText className="w-3 h-3" />
                                {file.name}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="text-xs opacity-70 mt-2">
                          {formatTime(message.timestamp)}
                          {message.category && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {message.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* File Upload Area */}
              {uploadedFiles.length > 0 && (
                <div className="p-2 border-t border-gray-800 bg-gray-800/50">
                  <div className="flex flex-wrap gap-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-700 rounded px-2 py-1 text-xs"
                      >
                        <FileText className="w-3 h-3" />
                        {file.name}
                        <button
                          onClick={() =>
                            setUploadedFiles((files) =>
                              files.filter((_, i) => i !== index),
                            )
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-gray-800 bg-gray-900">
                <div className="flex gap-2">
                  <div className="flex gap-1">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Button variant="ghost" size="sm" className="p-2">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <Button variant="ghost" size="sm" className="p-2">
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>

                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask about studies, stocks, or upload your textbook..."
                    className="flex-1 bg-gray-800 border-gray-700 text-white"
                  />

                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stocks Tab */}
        <TabsContent value="stocks" className="mt-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="w-5 h-5 text-green-500" />
                Stock Watchlist & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {watchedStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">
                        {stock.symbol}
                      </h3>
                      <Badge
                        variant={
                          stock.recommendation === "BUY"
                            ? "default"
                            : stock.recommendation === "SELL"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {stock.recommendation}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      ₹{stock.price.toFixed(2)}
                    </div>
                    <div
                      className={`text-sm ${stock.change >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {stock.change >= 0 ? "+" : ""}
                      {stock.change.toFixed(2)} (
                      {stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h4 className="font-semibold text-white mb-2">
                  💡 Investment Tips for Students
                </h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Start with a monthly SIP of ₹1,000-2,000</li>
                  <li>• Focus on large-cap stocks for stability</li>
                  <li>• Maintain emergency fund before investing</li>
                  <li>• Think long-term (3-5 years minimum)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Study Help Tab */}
        <TabsContent value="study" className="mt-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Brain className="w-5 h-5 text-green-500" />
                Personalized Study Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-semibold text-white mb-2">
                    📚 Upload Textbooks
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Upload your course textbooks and I'll provide personalized
                    study guidance
                  </p>
                  <label htmlFor="textbook-upload" className="cursor-pointer">
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Textbook PDF
                    </Button>
                  </label>
                  <input
                    id="textbook-upload"
                    type="file"
                    accept=".pdf"
                    multiple
                    className="hidden"
                  />
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-semibold text-white mb-2">
                    🎯 CGPA Tracker
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Current CGPA:</span>
                      <span className="text-white font-semibold">7.2/10</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Target CGPA:</span>
                      <span className="text-green-400 font-semibold">
                        8.5/10
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "72%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="font-semibold text-white mb-3">
                  📊 Subject-wise Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300">
                      Mathematics
                    </h4>
                    <div className="text-xs text-gray-400">
                      Internal: 19/25 | External: 75 marks
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-blue-500 h-1 rounded-full"
                        style={{ width: "76%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300">
                      Chemistry
                    </h4>
                    <div className="text-xs text-gray-400">
                      Internal: 21/25 | External: 75 marks
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-green-500 h-1 rounded-full"
                        style={{ width: "84%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300">
                      Physics
                    </h4>
                    <div className="text-xs text-gray-400">
                      Internal: 17/25 | External: 75 marks
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-yellow-500 h-1 rounded-full"
                        style={{ width: "68%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
