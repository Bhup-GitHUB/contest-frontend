"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  Code,
  LogOut,
  User,
  Star,
  TrendingUp,
  Settings,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
}

interface DashboardProps {
  user: User;
  token: string;
  onLogout: () => void;
  onViewContest: (contestId: string) => void;
  onViewProfile: () => void;
  onViewAdmin: () => void;
}

export default function Dashboard({ user, token, onLogout, onViewContest, onViewProfile, onViewAdmin }: DashboardProps) {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchContests();
  }, [token]);

  async function fetchContests() {
    try {
      const response = await fetch("https://codeforces-backend.bkumar-be23.workers.dev/simple-contests", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContests(data.contests || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to load contests",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching contests:", error);
      toast({
        title: "Error",
        description: "Network error while loading contests",
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

  function isContestActive(contest: Contest) {
    const now = new Date();
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);
    return now >= start && now <= end;
  }

  function isContestUpcoming(contest: Contest) {
    const now = new Date();
    const start = new Date(contest.startTime);
    return now < start;
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#00d9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-white">Contest Platform</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-300">{user.name}</span>
                <Badge variant="secondary" className="bg-[#00d9ff] text-black">{user.role}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewProfile}
                  className="flex items-center space-x-1 border-[#00d9ff] text-white hover:bg-[#2a2a2a]"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Button>
                {user.role === 'admin' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onViewAdmin}
                    className="flex items-center space-x-1 border-[#00d9ff] text-white hover:bg-[#2a2a2a]"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="flex items-center space-x-1 border-[#00d9ff] text-white hover:bg-[#2a2a2a]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-400">
            Ready to solve some coding challenges? Check out the contests below.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#2a2a2a] border-[#00d9ff]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-[#00d9ff]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Contests</p>
                  <p className="text-2xl font-bold text-white">{contests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2a2a] border-[#00d9ff]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-[#00d9ff]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Active Contests</p>
                  <p className="text-2xl font-bold text-white">
                    {contests.filter(isContestActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2a2a] border-[#00d9ff]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-[#00d9ff]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Upcoming</p>
                  <p className="text-2xl font-bold text-white">
                    {contests.filter(isContestUpcoming).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2a2a] border-[#00d9ff]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-[#00d9ff]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Best Score</p>
                  <p className="text-2xl font-bold text-white">--</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contests Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Contests</h3>
            <Button className="flex items-center space-x-2 bg-[#00d9ff] hover:bg-[#00b8d9] text-black">
              <Code className="w-4 h-4" />
              <span>Create Contest</span>
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00d9ff]"></div>
            </div>
          ) : contests.length === 0 ? (
            <Card className="bg-[#2a2a2a] border-[#00d9ff]">
              <CardContent className="p-12 text-center">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No contests yet</h3>
                <p className="text-gray-400 mb-4">
                  There are no contests available at the moment.
                </p>
                <Button className="flex items-center space-x-2 bg-[#00d9ff] hover:bg-[#00b8d9] text-black">
                  <Code className="w-4 h-4" />
                  <span>Create First Contest</span>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contests.map((contest) => (
                <Card key={contest.id} className="hover:shadow-lg transition-shadow bg-[#2a2a2a] border-[#00d9ff]">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold text-white">
                        {contest.title}
                      </CardTitle>
                      <Badge
                        variant={isContestActive(contest) ? "default" : isContestUpcoming(contest) ? "secondary" : "outline"}
                        className={isContestActive(contest) ? "bg-[#00d9ff] text-black" : isContestUpcoming(contest) ? "bg-[#00d9ff] text-black" : "bg-[#3a3a3a] text-gray-300"}
                      >
                        {isContestActive(contest) ? "Active" : isContestUpcoming(contest) ? "Upcoming" : "Ended"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                      {contest.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Start: {formatDate(contest.startTime)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>End: {formatDate(contest.endTime)}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-[#00d9ff] hover:bg-[#00b8d9] text-black"
                        onClick={() => onViewContest(contest.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {isContestActive(contest) ? "Join Contest" : "View Details"}
                      </Button>
                      <Button size="sm" variant="outline" className="border-[#00d9ff] text-white hover:bg-[#2a2a2a]">
                        <Users className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <Card className="bg-[#2a2a2a] border-[#00d9ff]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <TrendingUp className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-400">
              <Code className="h-8 w-8 mx-auto mb-2" />
              <p>No recent activity</p>
              <p className="text-sm">Start participating in contests to see your activity here!</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
