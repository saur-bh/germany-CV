"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Cpu, 
  Globe, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  Download,
  AlertCircle,
  FileText,
  Trash2,
  Info,
  Eye,
  ShieldCheck
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CVPreview } from "./CVPreview";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import confetti from "canvas-confetti";

const steps = [
  { id: "personal", title: "Personal Details", icon: User },
  { id: "chancenkarte", title: "Chancenkarte & Availability", icon: Info },
  { id: "summary", title: "Profile Summary", icon: FileText },
  { id: "experience", title: "Professional Experience", icon: Briefcase },
  { id: "education", title: "Education & Certificates", icon: GraduationCap },
  { id: "skills", title: "Technical Skills", icon: Cpu },
  { id: "languages", title: "Languages", icon: Globe },
  { id: "support", title: "Support (Optional)", icon: Info },
  { id: "final", title: "Checklist & Review", icon: CheckCircle },
];

export default function BuilderPage() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [cvData, setCvData] = useState({
    personal: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      linkedin: "",
      workAuth: "",
      dob: "",
      nationality: "",
    },
    chance: {
      currentCity: "",
      targetCity: "",
      availability: "",
      visaStatus: "",
      template: "one-page" as "one-page" | "two-page",
    },
    targetRole: "",
    summary: "",
    experience: [{ id: 1, title: "", company: "", location: "", duration: "", description: "" }],
    education: [{ id: 1, degree: "", school: "", location: "", year: "" }],
    skills: [] as string[],
    languages: [{ id: 1, name: "", level: "A1" }],
  });

  const updateCV = (section: string, data: any) => {
    setCvData(prev => ({ ...prev, [section]: data }));
  };

  const nextStep = () => currentStep < steps.length - 1 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  const progress = ((currentStep + 1) / steps.length) * 100;
  const stepId = steps[currentStep]?.id;

  const [deepseekKey, setDeepseekKey] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [isParsing, setIsParsing] = useState(false);
  const [aiRefining, setAiRefining] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user);
        setAuthLoading(false);
      });
    } else {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const savedKey = window.localStorage.getItem("deepseek_key");
      if (savedKey) setDeepseekKey(savedKey);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("deepseek_key", deepseekKey);
    } catch {}
  }, [deepseekKey]);

  const callAI = async (
    task: "profile_summary" | "skills" | "experience_bullets" | "parse_resume",
    input: Record<string, unknown>
  ) => {
    const response = await fetch("/api/ai/deepseek", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task,
        input,
        userApiKey: deepseekKey,
      }),
    });

    const json = (await response.json().catch(() => null)) as
      | { text?: string; error?: string }
      | null;

    if (!response.ok) {
      const msg = json?.error ?? "AI request failed";
      toast({ title: "AI error", description: msg, variant: "destructive" });
      return null;
    }

    return json?.text ?? null;
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1. Extract text from file
      const parseRes = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      if (!parseRes.ok) {
        const err = await parseRes.json().catch(() => ({ error: "Unknown error" }));
        console.error("Parse API failed:", err);
        throw new Error(err.error || "Failed to extract text from file");
      }

      const { text: resumeText } = await parseRes.json();
      console.log("Extracted text length:", resumeText?.length);

      if (!resumeText || resumeText.length < 10) {
        console.error("Insufficient text extracted:", resumeText);
        throw new Error("Could not find enough text in your resume. Please try a different file.");
      }

      // 2. Call AI to parse resume
      const aiResponse = await callAI("parse_resume", { resumeText });

      if (aiResponse) {
        try {
          const parsedData = JSON.parse(aiResponse.replace(/```json\n?|\n?```/g, ""));
          
          // 3. Merge with existing data
          setCvData((prev) => ({
            ...prev,
            personal: { ...prev.personal, ...parsedData.personal },
            summary: parsedData.summary || prev.summary,
            experience: parsedData.experience?.length 
              ? parsedData.experience.map((e: any, i: number) => ({ id: i + 1, ...e })) 
              : prev.experience,
            education: parsedData.education?.length
              ? parsedData.education.map((e: any, i: number) => ({ id: i + 1, ...e }))
              : prev.education,
            skills: parsedData.skills || prev.skills,
            languages: parsedData.languages?.length
              ? parsedData.languages.map((l: any, i: number) => ({ id: i + 1, ...l }))
              : prev.languages,
          }));

          // 4. Upload to Supabase Storage if user is logged in
          const supabase = createSupabaseBrowserClient();
          if (supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const fileExt = file.name.split('.').pop();
              const fileName = `${user.id}/${Date.now()}.${fileExt}`;
              
              const { error: uploadError } = await supabase.storage
                .from('resumes')
                .upload(fileName, file);
                
              if (uploadError) {
                console.error("Storage upload error:", uploadError);
                toast({
                  title: "Storage Error",
                  description: "Failed to save resume to your account. You can still use the builder.",
                  variant: "destructive",
                });
              } else {
                toast({
                  title: "Success",
                  description: "Resume saved to your account.",
                });
              }
            }
          }

          toast({
            title: "Resume parsed successfully!",
            description: "Review and refine the populated details.",
          });
        } catch (e) {
          console.error("JSON parse error", e);
          toast({
            title: "Parsing error",
            description: "AI returned invalid format. Try again or enter manually.",
            variant: "destructive",
          });
        }
      }
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsParsing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary to-accent" />
          <CardContent className="p-12 text-center space-y-8">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold font-headline">Login Required</h1>
              <p className="text-muted-foreground leading-relaxed">
                To build your professional CV and save your progress, you need to be part of our community.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-2xl">
                <Link href="/login">Login to My Account</Link>
              </Button>
              <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary">
                <Link href="/signup">Don't have an account? Sign up</Link>
              </Button>
            </div>
            <div className="pt-6 border-t">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                Trusted by 2,400+ international professionals
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <div className="container mx-auto px-4 md:px-6 pt-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
            <div className="mb-10 space-y-2 flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">
                  Your German <span className="text-accent">Career Start</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  Tailored for international talent & <b>Chancenkarte</b> holders.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-white/50 px-2 py-1 rounded-full border">
                  <ShieldCheck className="h-3 w-3 text-green-600" />
                  <span>Privacy First: We don't save your data.</span>
                </div>
              </div>
            </div>

            {/* Floating Mobile/Tablet Preview Toggle */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
              <Button 
                onClick={() => setShowPreview(!showPreview)}
                className="rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-white h-14 px-8 border-4 border-white font-bold"
              >
                {showPreview ? <><ChevronLeft className="mr-2 h-5 w-5" /> Back to Edit</> : <><Eye className="mr-2 h-5 w-5" /> Live Preview</>}
              </Button>
            </div>

          <div className={cn(
            "grid gap-8 items-start transition-all duration-500",
            showPreview ? "lg:grid-cols-[240px_1fr_1fr]" : "lg:grid-cols-[280px_1fr_320px]"
          )}>
            {/* Step Indicator Sidebar (Desktop) */}
            <aside className="hidden lg:block sticky top-28 space-y-4">
              <div className="bg-white/50 backdrop-blur-md border border-white/20 rounded-[2rem] p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 px-2">Progress</p>
                <nav className="space-y-1">
                  {steps.map((step, idx) => {
                    const isCompleted = idx < currentStep;
                    const isCurrent = idx === currentStep;
                    const Icon = step.icon;

                    return (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStep(idx)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group",
                          isCurrent 
                            ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]" 
                            : isCompleted 
                              ? "text-green-600 hover:bg-green-50" 
                              : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <div className={cn(
                          "p-1.5 rounded-lg transition-colors",
                          isCurrent ? "bg-white/20" : isCompleted ? "bg-green-100" : "bg-muted"
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="truncate">{step.title}</span>
                        {isCompleted && <CheckCircle className="h-4 w-4 ml-auto" />}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main Form Area */}
            <div className="space-y-6">
              <Card className="shadow-xl border-none bg-white/70 backdrop-blur-xl rounded-[2rem] overflow-hidden">
                <div className="p-1 bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x" />
                <CardContent className="p-8 md:p-12">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold font-headline">{steps[currentStep].title}</h2>
                    <div className="text-sm font-medium text-muted-foreground">
                      {Math.round(progress)}% Complete
                    </div>
                  </div>

                  {stepId === "personal" && (
                    <div className="mb-8 p-6 bg-primary/5 border border-primary/20 rounded-2xl space-y-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="font-bold">Quick Start: Upload Existing Resume</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Upload your PDF or DOCX resume. AI will extract the text and auto-fill your CV fields.
                      </p>
                      {!deepseekKey && (
                        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>Set your <b>DeepSeek API key</b> in the AI Settings panel (right sidebar) to enable resume parsing.</span>
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <Input 
                          type="file"
                          accept=".pdf,.docx,.txt"
                          disabled={isParsing || !deepseekKey}
                          className="max-w-xs bg-white"
                          onChange={handleResumeUpload}
                        />
                        {isParsing && (
                          <div className="flex items-center gap-2 text-sm text-primary font-medium">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                            Parsing...
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-medium text-primary">
                        ✨ Pro Tip: You can also use AI to generate your summary and experience bullets in the following steps!
                      </p>
                    </div>
                  )}

                {stepId === "personal" && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          value={cvData.personal.fullName} 
                          onChange={(e) => updateCV("personal", { ...cvData.personal, fullName: e.target.value })} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={cvData.personal.email} 
                          onChange={(e) => updateCV("personal", { ...cvData.personal, email: e.target.value })} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={cvData.personal.phone} 
                          onChange={(e) => updateCV("personal", { ...cvData.personal, phone: e.target.value })} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address / Location</Label>
                        <Input 
                          id="address" 
                          value={cvData.personal.address} 
                          placeholder="City, Germany (or current location)"
                          onChange={(e) => updateCV("personal", { ...cvData.personal, address: e.target.value })} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={cvData.personal.linkedin}
                          placeholder="https://linkedin.com/in/yourname"
                          onChange={(e) =>
                            updateCV("personal", { ...cvData.personal, linkedin: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workAuth">Work Authorization & Relocation Status</Label>
                      <Input 
                        id="workAuth" 
                        value={cvData.personal.workAuth} 
                        placeholder="e.g. EU Citizen, Blue Card Eligible, etc."
                        onChange={(e) => updateCV("personal", { ...cvData.personal, workAuth: e.target.value })} 
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth (Optional)</Label>
                        <Input
                          id="dob"
                          value={cvData.personal.dob}
                          placeholder="DD/MM/YYYY"
                          onChange={(e) =>
                            updateCV("personal", { ...cvData.personal, dob: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nationality">Nationality (Optional)</Label>
                        <Input
                          id="nationality"
                          value={cvData.personal.nationality}
                          placeholder="Indian"
                          onChange={(e) =>
                            updateCV("personal", { ...cvData.personal, nationality: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {stepId === "chancenkarte" && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="targetRole">Target Role</Label>
                        <Input
                          id="targetRole"
                          value={cvData.targetRole}
                          placeholder="e.g. QA Automation Engineer"
                          onChange={(e) => updateCV("targetRole", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>CV Template</Label>
                        <div className="flex flex-col gap-2 text-sm">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="template"
                              checked={cvData.chance.template === "one-page"}
                              onChange={() =>
                                updateCV("chance", { ...cvData.chance, template: "one-page" })
                              }
                            />
                            <span>One-page (single column)</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="template"
                              checked={cvData.chance.template === "two-page"}
                              onChange={() =>
                                updateCV("chance", { ...cvData.chance, template: "two-page" })
                              }
                            />
                            <span>Two-page (sidebar + photo)</span>
                          </label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="visaStatus">Visa / Chancenkarte Status</Label>
                        <Input
                          id="visaStatus"
                          value={cvData.chance.visaStatus}
                          placeholder="e.g. Chancenkarte approved / applied / planning"
                          onChange={(e) =>
                            updateCV("chance", { ...cvData.chance, visaStatus: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currentCity">Current City</Label>
                        <Input
                          id="currentCity"
                          value={cvData.chance.currentCity}
                          placeholder="e.g. Pune, India"
                          onChange={(e) =>
                            updateCV("chance", { ...cvData.chance, currentCity: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="targetCity">Target City (Germany)</Label>
                        <Input
                          id="targetCity"
                          value={cvData.chance.targetCity}
                          placeholder="e.g. Berlin / Munich / Any"
                          onChange={(e) =>
                            updateCV("chance", { ...cvData.chance, targetCity: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability / Relocation Timeline</Label>
                      <Input
                        id="availability"
                        value={cvData.chance.availability}
                        placeholder="e.g. Can relocate in Aug 2026"
                        onChange={(e) =>
                          updateCV("chance", { ...cvData.chance, availability: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Photo (Optional)</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = URL.createObjectURL(file);
                          setPhotoUrl(url);
                        }}
                      />
                    </div>
                    <div className="p-4 bg-accent/5 rounded-lg border border-accent/20 flex gap-3">
                      <Info className="h-5 w-5 text-accent shrink-0" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Keep your work authorization crystal clear. German recruiters reject CVs when visa/work status is missing or confusing.
                      </p>
                    </div>
                  </div>
                )}

                {stepId === "summary" && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    {!deepseekKey && (
                      <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>Set your <b>DeepSeek API key</b> in the AI Settings panel (right sidebar) to enable AI features.</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-3">
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!deepseekKey || aiRefining === 'summary'}
                          onClick={async () => {
                            setAiRefining('summary');
                            try {
                              const text = await callAI("profile_summary", {
                                targetRole: cvData.targetRole,
                                workAuth: cvData.personal.workAuth,
                                language: cvData.languages
                                  .map((l) => `${l.name || "Language"} ${l.level}`)
                                  .join(", "),
                                experience: cvData.experience
                                  .map((e) => `${e.title} at ${e.company}: ${e.description}`)
                                  .join("\n"),
                                skills: cvData.skills.join(", "),
                              });
                              if (text) {
                                updateCV("summary", text);
                                toast({ title: "✨ Summary generated!", description: "Review and edit as needed." });
                              }
                            } finally {
                              setAiRefining(null);
                            }
                          }}
                        >
                          {aiRefining === 'summary' ? 'Generating...' : '✨ Generate with AI'}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Use DeepSeek. Choose “Use my key (₹99)” or paste your own DeepSeek API key in the AI settings.
                      </p>
                    </div>
                    <Textarea 
                      id="summary" 
                      className="min-h-[200px]"
                      placeholder="Highlight your key achievements and years of experience..."
                      value={cvData.summary}
                      onChange={(e) => updateCV("summary", e.target.value)}
                    />
                    <div className="p-4 bg-accent/5 rounded-lg border border-accent/20 flex gap-3">
                      <AlertCircle className="h-5 w-5 text-accent shrink-0" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <strong>Germany Insight:</strong> Keep it factual. Focus on years of experience, core technologies, and specific achievements. Avoid empty buzzwords like "dynamic" or "self-starter."
                      </p>
                    </div>
                  </div>
                )}

                {stepId === "experience" && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    {cvData.experience.map((exp, idx) => (
                      <div key={exp.id} className="p-6 border rounded-xl space-y-4 relative group">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            const newExp = cvData.experience.filter(e => e.id !== exp.id);
                            updateCV("experience", newExp);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Job Title</Label>
                            <Input 
                              value={exp.title} 
                              onChange={(e) => {
                                const newExp = [...cvData.experience];
                                newExp[idx].title = e.target.value;
                                updateCV("experience", newExp);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Company</Label>
                            <Input 
                              value={exp.company} 
                              onChange={(e) => {
                                const newExp = [...cvData.experience];
                                newExp[idx].company = e.target.value;
                                updateCV("experience", newExp);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Company Location</Label>
                            <Input
                              value={exp.location}
                              placeholder="City (optional), Country"
                              onChange={(e) => {
                                const newExp = [...cvData.experience];
                                newExp[idx].location = e.target.value;
                                updateCV("experience", newExp);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Duration (e.g. 2021 - Present)</Label>
                            <Input 
                              value={exp.duration} 
                              onChange={(e) => {
                                const newExp = [...cvData.experience];
                                newExp[idx].duration = e.target.value;
                                updateCV("experience", newExp);
                              }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Description / Bullet Points</Label>
                          <Textarea 
                            placeholder={"Write 3-6 bullet points (one per line). Example:\nImplemented X to reduce Y by 25%\nBuilt Z using React + Node\nImproved performance from A to B"}
                            value={exp.description}
                            onChange={(e) => {
                              const newExp = [...cvData.experience];
                              newExp[idx].description = e.target.value;
                              updateCV("experience", newExp);
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between gap-3 pt-2">
                          <p className="text-xs text-muted-foreground">
                            Tip: 4–6 bullets max. Add metrics (%/time/€) where possible.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!deepseekKey || aiRefining === `exp-${idx}`}
                            onClick={async () => {
                              setAiRefining(`exp-${idx}`);
                              try {
                                const text = await callAI("experience_bullets", {
                                  experienceText: exp.description,
                                  jobTitle: exp.title,
                                  company: exp.company,
                                  location: exp.location,
                                  duration: exp.duration,
                                });
                                if (text) {
                                  const newExp = [...cvData.experience];
                                  newExp[idx].description = text
                                    .split("\n")
                                    .map((l) => l.replace(/^[-•\s]+/, "").trim())
                                    .filter(Boolean)
                                    .join("\n");
                                  updateCV("experience", newExp);
                                  toast({ title: "✨ Bullet points refined!", description: "Review and edit as needed." });
                                }
                              } finally {
                                setAiRefining(null);
                              }
                            }}
                          >
                            {aiRefining === `exp-${idx}` ? 'Refining...' : '✨ Refine with AI'}
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full border-dashed"
                      onClick={() =>
                        updateCV("experience", [
                          ...cvData.experience,
                          { id: Date.now(), title: "", company: "", location: "", duration: "", description: "" },
                        ])
                      }
                    >
                      + Add Experience
                    </Button>
                  </div>
                )}

                {stepId === "education" && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    {cvData.education.map((ed, idx) => (
                      <div key={ed.id} className="p-6 border rounded-xl space-y-4 relative group">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            const next = cvData.education.filter((e) => e.id !== ed.id);
                            updateCV(
                              "education",
                              next.length
                                ? next
                                : [{ id: Date.now(), degree: "", school: "", location: "", year: "" }]
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Degree / Certificate</Label>
                            <Input
                              value={ed.degree}
                              placeholder="BTech, MBA, ISTQB, etc."
                              onChange={(e) => {
                                const next = [...cvData.education];
                                next[idx].degree = e.target.value;
                                updateCV("education", next);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Institute / University</Label>
                            <Input
                              value={ed.school}
                              placeholder="University name"
                              onChange={(e) => {
                                const next = [...cvData.education];
                                next[idx].school = e.target.value;
                                updateCV("education", next);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                              value={ed.location}
                              placeholder="City, Country"
                              onChange={(e) => {
                                const next = [...cvData.education];
                                next[idx].location = e.target.value;
                                updateCV("education", next);
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Year</Label>
                            <Input
                              value={ed.year}
                              placeholder="2019"
                              onChange={(e) => {
                                const next = [...cvData.education];
                                next[idx].year = e.target.value;
                                updateCV("education", next);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full border-dashed"
                      onClick={() =>
                        updateCV("education", [
                          ...cvData.education,
                          { id: Date.now(), degree: "", school: "", location: "", year: "" },
                        ])
                      }
                    >
                      + Add Education / Certificate
                    </Button>
                  </div>
                )}

                {stepId === "skills" && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold">Technical & Professional Skills</p>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!deepseekKey || aiRefining === 'skills'}
                        onClick={async () => {
                          setAiRefining('skills');
                          try {
                            const text = await callAI("skills", {
                              targetRole: cvData.targetRole,
                              experience: cvData.experience
                                .map((e) => `${e.title} at ${e.company}: ${e.description}`)
                                .join("\n"),
                            });
                            if (!text) return;
                            const nextSkills = text
                              .split(/[\n,•]/g)
                              .map((s) => s.trim())
                              .filter(Boolean)
                              .map((s) => s.replace(/^[-•\s]+/, "").trim());
                            updateCV("skills", Array.from(new Set([...cvData.skills, ...nextSkills])));
                            toast({ title: "✨ Skills suggested!", description: "Remove any that don't apply." });
                          } finally {
                            setAiRefining(null);
                          }
                        }}
                      >
                        {aiRefining === 'skills' ? 'Suggesting...' : '✨ Suggest with AI'}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[100px] p-4 border rounded-xl bg-muted/20">
                      {cvData.skills.map(skill => (
                        <div key={skill} className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          {skill}
                          <Trash2 className="h-3 w-3 cursor-pointer opacity-50 hover:opacity-100" onClick={() => updateCV("skills", cvData.skills.filter(s => s !== skill))} />
                        </div>
                      ))}
                      {cvData.skills.length === 0 && <p className="text-sm text-muted-foreground italic">No skills added yet.</p>}
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add a skill (e.g. React, Docker, Project Management)" 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value;
                            if (val && !cvData.skills.includes(val)) {
                              updateCV("skills", [...cvData.skills, val]);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                )}

                {stepId === "languages" && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="space-y-4">
                      <p className="font-bold">Languages (CEFR)</p>
                      <div className="space-y-4">
                        {cvData.languages.map((lang, idx) => (
                          <div key={lang.id} className="grid md:grid-cols-[1fr_140px_40px] gap-3 items-end">
                            <div className="space-y-2">
                              <Label>Language</Label>
                              <Input
                                value={lang.name}
                                placeholder="English / German / Hindi"
                                onChange={(e) => {
                                  const next = [...cvData.languages];
                                  next[idx] = { ...lang, name: e.target.value };
                                  updateCV("languages", next);
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Level</Label>
                              <select
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={lang.level}
                                onChange={(e) => {
                                  const next = [...cvData.languages];
                                  next[idx] = { ...lang, level: e.target.value };
                                  updateCV("languages", next);
                                }}
                              >
                                {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
                                  <option key={lvl} value={lvl}>
                                    {lvl}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-red-500"
                              onClick={() => {
                                const next = cvData.languages.filter((l) => l.id !== lang.id);
                                updateCV("languages", next.length === 0 ? [{ id: Date.now(), name: "", level: "A1" }] : next);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        className="w-full border-dashed"
                        onClick={() =>
                          updateCV("languages", [
                            ...cvData.languages,
                            { id: Date.now(), name: "", level: "A1" },
                          ])
                        }
                      >
                        + Add Language
                      </Button>
                    </div>
                  </div>
                )}

                {stepId === "support" && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">Buy me a coffee (optional)</h2>
                      <p className="text-muted-foreground">
                        If this helped you, you can support it. You can also skip and finish your CV.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 items-start">
                      <Card className="bg-white border shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Pay ₹99 via UPI</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <img
                            src="/api/qr"
                            alt="UPI QR"
                            className="w-full max-w-[260px] border rounded-lg"
                          />
                          <Button asChild className="bg-accent hover:bg-accent/90 text-white w-full">
                            <Link href="/buy-me-coffee">Open full page</Link>
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">AI key usage</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-muted-foreground">
                          <p>
                            If you choose “Use my key”, you need to pay ₹99. If not, paste your own DeepSeek API key in AI settings.
                          </p>
                          <div className="flex gap-3">
                            <Button variant="outline" className="w-full" onClick={nextStep}>
                              Skip
                            </Button>
                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={nextStep}>
                              Continue
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {stepId === "final" && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="text-center space-y-2">
                      <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full text-green-600 mb-2">
                        <CheckCircle className="h-10 w-10" />
                      </div>
                      <h2 className="text-2xl font-bold">Ready to Export!</h2>
                      <p className="text-muted-foreground">Perform one final check before downloading your CV.</p>
                    </div>

                    <div className="grid gap-4">
                      {[
                        cvData.chance.template === "two-page"
                          ? "Two-page layout matches the template (sidebar + main column)"
                          : "One-page layout matches the template",
                        "Professional Summary is 3-5 sentences maximum",
                        "Experience lists quantifiable results with action verbs",
                        "Language levels use CEFR (A1-C2) standards",
                        "Work permit status is explicitly mentioned",
                        "No skill bars or vague graphic indicators",
                        "Contact details include LinkedIn and location",
                      ].map((check, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 border rounded-lg bg-white">
                          <div className="mt-0.5">
                            <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-accent focus:ring-accent" defaultChecked />
                          </div>
                          <span className="text-sm">{check}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                      <Button 
                        className="bg-accent hover:bg-accent/90 text-white font-bold h-12 px-8" 
                        onClick={() => {
                          confetti({
                            particleCount: 150,
                            spread: 80,
                            origin: { y: 0.6 },
                            colors: ['#2563eb', '#f59e0b', '#10b981']
                          });
                          window.print();
                        }}
                      >
                        <Download className="mr-2 h-5 w-5" /> Download PDF
                      </Button>
                    </div>

                    <div className="mt-12 p-8 bg-primary/5 border border-primary/20 rounded-[2rem] space-y-6">
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="h-20 w-20 rounded-full bg-accent text-white flex items-center justify-center text-2xl font-bold shrink-0">SV</div>
                        <div className="space-y-2 text-center md:text-left">
                          <h3 className="text-xl font-bold">Need a professional review?</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            I'm <b>Saurabh Verma</b>, and I help international talent land jobs in Germany. 
                            Book a 1:1 session for a detailed CV review or interview preparation.
                          </p>
                        </div>
                        <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 shrink-0">
                          <Link href="/buy-me-coffee">Book Consultation</Link>
                        </Button>
                      </div>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                      Save your PDF as <span className="font-semibold">FirstName_LastName_CV.pdf</span>{" "}
                      (example: <span className="font-semibold">Saurabh_Verma_CV.pdf</span>). Avoid spaces and symbols.
                    </div>

                    <div className="flex justify-center">
                      <Button asChild variant="outline" className="border-primary">
                        <Link href="/guide">Read CV Guide</Link>
                      </Button>
                    </div>
                  </div>
                )}
                  {/* Footer Navigation */}
                  <div className="flex justify-between items-center pt-10 mt-10 border-t">
                    <Button 
                      variant="ghost" 
                      onClick={prevStep} 
                      disabled={currentStep === 0}
                      className="px-6 rounded-xl hover:bg-muted"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    
                    {currentStep < steps.length - 1 ? (
                      <Button 
                        onClick={nextStep} 
                        className="px-10 rounded-xl bg-primary hover:bg-primary/90 h-12 text-base font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                      >
                        Next Step <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    ) : (
                      <Button 
                        className="px-10 rounded-xl bg-green-600 hover:bg-green-700 h-12 text-base font-bold shadow-lg shadow-green-200" 
                        onClick={() => {
                          confetti({
                            particleCount: 150,
                            spread: 80,
                            origin: { y: 0.6 },
                            colors: ['#2563eb', '#f59e0b', '#10b981']
                          });
                          window.print();
                        }}
                      >
                        <Download className="mr-2 h-5 w-5" /> Export CV
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sticky Panel (Tips or Preview) */}
            <aside className="hidden lg:block sticky top-28 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar">
              {/* Toggle between Preview and Tips */}
              <div className="flex items-center gap-2 p-1 bg-muted rounded-2xl">
                <button
                  className={cn(
                    "flex-1 text-xs font-bold py-2 px-4 rounded-xl transition-all",
                    showPreview ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setShowPreview(true)}
                >
                  <Eye className="h-3.5 w-3.5 inline mr-1.5" />Live Preview
                </button>
                <button
                  className={cn(
                    "flex-1 text-xs font-bold py-2 px-4 rounded-xl transition-all",
                    !showPreview ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setShowPreview(false)}
                >
                  <Cpu className="h-3.5 w-3.5 inline mr-1.5" />AI Settings
                </button>
              </div>

              {showPreview ? (
                <div className="animate-in fade-in duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Preview</p>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold animate-pulse">● Auto-syncing</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white scale-[0.55] origin-top -mb-[45%]">
                    <CVPreview cvData={cvData} photoUrl={photoUrl} />
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* AI Settings Card */}
                  <Card className="bg-white border-none rounded-2xl shadow-lg overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-primary to-accent" />
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-accent" /> AI Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-[10px] text-muted-foreground">Provide your DeepSeek API key to enable AI features (Summary, Skills, Refine, Resume Parsing).</p>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase text-muted-foreground font-bold">DeepSeek API Key</Label>
                        <div className="flex gap-2">
                          <Input
                            type="password"
                            value={deepseekKey}
                            placeholder="sk-..."
                            className="h-9 text-xs rounded-lg"
                            onChange={(e) => setDeepseekKey(e.target.value)}
                          />
                        </div>
                        {deepseekKey ? (
                          <div className="flex items-center gap-1.5 text-[10px] text-green-700 font-bold">
                            <CheckCircle className="h-3 w-3" /> Key saved locally (auto-saved)
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-bold">
                            <AlertCircle className="h-3 w-3" /> No key set — AI features disabled
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] leading-relaxed text-muted-foreground space-y-1">
                        <p>Get your key at <a href="https://platform.deepseek.com/" target="_blank" className="text-accent underline font-bold">platform.deepseek.com</a></p>
                        <p className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-green-600" /> Stored only in your browser. Never sent to our server.</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Context Tip */}
                  <Card className="bg-primary text-primary-foreground border-none rounded-2xl shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Info className="h-4 w-4" /> German Market Tip
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs leading-relaxed opacity-80">
                      {steps[currentStep].id === 'personal' && "Recruiters expect to see your German status immediately. If you have the Chancenkarte, state it clearly in your personal details or work authorization."}
                      {steps[currentStep].id === 'chancenkarte' && "Your relocation timeline is the most critical piece of info. Be specific about when you can start working in Germany."}
                      {steps[currentStep].id === 'summary' && "Focus on factual achievements. German hiring managers prefer hard data over 'soft' descriptions."}
                      {steps[currentStep].id === 'experience' && "Use reverse-chronological order and start bullets with action verbs. If your company isn't well-known in Germany, add a 1-line description of what it does."}
                      {steps[currentStep].id === 'skills' && "Group your technical skills. Avoid generic terms. Mention tools specifically used in the German industry if applicable."}
                      {steps[currentStep].id === 'languages' && "German levels (A1-C2) are a hard requirement for many roles. Be precise and honest about your current level."}
                      {steps[currentStep].id === 'support' && "A 1:1 consultation can dramatically improve your chances. Saurabh reviews your CV with the eye of a German recruiter."}
                      {steps[currentStep].id === 'final' && "Save your PDF as FirstName_LastName_CV.pdf. German recruiters expect this naming convention."}
                    </CardContent>
                  </Card>

                  <div className="p-4 border border-dashed rounded-[1.5rem] bg-accent/5 space-y-2 border-accent/20">
                    <p className="text-xs font-bold text-accent uppercase tracking-widest">ATS Alert</p>
                    <p className="text-xs font-medium leading-tight">Avoid images, graphics, and tables in your CV content. Our templates handle formatting automatically.</p>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
      
      {/* Hidden CV Preview for Printing */}
      <div className="hidden print:block fixed inset-0 bg-white z-[9999] overflow-auto">
        <div className="container mx-auto p-12 bg-white max-w-[210mm] min-h-[297mm]">
          <CVPreview cvData={cvData} photoUrl={photoUrl} />
        </div>
      </div>
    </div>
  );
}
