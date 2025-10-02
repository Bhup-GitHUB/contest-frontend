"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  Code, 
  Trophy, 
  Users, 
  Play,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MonacoEditor from "@monaco-editor/react";

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
    fetchContestDetails();
    fetchSubmissions();
    fetchLeaderboard();
  }, [contestId, token]);

  async function fetchContestDetails() {
    try {
      const response = await fetch(`https://codeforces-backend.bkumar-be23.workers.dev/simple-contests/${contestId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContest(data.contest);
      } else {
        toast({
          title: "Error",
          description: "Failed to load contest details",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching contest:", error);
      toast({
        title: "Error",
        description: "Network error while loading contest",
        variant: "destructive",
      });
    }
  }

  async function fetchSubmissions() {
    try {
      const response = await fetch(`https://codeforces-backend.bkumar-be23.workers.dev/simple-contests/${contestId}/submissions`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  }

  async function fetchLeaderboard() {
    try {
      const response = await fetch(`https://codeforces-backend.bkumar-be23.workers.dev/simple-contests/${contestId}/leaderboard`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
      }
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
      const response = await fetch(`https://codeforces-backend.bkumar-be23.workers.dev/simple-contests/${contestId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          code,
          language
        }),
      });

      const data = await response.json();

      if (response.ok) {
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
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit code",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting code:", error);
      toast({
        title: "Error",
        description: "Network error while submitting code",
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="outline" onClick={onBack} className="mr-4">
                ← Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">{contest.title}</h1>
              <Badge 
                variant={isContestActive() ? "default" : "secondary"}
                className="ml-3"
              >
                {isContestActive() ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
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
                <Card>
                  <CardHeader>
                    <CardTitle>Problem Statement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                        {contest.problemStatement}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Expected Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <code className="text-sm">{contest.expectedOutput}</code>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contest Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Start: {formatDate(contest.startTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">End: {formatDate(contest.endTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Code className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Submissions: {submissions.length}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Best Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {submissions.length > 0 ? Math.max(...submissions.map(s => s.score)) : 0}
                      </div>
                      <p className="text-sm text-gray-600">out of 100</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Submit Tab */}
          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle>Submit Solution</CardTitle>
                <p className="text-sm text-gray-600">
                  Write your solution in the editor below and submit when ready.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium">Language:</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="border rounded px-3 py-1 text-sm"
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
                    className="flex items-center space-x-2"
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
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                      <span className="text-sm text-yellow-800">
                        This contest is not currently active. You cannot submit solutions.
                      </span>
                    </div>
                  </div>
                )}

                {submissions.length >= 5 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <XCircle className="w-5 h-5 text-red-600 mr-2" />
                      <span className="text-sm text-red-800">
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
            <Card>
              <CardHeader>
                <CardTitle>My Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <div className="text-center py-8">
                    <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                    <p className="text-gray-600">Submit your first solution to see it here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(submission.status)}
                            <span className="font-medium">Submission #{submission.id.slice(-8)}</span>
                            <Badge variant="outline">{submission.status}</Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatDate(submission.createdAt)}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="font-medium">Score: {submission.score}/100</span>
                          {submission.aiReview && (
                            <div className="text-gray-600">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Leaderboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboard.length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                    <p className="text-gray-600">Be the first to submit a solution!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {leaderboard.map((entry, index) => (
                      <div key={entry.userId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                            {entry.rank}
                          </div>
                          <div>
                            <div className="font-medium">{entry.userName}</div>
                            <div className="text-sm text-gray-600">{entry.userEmail}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{entry.score}</div>
                          <div className="text-sm text-gray-600">points</div>
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
