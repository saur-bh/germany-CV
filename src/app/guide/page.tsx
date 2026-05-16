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
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
              <Book className="h-4 w-4" /> Comprehensive Guide
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-primary">
              The German CV <span className="text-accent">Playbook</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto italic">
              Specifically designed for Indian professionals targeting the German market.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3 max-w-xl mx-auto">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>Your Reading Journey</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2 rounded-full bg-white shadow-inner" />
          </div>

          {/* Book Layout */}
          <div className="relative mt-12">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-[3rem] -z-10 blur-3xl" />
            
            <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden bg-white/80 backdrop-blur-xl">
              <div className="grid md:grid-cols-[300px_1fr] min-h-[500px]">
                {/* Sidebar Navigation (Gamified) */}
                <div className="bg-primary p-8 text-primary-foreground hidden md:block">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-8">Chapters</p>
                  <nav className="space-y-2">
                    {chapters.map((ch, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentChapter(i)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left",
                          currentChapter === i 
                            ? "bg-white text-primary shadow-lg scale-105" 
                            : completed.includes(i)
                              ? "text-green-400 hover:bg-white/10"
                              : "text-white/40 hover:bg-white/5"
                        )}
                      >
                        <div className={cn(
                          "h-5 w-5 rounded-full flex items-center justify-center shrink-0 border",
                          completed.includes(i) ? "bg-green-500 border-green-500" : "border-white/20"
                        )}>
                          {completed.includes(i) ? <CheckCircle className="h-3 w-3 text-white" /> : <span>{i+1}</span>}
                        </div>
                        {ch.title}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Main Content Area */}
                <div className="p-8 md:p-16 flex flex-col justify-between">
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-accent/10 rounded-2xl text-accent">
                        <activeChapter.icon className="h-8 w-8" />
                      </div>
                      <h2 className="text-3xl font-bold font-headline">{activeChapter.title}</h2>
                    </div>
                    
                    <div className="prose prose-slate max-w-none">
                      {activeChapter.content}
                    </div>
                  </div>

                  <div className="pt-12 flex justify-between items-center mt-auto border-t">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentChapter(prev => Math.max(0, prev - 1))}
                      disabled={currentChapter === 0}
                      className="rounded-xl h-12"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    
                    {isLast ? (
                      <Button asChild className="bg-green-600 hover:bg-green-700 rounded-xl h-12 px-8 font-bold shadow-lg shadow-green-100">
                        <Link href="/builder">Start Building My CV <ChevronRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        className="bg-primary hover:bg-primary/90 rounded-xl h-12 px-8 font-bold shadow-lg shadow-primary/20"
                      >
                        Next Chapter <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center pt-8">
            <p className="text-xs text-muted-foreground italic">
              ✨ Completed this playbook? You're now ahead of 80% of applicants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
