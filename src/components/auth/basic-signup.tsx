"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SignupProps {
  onSuccess: (token: string, user: any) => void;
}

export default function BasicSignup({ onSuccess }: SignupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({} as Record<string, string>);
  const { toast } = useToast();

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email";
    else if (!email.endsWith("@thapar.edu")) e.email = "Only @thapar.edu emails are allowed";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be ≥ 6 characters";
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
      name,
    };

    try {
      const response = await fetch("https://codeforces-backend.bkumar-be23.workers.dev/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Account created successfully. Welcome to Codeforces!",
        });
        
        // Call the success callback with token and user data
        onSuccess(data.token, data.user);
      } else {
        // Handle API errors
        if (data.error) {
          if (data.error.name === "ZodError" && data.error.message) {
            try {
              const zodErrors = JSON.parse(data.error.message);
              const errorMessages = zodErrors.map((err: any) => err.message).join(", ");
              toast({
                title: "Validation Error",
                description: errorMessages,
                variant: "destructive",
              });
            } catch {
              toast({
                title: "Error",
                description: data.error.message || "Validation failed",
                variant: "destructive",
              });
            }
          } else {
            toast({
              title: "Error",
              description: data.error,
              variant: "destructive",
            });
          }
        } else if (data.message) {
          toast({
            title: "Error",
            description: data.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to create account. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
          <p className="text-gray-600">Join Codeforces and start coding!</p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                  disabled={loading}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
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
              <p className="text-xs text-gray-500 mt-1">
                Only @thapar.edu email addresses are allowed
              </p>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center">
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button 
                  type="button" 
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => {/* TODO: Switch to login */}}
                >
                  Sign in
                </button>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
