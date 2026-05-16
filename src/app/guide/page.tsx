"use client";

import { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  BookOpen, 
  CheckCircle, 
  Info, 
  LucideIcon, 
  ShieldAlert, 
  CheckCircle2,
  XCircle,
  FileText,
  Briefcase,
  GraduationCap,
  Cpu,
  Globe,
  ChevronRight,
  ChevronLeft,
  Award,
  Book
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

const chapters = [
  { 
    title: "The Golden Rule", 
    icon: CheckCircle, 
    content: (
      <div className="space-y-6">
        <p className="text-lg leading-relaxed">In Germany, <b>clarity beats creativity</b>. A recruiter will spend less than 60 seconds on your CV. If they can't find what they need, they move on.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-white border-2 border-primary/10 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Optimal Length</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• 1 page for junior roles</p>
              <p>• Max 2 pages for senior roles</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-2 border-primary/10 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">File Format</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Always Save as PDF</p>
              <p>• Format: Name_Surname_CV.pdf</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  },
  { 
    title: "Design & ATS", 
    icon: ShieldAlert, 
    content: (
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-3 text-amber-700 font-bold">
            <AlertTriangle className="h-5 w-5" />
            <span>The ATS Trap</span>
          </div>
          <p className="text-sm leading-relaxed text-amber-800">
            Many Indian CVs use multi-column templates from Canva. <b>German ATS systems often fail to read these.</b> Stick to a single-column, text-heavy layout.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" /> The "Do" List
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>✅ Left-aligned text</li>
              <li>✅ Standard fonts (Arial, Calibri)</li>
              <li>✅ Consistent bullet points</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" /> The "Don't" List
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>❌ Multiple columns</li>
              <li>❌ Skill bars / Stars</li>
              <li>❌ Photos (mostly optional now)</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  { 
    title: "The Ideal Structure", 
    icon: BookOpen, 
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Order matters. Follow this exact sequence:</p>
        <div className="space-y-2">
          {[
            "Personal Details (Top)",
            "Profile Summary",
            "Work Experience (Reverse-chronological)",
            "Education & Certifications",
            "Skills Keywords",
            "Languages (CEFR Levels)",
            "Work Authorization & Availability"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-white border rounded-xl shadow-sm">
              <div className="bg-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shrink-0">{i+1}</div>
              <span className="font-medium text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
  { 
    title: "Personal Details", 
    icon: Info, 
    content: (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">In Germany, privacy is key. Only include what's necessary.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-green-50/50 border-green-100">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-green-700">Must Include</CardTitle></CardHeader>
            <CardContent className="text-xs space-y-1 opacity-80">
              <p>• City + Country (e.g. Pune, India)</p>
              <p>• Phone with +91 code</p>
              <p>• LinkedIn URL</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50/50 border-red-100">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-bold text-red-700">Avoid</CardTitle></CardHeader>
            <CardContent className="text-xs space-y-1 opacity-80">
              <p>• Gender / Marital Status</p>
              <p>• Passport Number</p>
              <p>• Full Street Address</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  },
  { 
    title: "Work Experience", 
    icon: Briefcase, 
    content: (
      <div className="space-y-6">
        <p className="text-muted-foreground">Focus on <b>Impact</b>, not just responsibilities.</p>
        <div className="p-6 bg-white border-2 border-dashed rounded-2xl space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">The X-Y-Z Formula</p>
          <p className="text-sm italic">"Accomplished [X] as measured by [Y], by doing [Z]"</p>
          <div className="space-y-2 pt-2">
            <p className="text-xs text-green-600 font-bold">Good Example:</p>
            <p className="text-sm bg-green-50 p-3 rounded-lg border border-green-100">
              "Reduced automation suite execution time by 40% (X) by implementing parallel execution (Z) in Playwright, resulting in faster CI feedback cycles (Y)."
            </p>
          </div>
        </div>
      </div>
    )
  },
  { 
    title: "Languages & Visa", 
    icon: Globe, 
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-bold flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> Language Levels</h4>
          <p className="text-sm text-muted-foreground">Use CEFR levels (A1-C2). Indians often overestimate 'Fluent'. Be honest.</p>
          <div className="grid grid-cols-3 gap-2">
            {["A1/A2: Basic", "B1/B2: Independent", "C1/C2: Proficient"].map(l => (
              <div key={l} className="text-[10px] bg-muted p-2 rounded-lg text-center font-bold">{l}</div>
            ))}
          </div>
        </div>
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-bold flex items-center gap-2"><Award className="h-5 w-5 text-accent" /> Work Authorization</h4>
          <p className="text-sm">Crucial for international applicants. State if you have the <b>Chancenkarte</b> or require sponsorship.</p>
        </div>
      </div>
    )
  },
  { 
    title: "Final Checklist", 
    icon: CheckCircle2, 
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Before you hit "Apply", check these:</p>
        <div className="grid gap-3">
          {[
            "PDF format (No .docx)",
            "Spelling & Grammar (Use tools like DeepL/Grammarly)",
            "LinkedIn matches your CV exactly",
            "Keywords from Job Description included",
            "Max 2 pages"
          ].map(check => (
            <div key={check} className="flex items-center gap-3 p-4 bg-green-50/50 border border-green-100 rounded-2xl">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">{check}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
];

export default function GuidePage() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem("guide_progress");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  const progress = ((currentChapter + 1) / chapters.length) * 100;
  const isLast = currentChapter === chapters.length - 1;
  const activeChapter = chapters[currentChapter];

  const handleNext = () => {
    if (!completed.includes(currentChapter)) {
      const newCompleted = [...completed, currentChapter];
      setCompleted(newCompleted);
      window.localStorage.setItem("guide_progress", JSON.stringify(newCompleted));
      
      // Party Popper!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#f59e0b', '#10b981']
      });
    }
    if (!isLast) setCurrentChapter(prev => prev + 1);
  };

  return (
    <div className="bg-background min-h-screen pb-20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent -z-10" />
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 py-16 md:py-24 max-w-7xl">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest shadow-sm">
              <Book className="h-4 w-4" /> Stop the Rejections. Start Getting Interviews.
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tight text-foreground leading-[1.1]">
              The Ultimate <span className="text-accent relative inline-block">
                German CV
                <div className="absolute -bottom-2 left-0 w-full h-2 bg-accent/30 blur-md rounded-full" />
              </span> Playbook
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We've analyzed thousands of successful applications from international professionals. Here is exactly what German HR managers are looking for.
            </p>
          </div>

          {/* Expansive Book Layout */}
          <div className="relative mt-16 z-10">
            <Card className="border border-white/40 shadow-[0_40px_100px_-20px_rgba(37,99,235,0.15)] rounded-[2.5rem] overflow-hidden bg-white/60 backdrop-blur-3xl">
              <div className="flex flex-col lg:flex-row min-h-[650px]">
                
                {/* Sidebar Navigation (Gamified) */}
                <div className="bg-primary/5 lg:w-[320px] p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-primary/10 shrink-0">
                  <div className="space-y-8">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Your Journey</p>
                      <Progress value={progress} className="h-2 rounded-full bg-primary/10" />
                      <p className="text-right text-[10px] text-muted-foreground mt-2 font-bold">{Math.round(progress)}% Complete</p>
                    </div>
                    
                    <nav className="space-y-2">
                      {chapters.map((ch, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentChapter(i)}
                          className={cn(
                            "w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left group",
                            currentChapter === i 
                              ? "bg-white text-primary shadow-md scale-[1.02] border border-primary/10" 
                              : completed.includes(i)
                                ? "text-green-700 hover:bg-green-50"
                                : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
                          )}
                        >
                          <div className={cn(
                            "h-6 w-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors",
                            currentChapter === i ? "border-primary text-primary" 
                            : completed.includes(i) ? "bg-green-500 border-green-500 text-white" 
                            : "border-muted-foreground/30 text-muted-foreground/50 group-hover:border-foreground/30"
                          )}>
                            {completed.includes(i) ? <CheckCircle className="h-3 w-3" /> : <span className="text-[10px]">{i+1}</span>}
                          </div>
                          {ch.title}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="p-8 md:p-12 lg:p-16 flex-1 flex flex-col justify-between bg-white/50">
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto w-full">
                    <div className="flex items-center gap-5">
                      <div className="p-4 bg-accent/10 rounded-2xl text-accent shadow-inner">
                        <activeChapter.icon className="h-10 w-10" />
                      </div>
                      <h2 className="text-4xl lg:text-5xl font-bold font-headline text-foreground">{activeChapter.title}</h2>
                    </div>
                    
                    <div className="prose prose-lg prose-slate max-w-none prose-headings:font-headline prose-p:text-muted-foreground prose-p:leading-relaxed">
                      {activeChapter.content}
                    </div>
                  </div>

                  <div className="pt-16 mt-12 border-t border-primary/10 flex flex-col sm:flex-row justify-between items-center gap-6 max-w-3xl mx-auto w-full">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentChapter(prev => Math.max(0, prev - 1))}
                      disabled={currentChapter === 0}
                      className="rounded-2xl h-14 px-6 text-base font-medium hover:bg-primary/5 w-full sm:w-auto"
                    >
                      <ChevronLeft className="mr-2 h-5 w-5" /> Previous Chapter
                    </Button>
                    
                    {isLast ? (
                      <Button asChild className="bg-green-600 hover:bg-green-700 text-white rounded-2xl h-14 px-10 font-bold text-lg shadow-[0_10px_25px_-5px_rgba(22,163,74,0.4)] w-full sm:w-auto">
                        <Link href="/builder">Build My CV Now <ChevronRight className="ml-2 h-5 w-5" /></Link>
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 px-10 font-bold text-lg shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] w-full sm:w-auto transition-transform active:scale-95"
                      >
                        Next Chapter <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>

              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
