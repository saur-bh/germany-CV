import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Heart, Coffee, Calendar, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

export default function BuyMeCoffeePage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-transparent to-transparent -z-10" />
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent/15 rounded-full blur-[100px] -z-10" />

        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 max-w-4xl">
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest shadow-sm">
              <Heart className="h-3.5 w-3.5" /> Support This Project
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-foreground leading-[1.1]">
              This Isn't Charity.<br />
              <span className="text-accent">It's an Investment.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Every tool on this platform — the CV builder, the AI, the guide — was built by someone who went through the exact same Chancenkarte journey as you. Your ₹99 keeps it running and improving for thousands of job seekers.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-24 max-w-4xl space-y-16">

        {/* QR Payment - The Main Focus */}
        <div className="max-w-lg mx-auto">
          <Card className="border-2 border-accent/20 shadow-[0_20px_60px_-15px_rgba(255,100,50,0.15)] rounded-[2.5rem] overflow-hidden bg-white">
            <div className="h-1.5 bg-gradient-to-r from-accent to-primary" />
            <CardContent className="p-8 md:p-10 space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-2xl text-accent mb-2">
                  <Coffee className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold font-headline">Pay ₹99 via UPI</h2>
                <p className="text-sm text-muted-foreground">Scan with any UPI app — Google Pay, PhonePe, Paytm, etc.</p>
              </div>

              <div className="border-2 border-dashed border-accent/20 rounded-2xl bg-accent/5 p-6 flex justify-center">
                <Image
                  src="/api/qr"
                  alt="UPI QR code for ₹99 payment"
                  width={280}
                  height={280}
                  className="h-auto w-full max-w-[280px]"
                  priority
                />
              </div>

              <div className="space-y-3">
                {[
                  "Keeps the platform free for everyone",
                  "Funds AI server costs (DeepSeek API)",
                  "Unlocks priority 1:1 CV review session",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[10px] text-muted-foreground justify-center pt-2">
                <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                <span>Secure UPI payment. No card details needed.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What You Get */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold font-headline">What Happens After You Pay?</h2>
            <p className="text-muted-foreground">You get a full 60-minute strategy session with Saurabh Verma.</p>
          </div>

          <div className="grid gap-4 max-w-2xl mx-auto">
            {[
              { time: "00:05", title: "Welcome & Goal Setting", desc: "We align on your target roles, cities, and visa status so every minute counts." },
              { time: "00:30", title: "Live CV Tear-Down", desc: "First impression audit, rewriting bullet points with the X-Y-Z formula, and tech-stack clarity for German recruiters." },
              { time: "00:20", title: "Job Search Strategy", desc: "LinkedIn vs. Xing, local boards (StepStone, Indeed DE), recruiter outreach templates, and cultural nuances." },
              { time: "00:05", title: "Your Action Plan", desc: "Walk away with specific edits and weekly goals. No vague advice — only actionable next steps." },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start p-5 bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 mt-0.5">
                  {item.time}
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Book Session - Subtle, Secondary */}
        <div className="max-w-lg mx-auto">
          <Card className="bg-muted/30 border border-muted rounded-2xl">
            <CardContent className="p-8 space-y-5">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="font-bold">Already Paid? Book Your Slot</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                After completing the UPI payment above, pick a time that works for you on the calendar below. Please have your current CV open and ready to share on screen.
              </p>
              <a
                href="https://calendar.app.google/GwuUsxx89FjMeCpX8"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-primary/10 text-primary px-6 py-3 text-sm font-bold hover:bg-primary/20 transition-colors w-full border border-primary/20"
              >
                <Calendar className="mr-2 h-4 w-4" /> Open Booking Calendar <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <p className="text-[10px] text-muted-foreground text-center italic">
                Tip: Weekday evenings (IST) tend to have the most availability.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Skip Option - Very Subtle */}
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Not ready to pay? That's completely okay.
          </p>
          <Link
            href="/builder"
            className="text-xs text-muted-foreground/60 underline underline-offset-4 hover:text-muted-foreground transition-colors"
          >
            Skip and continue building my CV →
          </Link>
        </div>

      </div>
    </div>
  );
}
