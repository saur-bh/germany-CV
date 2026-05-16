import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function ChancenkartePage() {
  const meetUrl = process.env.NEXT_PUBLIC_GOOGLE_MEET_URL ?? "";

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20 max-w-5xl space-y-12">
      <div className="space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Chancenkarte (Germany) - Job Search Hub
        </h1>
        <p className="text-muted-foreground text-lg">
          Built for Indians moving to Germany on Chancenkarte who want an ATS-friendly CV, clear section order, and weekly guidance.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="bg-accent hover:bg-accent/90 text-white">
            <Link href="/builder">Build my CV</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/templates">Download CV templates</Link>
          </Button>
        </div>
      </div>

      <Card className="bg-primary text-primary-foreground border-none shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Weekly Support Sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          <p className="text-primary-foreground/80 text-lg">
            Join our community every Sunday at 9:00 AM or book a priority 1:1 session for a personalized CV audit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold">
              <Link href="/sessions">
                View All Sessions <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/guide">Read Job Insights</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Chancenkarte-ready sections",
            desc: "Work authorization, relocation, language levels and clean ATS structure.",
          },
          {
            title: "India → Germany clarity",
            desc: "No unnecessary personal details. Just what recruiters want to see.",
          },
          {
            title: "Templates that match",
            desc: "Professionally designed layouts optimized for ATS and German recruiters.",
          },
        ].map((x) => (
          <Card key={x.title} className="bg-white border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{x.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {x.desc}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

