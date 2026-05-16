import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Calendar, 
  Video, 
  Users, 
  Zap, 
  TrendingUp, 
  MapPin, 
  Briefcase, 
  MessageCircle,
  Coffee,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default function SessionsPage() {
  const meetUrl = process.env.NEXT_PUBLIC_GOOGLE_MEET_URL ?? "";

  const marketInsights = [
    {
      title: "High Demand Roles",
      icon: Briefcase,
      items: ["Software Engineering (Java, React, Go)", "DevOps & Cloud (AWS, Azure)", "Data Science & AI", "Renewable Energy Specialists"],
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Top Hiring Cities",
      icon: MapPin,
      items: ["Berlin (Tech/Startups)", "Munich (Auto/Engineering)", "Hamburg (Logistics/Media)", "Frankfurt (Finance/Fintech)"],
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "Market Trends",
      icon: TrendingUp,
      items: ["English-first teams increasing", "Hybrid work is standard", "Strict focus on Tech stack depth", "High value on EU certifications"],
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20 max-w-6xl space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline">
          Sessions & <span className="text-accent">Market Insights</span>
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Get direct guidance and real-time data to accelerate your job search in Germany.
        </p>
      </div>

      {/* Main Grid: Sessions */}
      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        {/* Sunday Group Session */}
        <Card className="flex flex-col border-2 border-primary/10 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
          <div className="bg-primary p-6 text-primary-foreground">
            <div className="flex justify-between items-center mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Weekly Event</span>
            </div>
            <CardTitle className="text-2xl mb-2">Sunday Group Session</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg">
              Every Sunday at 9:00 AM IST
            </CardDescription>
          </div>
          <CardContent className="p-8 flex-grow space-y-6">
            <p className="text-muted-foreground">
              A community-driven Q&A session where we discuss Chancenkarte, ATS-friendly CVs, and relocation strategies.
            </p>
            <ul className="space-y-3">
              {[
                "Live CV reviews (selected samples)",
                "Chancenkarte latest updates",
                "Q&A about German work culture",
                "Networking with fellow applicants"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="pt-4 mt-auto">
              {meetUrl ? (
                <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-14">
                  <a href={meetUrl} target="_blank" rel="noreferrer">
                    <Video className="mr-2 h-5 w-5" /> Join via Google Meet
                  </a>
                </Button>
              ) : (
                <div className="text-center p-4 bg-muted rounded-xl border border-dashed">
                  <p className="text-sm text-muted-foreground italic">Meet link will be active on Sunday morning.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Priority 1:1 Review */}
        <Card className="flex flex-col border-2 border-accent/20 shadow-lg hover:shadow-xl transition-shadow overflow-hidden bg-accent/5">
          <div className="bg-accent p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <Zap className="h-6 w-6" />
              </div>
              <span className="bg-white text-accent text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Premium Service</span>
            </div>
            <CardTitle className="text-2xl mb-2">Priority 1:1 CV Review</CardTitle>
            <CardDescription className="text-white/80 text-lg">
              Personalized strategy session
            </CardDescription>
          </div>
          <CardContent className="p-8 flex-grow space-y-6">
            <p className="text-muted-foreground">
              Want a deep dive into your profile? Book a private 30-minute session to perfect your application for specific German companies.
            </p>
            <ul className="space-y-3">
              {[
                "Comprehensive line-by-line CV audit",
                "Job-specific keyword optimization",
                "Personalized LinkedIn profile review",
                "Interview preparation basics"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="pt-4 mt-auto">
              <Button asChild size="lg" variant="default" className="w-full h-14 text-lg font-bold">
                <Link href="/buy-me-coffee">
                  <Coffee className="mr-2 h-5 w-5" /> Book a Session (₹99) <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Insights Section */}
      <div className="space-y-8 bg-muted/30 p-8 md:p-12 rounded-[2.5rem] border border-muted">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold font-headline flex items-center gap-3">
            <TrendingUp className="text-accent h-8 w-8" />
            Germany Market Insights
          </h2>
          <p className="text-muted-foreground">Snapshot of the current hiring landscape as of May 2026.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {marketInsights.map((insight, idx) => (
            <Card key={idx} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className={`p-3 w-fit rounded-2xl mb-2 ${insight.bg} ${insight.color}`}>
                  <insight.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{insight.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insight.items.map((item, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span className="text-muted-foreground font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-accent/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="font-bold text-lg">Need more specific data?</h4>
            <p className="text-sm text-muted-foreground">We update these insights weekly based on feedback from recruiters.</p>
          </div>
          <Button variant="outline" asChild className="shrink-0 border-accent text-accent hover:bg-accent/5">
            <Link href="/guide">Read Full Market Guide</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
