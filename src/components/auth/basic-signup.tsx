"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] p-4">
      <Card className="w-full max-w-md shadow-xl bg-[#2a2a2a] border-[#00d9ff]">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
          <p className="text-gray-400">Join and start coding!</p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-300">
                Full Name
              </Label>
              <div className="relative mt-1">
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className={`bg-[#1a1a1a] border-[#3a3a3a] text-white focus:border-[#00d9ff] ${errors.name ? "border-red-500" : ""}`}
                  disabled={loading}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email Address
              </Label>
              <div className="relative mt-1">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@thapar.edu"
                  className={`bg-[#1a1a1a] border-[#3a3a3a] text-white focus:border-[#00d9ff] ${errors.email ? "border-red-500" : ""}`}
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
              <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className={`bg-[#1a1a1a] border-[#3a3a3a] text-white focus:border-[#00d9ff] ${errors.password ? "border-red-500" : ""}`}
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
              className="w-full bg-[#00d9ff] hover:bg-[#00b8d9] text-black font-medium py-2.5"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-[#00d9ff] hover:text-[#00b8d9] font-medium"
                  onClick={() => {}}
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
