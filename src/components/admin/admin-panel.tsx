"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  Code, 
  Edit, 
  Trash2,
  Eye,
  Play,
  Pause
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  createdById: string;
  problemStatement?: string;
  expectedOutput?: string;
}

interface AdminPanelProps {
  user: any;
  token: string;
  onLogout: () => void;
}

export default function AdminPanel({ user, token, onLogout }: AdminPanelProps) {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const { toast } = useToast();

  // Form state for creating contests
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    problemStatement: "",
    expectedOutput: ""
  });

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

  async function createContest(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const response = await fetch("https://codeforces-backend.bkumar-be23.workers.dev/simple-contests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Contest created successfully",
        });
        setShowCreateForm(false);
        setFormData({
          title: "",
          description: "",
          startTime: "",
          endTime: "",
          problemStatement: "",
          expectedOutput: ""
        });
        fetchContests();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create contest",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating contest:", error);
      toast({
        title: "Error",
        description: "Network error while creating contest",
        variant: "destructive",
      });
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00d9ff]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Header */}
      <header className="bg-[#2a2a2a] border-b border-[#00d9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              <Badge variant="secondary" className="ml-3 bg-[#00d9ff] text-white">Admin</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-300">{user.name}</span>
              <Button variant="outline" size="sm" onClick={onLogout} className="border-[#00d9ff] text-gray-300 hover:bg-[#3a3a3a]">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#2a2a2a] border-[#00d9ff]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Code className="h-8 w-8 text-blue-500" />
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
                <Play className="h-8 w-8 text-green-500" />
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
                <Clock className="h-8 w-8 text-yellow-500" />
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
                <Users className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">--</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contests Management */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Contest Management</h2>
            <Button onClick={() => setShowCreateForm(true)} className="flex items-center space-x-2 bg-[#00d9ff] hover:bg-[#00b8d9]">
              <Plus className="w-4 h-4" />
              <span>Create Contest</span>
            </Button>
          </div>

          {contests.length === 0 ? (
            <Card className="bg-[#2a2a2a] border-[#00d9ff]">
              <CardContent className="p-12 text-center">
                <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No contests yet</h3>
                <p className="text-gray-400 mb-4">Create your first contest to get started.</p>
                <Button onClick={() => setShowCreateForm(true)} className="flex items-center space-x-2 bg-[#00d9ff] hover:bg-[#00b8d9]">
                  <Plus className="w-4 h-4" />
                  <span>Create Contest</span>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {contests.map((contest) => (
                <Card key={contest.id} className="hover:shadow-lg transition-shadow bg-[#2a2a2a] border-[#00d9ff]">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold text-white">
                        {contest.title}
                      </CardTitle>
                      <Badge 
                        variant={isContestActive(contest) ? "default" : isContestUpcoming(contest) ? "secondary" : "outline"}
                        className={isContestActive(contest) ? "bg-green-600" : isContestUpcoming(contest) ? "bg-[#00d9ff]" : "bg-gray-600"}
                      >
                        {isContestActive(contest) ? "Active" : isContestUpcoming(contest) ? "Upcoming" : "Ended"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {contest.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-400 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Start: {formatDate(contest.startTime)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>End: {formatDate(contest.endTime)}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedContest(contest)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Create Contest Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Create New Contest</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={createContest} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Contest Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Enter contest title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Brief description of the contest"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="datetime-local"
                        value={formData.startTime}
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="datetime-local"
                        value={formData.endTime}
                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="problemStatement">Problem Statement</Label>
                    <Textarea
                      id="problemStatement"
                      value={formData.problemStatement}
                      onChange={(e) => setFormData({...formData, problemStatement: e.target.value})}
                      placeholder="Enter the problem statement with examples and constraints..."
                      rows={6}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="expectedOutput">Expected Output</Label>
                    <Input
                      id="expectedOutput"
                      value={formData.expectedOutput}
                      onChange={(e) => setFormData({...formData, expectedOutput: e.target.value})}
                      placeholder="Expected output format (e.g., [0,1])"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Contest</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contest Detail Modal */}
        {selectedContest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{selectedContest.title}</CardTitle>
                  <Button variant="outline" onClick={() => setSelectedContest(null)}>
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{selectedContest.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Start Time</h3>
                    <p className="text-gray-600">{formatDate(selectedContest.startTime)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">End Time</h3>
                    <p className="text-gray-600">{formatDate(selectedContest.endTime)}</p>
                  </div>
                </div>

                {selectedContest.problemStatement && (
                  <div>
                    <h3 className="font-semibold mb-2">Problem Statement</h3>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">{selectedContest.problemStatement}</pre>
                    </div>
                  </div>
                )}

                {selectedContest.expectedOutput && (
                  <div>
                    <h3 className="font-semibold mb-2">Expected Output</h3>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <code className="text-sm">{selectedContest.expectedOutput}</code>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
