"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowRight, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginProps {
  onSuccess: (token: string, user: any) => void;
  onSwitchToSignup: () => void;
}

export default function Login({ onSuccess, onSwitchToSignup }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({} as Record<string, string>);
  const { toast } = useToast();

  function validate() {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setErrors({});

    const requestBody = {
      email,
      password,
    };

    try {
      const response = await fetch("https://codeforces-backend.bkumar-be23.workers.dev/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to your account.",
        });
        
        // Call the success callback with token and user data
        onSuccess(data.token, data.user);
      } else {
        // Handle API errors
        if (data.error) {
          toast({
            title: "Error",
            description: data.error,
            variant: "destructive",
          });
        } else if (data.message) {
          toast({
            title: "Error",
            description: data.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to sign in. Please check your credentials.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-dark p-4">
      <Card className="w-full max-w-md shadow-xl bg-gray-800 border-gray-700">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
          <p className="text-gray-300">Sign in to your Codeforces account</p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email Address
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@thapar.edu"
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                  disabled={loading}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90 text-white font-medium py-2.5 shadow-blue"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center">
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-300">
                Don't have an account?{" "}
                <button 
                  type="button" 
                  className="text-blue-400 hover:text-blue-300 font-medium flex items-center mx-auto"
                  onClick={onSwitchToSignup}
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  Create Account
                </button>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
