"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrlParam = searchParams.get("callbackUrl");
  const callbackUrl =
    callbackUrlParam && callbackUrlParam.startsWith("/") ? callbackUrlParam : null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [infoText, setInfoText] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorText(null);
    setInfoText(null);

    if (password.length < 8) {
      setErrorText("Password must be at least 8 characters.");
      setSubmitting(false);
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: name ? { name } : undefined,
      },
    });

    if (error) {
      setErrorText(error.message);
      setSubmitting(false);
      return;
    }

    if (data.session) {
      router.push(callbackUrl ?? "/builder");
      return;
    }

    setInfoText("Account created. Please check your email to confirm, then log in.");
    setSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20 max-w-lg">
      <Card className="bg-white border shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Create account</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign up to access the CV builder.
          </p>
          {errorText && <p className="text-sm text-red-600">{errorText}</p>}
          {infoText && <p className="text-sm text-green-700">{infoText}</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full name (optional)</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Saurabh Verma"
              />
            </div>
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
                placeholder="Minimum 8 characters"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-white"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Sign up"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-accent font-semibold">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

