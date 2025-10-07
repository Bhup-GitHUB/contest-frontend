"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Code, Trophy, Users, Play, CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MonacoEditor from "@monaco-editor/react";
import { api } from "@/lib/api";

interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  problemStatement: string;
  expectedOutput: string;
}

interface Submission {
  id: string;
  status: string;
  score: number;
  createdAt: string;
  aiReview?: {
    totalScore: number;
    breakdown: {
      correctness: { score: number; feedback: string };
      codeQuality: { score: number; feedback: string };
      efficiency: { score: number; feedback: string };
      bestPractices: { score: number; feedback: string };
    };
    strengths: string[];
    improvements: string[];
    overallFeedback: string;
  };
}

interface ContestDetailProps {
  contestId: string;
  user: any;
  token: string;
  onBack: () => void;
}

export default function ContestDetail({ contestId, user, token, onBack }: ContestDetailProps) {
  const [contest, setContest] = useState<Contest | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const { toast } = useToast();

  useEffect(() => {
    api.setToken(token);
    fetchContestDetails();
    fetchSubmissions();
    fetchLeaderboard();
  }, [contestId, token]);

  async function fetchContestDetails() {
    try {
      const data = await api.getSimpleContest(contestId);
      setContest((data as any)?.contest ?? null);
    } catch (error) {
      console.error("Error fetching contest:", error);
        toast({
          title: "Error",
          description: (error as any)?.message || "Failed to load contest details",
          variant: "destructive",
        });
    }
  }

  async function fetchSubmissions() {
    try {
      const data = await api.getSimpleContestSubmissions(contestId);
      setSubmissions((data as any)?.submissions || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  }

  async function fetchLeaderboard() {
    try {
      const data = await api.getSimpleContestLeaderboard(contestId);
      setLeaderboard((data as any)?.leaderboard || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  }

  async function submitCode() {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please write some code before submitting",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await api.submitSimpleContestCode(contestId, code, language);
        toast({
          title: "Success!",
          description: "Code submitted successfully. AI is reviewing your solution...",
        });
        setCode("");
        // Refresh submissions after a short delay
        setTimeout(() => {
          fetchSubmissions();
          fetchLeaderboard();
        }, 2000);
    } catch (error: any) {
      console.error("Error submitting code:", error);
      toast({
        title: "Error",
        description: error?.message || "Network error while submitting code",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function isContestActive() {
    if (!contest) return false;
    const now = new Date();
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);
    return now >= start && now <= end;
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "running":
        return <Play className="w-4 h-4 text-blue-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00d9ff]"></div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Contest not found</h2>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-[#111111] border-b border-[#333333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="outline" onClick={onBack} className="mr-4 border-[#333333] text-gray-300 hover:bg-[#111111]">
                ← Back
              </Button>
              <h1 className="text-2xl font-bold text-white">{contest.title}</h1>
              <Badge 
                variant={isContestActive() ? "default" : "secondary"}
                className={`ml-3 ${isContestActive() ? "bg-white text-black" : "bg-[#222222] text-white border border-[#333333]"}`}
              >
                {isContestActive() ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-300">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="problem" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="problem">Problem</TabsTrigger>
            <TabsTrigger value="submit">Submit</TabsTrigger>
            <TabsTrigger value="submissions">My Submissions</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          {/* Problem Tab */}
          <TabsContent value="problem">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-[#111111] border-[#333333]">
                  <CardHeader>
                    <CardTitle className="text-white">Problem Statement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
                        {contest.problemStatement}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6 bg-[#111111] border-[#333333]">
                  <CardHeader>
                    <CardTitle className="text-white">Expected Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-[#1a1a1a] p-4 rounded-lg">
                      <code className="text-sm text-gray-300">{contest.expectedOutput}</code>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-[#111111] border-[#333333]">
                  <CardHeader>
                    <CardTitle className="text-white">Contest Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">Start: {formatDate(contest.startTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">End: {formatDate(contest.endTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Code className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">Submissions: {submissions.length}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#111111] border-[#333333]">
                  <CardHeader>
                    <CardTitle className="text-white">Best Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        {submissions.length > 0 ? Math.max(...submissions.map(s => s.score)) : 0}
                      </div>
                      <p className="text-sm text-gray-400">out of 100</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Submit Tab */}
          <TabsContent value="submit">
            <Card className="bg-[#111111] border-[#333333]">
              <CardHeader>
                <CardTitle className="text-white">Submit Solution</CardTitle>
                <p className="text-sm text-gray-400">
                  Write your solution in the editor below and submit when ready.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-300">Language:</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="border border-[#333333] bg-[#1a1a1a] text-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <MonacoEditor
                    height="400px"
                    language={language}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {submissions.length}/5 submissions used
                  </div>
                  <Button 
                    onClick={submitCode}
                    disabled={submitting || !isContestActive() || submissions.length >= 5}
                    className="flex items-center space-x-2 bg-white hover:bg-[#e5e5e5] text-black"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Code className="w-4 h-4" />
                        <span>Submit Solution</span>
                      </>
                    )}
                  </Button>
                </div>

                {!isContestActive() && (
                  <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-gray-300 mr-2" />
                      <span className="text-sm text-gray-300">
                        This contest is not currently active. You cannot submit solutions.
                      </span>
                    </div>
                  </div>
                )}

                {submissions.length >= 5 && (
                  <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-4">
                    <div className="flex items-center">
                      <XCircle className="w-5 h-5 text-gray-300 mr-2" />
                      <span className="text-sm text-gray-300">
                        You have reached the maximum number of submissions (5) for this contest.
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions">
            <Card className="bg-[#111111] border-[#333333]">
              <CardHeader>
                <CardTitle className="text-white">My Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <div className="text-center py-8">
                    <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No submissions yet</h3>
                    <p className="text-gray-400">Submit your first solution to see it here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="border border-[#333333] bg-[#1a1a1a] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(submission.status)}
                            <span className="font-medium text-white">Submission #{submission.id.slice(-8)}</span>
                            <Badge variant="outline" className="border-[#333333] text-gray-300">{submission.status}</Badge>
                          </div>
                          <div className="text-sm text-gray-400">
                            {formatDate(submission.createdAt)}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="font-medium text-gray-300">Score: {submission.score}/100</span>
                          {submission.aiReview && (
                            <div className="text-gray-400">
                              AI Review: {submission.aiReview.overallFeedback}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <Card className="bg-[#111111] border-[#333333]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Trophy className="w-5 h-5" />
                  <span>Leaderboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboard.length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No submissions yet</h3>
                    <p className="text-gray-400">Be the first to submit a solution!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {leaderboard.map((entry, index) => (
                      <div key={entry.userId} className="flex items-center justify-between p-3 border border-[#333333] bg-[#1a1a1a] rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black font-semibold">
                            {entry.rank}
                          </div>
                          <div>
                            <div className="font-medium text-white">{entry.userName}</div>
                            <div className="text-sm text-gray-400">{entry.userEmail}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-white">{entry.score}</div>
                          <div className="text-sm text-gray-400">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
