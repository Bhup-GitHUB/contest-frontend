"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SignupCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({} as Record<string, string>);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Generate a unique email for testing
  const generateTestEmail = () => {
    const timestamp = Date.now();
    setEmail(`testuser${timestamp}@thapar.edu`);
  };

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

    console.log("Sending signup request:", requestBody);
    console.log("Request body stringified:", JSON.stringify(requestBody));

    try {
      const response = await fetch("https://codeforces-backend.bkumar-be23.workers.dev/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      let data;
      try {
        data = await response.json();
        console.log("Response data:", data);
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        const textResponse = await response.text();
        console.log("Raw response text:", textResponse);
        data = { error: "Invalid response format" };
      }

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Account created successfully. You can now sign in.",
        });
        // Clear form on success
        setName("");
        setEmail("");
        setPassword("");
        setRemember(false);
      } else {
        // Handle API errors
        console.error("API Error Response:", data);
        
        if (data.error) {
          // Handle Zod validation errors
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl shadow-lg">
          <CardHeader className="p-6 text-center">
            <CardTitle className="text-xl font-semibold">Codeforces — Sign Up</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Create your account to access contests, practice and standings</p>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User size={16} /> Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                  placeholder="Your full name"
                  className={errors.name ? "border-destructive" : ""}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail size={16} /> Email
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    placeholder="yourname@thapar.edu"
                    className={errors.email ? "border-destructive" : ""}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateTestEmail}
                    className="whitespace-nowrap"
                  >
                    Test Email
                  </Button>
                </div>
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Only @thapar.edu email addresses are allowed
                </p>
              </div>

              <div>
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock size={16} /> Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  placeholder="Create a strong password"
                  className={errors.password ? "border-destructive" : ""}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                {errors.password && (
                  <p id="password-error" className="text-sm text-destructive mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" checked={remember} onCheckedChange={(val) => setRemember(!!val)} />
                  <Label htmlFor="remember">Remember me</Label>
                </div>
                <a className="text-sm underline hover:text-primary">Forgot password?</a>
              </div>

            </CardContent>

            <CardFooter className="p-6 flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>

              <div className="text-sm text-center text-muted-foreground">
                By continuing you agree to our <span className="underline">Terms</span> and <span className="underline">Privacy</span>.
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <span>Already have an account? </span>
          <a className="underline hover:text-primary cursor-pointer">Sign in here</a>
        </div>
      </motion.div>
    </div>
  );
}
