"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Trophy, 
  Code, 
  Calendar, 
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfileProps {
  user: any;
  token: string;
  onBack: () => void;
}

interface Submission {
  id: string;
  contestId: string;
  contestTitle: string;
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

export default function UserProfile({ user, token, onBack }: UserProfileProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    averageScore: 0,
    bestScore: 0,
    contestsParticipated: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserStats();
  }, [token]);

  async function fetchUserStats() {
    try {
      // Fetch all contests to get user's submissions
      const contestsResponse = await fetch("https://codeforces-backend.bkumar-be23.workers.dev/simple-contests", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (contestsResponse.ok) {
        const contestsData = await contestsResponse.json();
        const contests = contestsData.contests || [];
        
        // Fetch submissions for each contest
        const allSubmissions: Submission[] = [];
        for (const contest of contests) {
          try {
            const submissionsResponse = await fetch(`https://codeforces-backend.bkumar-be23.workers.dev/simple-contests/${contest.id}/submissions`, {
              headers: {
                "Authorization": `Bearer ${token}`,
              },
            });

            if (submissionsResponse.ok) {
              const submissionsData = await submissionsResponse.json();
              const contestSubmissions = (submissionsData.submissions || []).map((sub: any) => ({
                ...sub,
                contestTitle: contest.title
              }));
              allSubmissions.push(...contestSubmissions);
            }
          } catch (error) {
            console.error(`Error fetching submissions for contest ${contest.id}:`, error);
          }
        }

        setSubmissions(allSubmissions);

        // Calculate stats
        const scores = allSubmissions.map(s => s.score).filter(s => s > 0);
        const uniqueContests = new Set(allSubmissions.map(s => s.contestId)).size;
        
        setStats({
          totalSubmissions: allSubmissions.length,
          averageScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
          bestScore: scores.length > 0 ? Math.max(...scores) : 0,
          contestsParticipated: uniqueContests
        });
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
      toast({
        title: "Error",
        description: "Failed to load user statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  function getStatusIcon(status: string) {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "running":
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  }

  function getScoreColor(score: number) {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 50) return "text-orange-600";
    return "text-red-600";
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <Badge variant="secondary" className="mt-2">{user.role}</Badge>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{stats.bestScore}</div>
                <div className="text-sm text-gray-600">Best Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Code className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Best Score</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.bestScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Contests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.contestsParticipated}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="submissions">My Submissions</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Submissions Tab */}
          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Submission History</CardTitle>
                <p className="text-sm text-gray-600">
                  Track your progress and see detailed feedback on your solutions.
                </p>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <div className="text-center py-12">
                    <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                    <p className="text-gray-600">Start participating in contests to see your submissions here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div key={submission.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(submission.status)}
                            <div>
                              <h3 className="font-semibold text-gray-900">{submission.contestTitle}</h3>
                              <p className="text-sm text-gray-600">Submission #{submission.id.slice(-8)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getScoreColor(submission.score)}`}>
                              {submission.score}
                            </div>
                            <div className="text-sm text-gray-600">points</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-4">
                            <span>Status: {submission.status}</span>
                            <span>•</span>
                            <span>{formatDate(submission.createdAt)}</span>
                          </div>
                          <Badge variant="outline">{submission.status}</Badge>
                        </div>

                        {submission.aiReview && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">AI Review</h4>
                            <p className="text-sm text-gray-700 mb-3">{submission.aiReview.overallFeedback}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                              <div>
                                <div className="text-xs text-gray-600">Correctness</div>
                                <div className="font-medium">{submission.aiReview.breakdown.correctness.score}/40</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-600">Code Quality</div>
                                <div className="font-medium">{submission.aiReview.breakdown.codeQuality.score}/30</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-600">Efficiency</div>
                                <div className="font-medium">{submission.aiReview.breakdown.efficiency.score}/20</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-600">Best Practices</div>
                                <div className="font-medium">{submission.aiReview.breakdown.bestPractices.score}/10</div>
                              </div>
                            </div>

                            {submission.aiReview.strengths.length > 0 && (
                              <div className="mb-2">
                                <div className="text-xs font-medium text-green-700 mb-1">Strengths:</div>
                                <div className="text-xs text-gray-700">
                                  {submission.aiReview.strengths.join(", ")}
                                </div>
                              </div>
                            )}

                            {submission.aiReview.improvements.length > 0 && (
                              <div>
                                <div className="text-xs font-medium text-orange-700 mb-1">Improvements:</div>
                                <div className="text-xs text-gray-700">
                                  {submission.aiReview.improvements.join(", ")}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">First Submission</h3>
                  <p className="text-sm text-gray-600">Submit your first solution</p>
                  <Badge variant={stats.totalSubmissions > 0 ? "default" : "outline"} className="mt-2">
                    {stats.totalSubmissions > 0 ? "Earned" : "Not Earned"}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">High Scorer</h3>
                  <p className="text-sm text-gray-600">Score 90+ points</p>
                  <Badge variant={stats.bestScore >= 90 ? "default" : "outline"} className="mt-2">
                    {stats.bestScore >= 90 ? "Earned" : "Not Earned"}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Code className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Active Participant</h3>
                  <p className="text-sm text-gray-600">Participate in 3+ contests</p>
                  <Badge variant={stats.contestsParticipated >= 3 ? "default" : "outline"} className="mt-2">
                    {stats.contestsParticipated >= 3 ? "Earned" : "Not Earned"}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Consistent Performer</h3>
                  <p className="text-sm text-gray-600">Average score 80+</p>
                  <Badge variant={stats.averageScore >= 80 ? "default" : "outline"} className="mt-2">
                    {stats.averageScore >= 80 ? "Earned" : "Not Earned"}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Trophy className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Perfect Score</h3>
                  <p className="text-sm text-gray-600">Score 100 points</p>
                  <Badge variant={stats.bestScore >= 100 ? "default" : "outline"} className="mt-2">
                    {stats.bestScore >= 100 ? "Earned" : "Not Earned"}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Regular Coder</h3>
                  <p className="text-sm text-gray-600">10+ submissions</p>
                  <Badge variant={stats.totalSubmissions >= 10 ? "default" : "outline"} className="mt-2">
                    {stats.totalSubmissions >= 10 ? "Earned" : "Not Earned"}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
