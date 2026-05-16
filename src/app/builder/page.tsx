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
  Eye
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CVPreview } from "./CVPreview";

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

  const [aiMode, setAiMode] = useState<"my" | "own">("own");
  const [deepseekKey, setDeepseekKey] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    try {
      const savedMode = window.localStorage.getItem("ai_mode");
      const savedKey = window.sessionStorage.getItem("deepseek_key");
      if (savedMode === "my" || savedMode === "own") {
        setAiMode(savedMode);
      }
      if (typeof savedKey === "string") {
        setDeepseekKey(savedKey);
      }

      // Check paid status
      const checkPaid = async () => {
        const res = await fetch("/api/auth/me"); // Assuming this route exists or we create it
        const data = await res.json();
        if (data?.user?.user_metadata?.ai_paid) {
          setIsPaid(true);
          setAiMode("my");
        }
      };
      checkPaid();
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("ai_mode", aiMode);
      window.sessionStorage.setItem("deepseek_key", deepseekKey);
    } catch {}
  }, [aiMode, deepseekKey]);

  const callAI = async (
    task: "profile_summary" | "skills" | "experience_bullets",
    input: Record<string, unknown>
  ) => {
    const response = await fetch("/api/ai/deepseek", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task,
        input,
        useServerKey: aiMode === "my",
        userApiKey: aiMode === "own" ? deepseekKey : undefined,
      }),
    });

    const json = (await response.json().catch(() => null)) as
      | { text?: string; error?: string }
      | null;

    if (!response.ok) {
      const msg = json?.error ?? "AI request failed";
      if (response.status === 402) {
        toast({
          title: "Payment required",
          description: "Pay ₹99 to use the server AI key, or use your own key.",
          variant: "destructive",
        });
      } else {
        toast({ title: "AI error", description: msg, variant: "destructive" });
      }
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
        throw new Error("Failed to extract text from file");
      }

      const { text: resumeText } = await parseRes.json();

      if (!resumeText) {
        throw new Error("No text found in resume");
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

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <div className="container mx-auto px-4 md:px-6 pt-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
            <div className="mb-10 space-y-2 flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">
                  Build Your <span className="text-accent">Germany CV</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                  Follow our guided steps to create a recruiter-ready application.
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(!showPreview)}
                className="rounded-xl border-primary text-primary hover:bg-primary/5"
              >
                <Eye className="mr-2 h-4 w-4" /> {showPreview ? "Hide Preview" : "Live Preview"}
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
                        Upload your PDF/DOCX resume and let AI populate the fields for you. 
                        Requires "Use my key (₹99)" or your own DeepSeek API key.
                      </p>
                      <div className="flex items-center gap-4">
                        <Input 
                          type="file" 
                          accept=".pdf,.docx,.txt" 
                          className="max-w-xs bg-white"
                          onChange={handleResumeUpload}
                          disabled={isParsing}
                        />
                        {isParsing && <div className="text-sm text-primary animate-pulse font-medium">Parsing with AI...</div>}
                      </div>
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
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-3">
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
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
                              toast({ title: "Summary generated" });
                            }
                          }}
                        >
                          Generate with AI
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
                            onClick={async () => {
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
                                toast({ title: "Bullet points refined" });
                              }
                            }}
                          >
                            Refine with AI
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
                        onClick={async () => {
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
                          toast({ title: "Skills suggested" });
                        }}
                      >
                        Suggest with AI
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
                      <Button className="bg-accent hover:bg-accent/90 text-white font-bold h-12 px-8" onClick={() => window.print()}>
                        <Download className="mr-2 h-5 w-5" /> Download PDF
                      </Button>
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
                        onClick={() => window.print()}
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
              {showPreview ? (
                <div className="animate-in slide-in-from-right duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Preview</p>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Auto-syncing</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white scale-[0.7] origin-top">
                    <CVPreview cvData={cvData} photoUrl={photoUrl} />
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-left duration-500">
                  <Card className="bg-primary text-primary-foreground border-none rounded-2xl shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Info className="h-4 w-4" /> Builder Tip
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs leading-relaxed opacity-80">
                      {steps[currentStep].id === 'personal' && "German recruiters expect to see your current location. If you are abroad, mention your relocation timeline and work permit status immediately."}
                      {steps[currentStep].id === 'chancenkarte' && "Mention Chancenkarte/visa status clearly. Add your relocation timeline and preferred city to reduce recruiter uncertainty."}
                      {steps[currentStep].id === 'summary' && "This is your 6-second hook. Mention your main tech stack, years of experience, and strongest achievement right at the start."}
                      {steps[currentStep].id === 'experience' && "Use the past tense for previous roles and present tense for current ones. Always start with an action verb (e.g., 'Implemented', 'Reduced', 'Collaborated')."}
                      {steps[currentStep].id === 'skills' && "Categorize your skills if possible (e.g., Languages, Frameworks, Tools). Avoid generic skills like 'Hardworking' or 'Microsoft Word'."}
                      {steps[currentStep].id === 'languages' && "Be honest about German level. Add CEFR level (A1-C2). German recruiters care about this section."}
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-none rounded-2xl shadow-lg overflow-hidden">
                    <div className="h-1 bg-accent" />
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-accent" /> AI Assist
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="aiMode"
                            checked={aiMode === "my"}
                            onChange={() => setAiMode("my")}
                            className="text-accent focus:ring-accent"
                          />
                          <span className="group-hover:text-accent transition-colors flex items-center gap-2">
                            Use server key (₹99)
                            {isPaid ? (
                              <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">Enabled</span>
                            ) : (
                              <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">Locked</span>
                            )}
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="aiMode"
                            checked={aiMode === "own"}
                            onChange={() => setAiMode("own")}
                            className="text-accent focus:ring-accent"
                          />
                          <span className="group-hover:text-accent transition-colors">Use my own key</span>
                        </label>
                      </div>

                      {aiMode === "own" && (
                        <div className="space-y-2 animate-in zoom-in-95 duration-200">
                          <Label className="text-[10px] uppercase text-muted-foreground">DeepSeek API Key</Label>
                          <Input
                            value={deepseekKey}
                            placeholder="sk-..."
                            className="h-8 text-xs rounded-lg"
                            onChange={(e) => setDeepseekKey(e.target.value)}
                          />
                        </div>
                      )}

                      {!isPaid && (
                        <Button asChild variant="outline" className="w-full border-primary rounded-xl h-10 text-xs font-bold hover:bg-primary hover:text-white transition-all">
                          <Link href="/buy-me-coffee">Unlock Server Key</Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  <div className="p-4 border border-dashed rounded-[1.5rem] bg-accent/5 space-y-2 border-accent/20">
                    <p className="text-xs font-bold text-accent uppercase tracking-widest">ATS Alert</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Critical Rule:</p>
                    <p className="text-xs font-medium leading-tight">Avoid images, graphics, and tables. Our templates handle this automatically.</p>
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
