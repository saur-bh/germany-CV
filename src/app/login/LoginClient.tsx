"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const signedUp = searchParams.get("signup") === "1";
  const callbackUrlParam = searchParams.get("callbackUrl");
  const callbackUrl =
    callbackUrlParam && callbackUrlParam.startsWith("/") ? callbackUrlParam : null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorText(null);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setErrorText("Supabase is not configured yet. Please set SUPABASE URL and ANON key.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorText(error.message || "Invalid email or password.");
      setSubmitting(false);
      return;
    }

    router.push(callbackUrl ?? "/builder");
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20 max-w-lg">
      <Card className="bg-white border shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Log in</CardTitle>
          <p className="text-sm text-muted-foreground">
            Log in to continue to the CV builder.
          </p>
          {signedUp && (
            <p className="text-sm text-green-700">
              Account created. Please log in.
            </p>
          )}
          {errorText && <p className="text-sm text-red-600">{errorText}</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-white"
              disabled={submitting}
            >
              {submitting ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-6">
            New here?{" "}
            <Link href="/signup" className="text-accent font-semibold">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
