"use client";

import { useState } from "react";
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
  Info
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: "personal", title: "Personal Details", icon: User },
  { id: "summary", title: "Profile Summary", icon: FileText },
  { id: "experience", title: "Professional Experience", icon: Briefcase },
  { id: "education", title: "Education & Certificates", icon: GraduationCap },
  { id: "skills", title: "Technical Skills", icon: Cpu },
  { id: "languages", title: "Languages", icon: Globe },
  { id: "final", title: "Checklist & Review", icon: CheckCircle },
];

export default function BuilderPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [cvData, setCvData] = useState({
    personal: { fullName: "", email: "", phone: "", address: "", linkedin: "", workAuth: "" },
    summary: "",
    experience: [{ id: 1, title: "", company: "", duration: "", description: "" }],
    education: [{ id: 1, degree: "", school: "", year: "" }],
    skills: [] as string[],
    languages: [{ id: 1, name: "", level: "A1" }],
  });

  const updateCV = (section: string, data: any) => {
    setCvData(prev => ({ ...prev, [section]: data }));
  };

  const nextStep = () => currentStep < steps.length - 1 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="bg-muted/30 min-h-screen pb-20">
      <div className="container mx-auto px-4 md:px-6 pt-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header & Progress */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold font-headline">{steps[currentStep].title}</h1>
                <p className="text-muted-foreground">Step {currentStep + 1} of {steps.length}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                  <ChevronLeft className="mr-1 h-4 w-4" /> Back
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button onClick={nextStep}>
                    Next Step <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => window.print()}>
                    <Download className="mr-1 h-4 w-4" /> Export CV
                  </Button>
                )}
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid lg:grid-cols-[1fr_300px] gap-8">
            {/* Step Form Area */}
            <Card className="shadow-sm border-none bg-white">
              <CardContent className="p-8">
                {currentStep === 0 && (
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
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <Label htmlFor="summary">Professional Summary</Label>
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

                {currentStep === 2 && (
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
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full border-dashed"
                      onClick={() => updateCV("experience", [...cvData.experience, { id: Date.now(), title: "", company: "", duration: "", description: "" }])}
                    >
                      + Add Experience
                    </Button>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <p className="font-bold">Technical & Professional Skills</p>
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

                {currentStep === 6 && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="text-center space-y-2">
                      <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full text-green-600 mb-2">
                        <CheckCircle className="h-10 w-10" />
                      </div>
                      <h2 className="text-2xl font-bold">Ready to Export!</h2>
                      <p className="text-muted-foreground">Perform one final check before downloading your Germany CV.</p>
                    </div>

                    <div className="grid gap-4">
                      {[
                        "Standard A4 single column layout (No complex tables)",
                        "Professional Summary is 3-5 sentences maximum",
                        "Experience lists quantifiable results with action verbs",
                        "Language levels use CEFR (A1-C2) standards",
                        "Work permit status is explicitly mentioned",
                        "No skill bars or vague graphic indicators",
                        "Contact details include LinkedIn and location"
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
                        <Download className="mr-2 h-5 w-5" /> Download ATS PDF
                      </Button>
                      <Button variant="outline" className="h-12 px-8 border-primary" onClick={() => toast({ title: "DOCX Export", description: "This feature is coming soon in the premium version." })}>
                        <FileText className="mr-2 h-5 w-5" /> Export as DOCX
                      </Button>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                      Save your PDF as <span className="font-semibold">FirstName_LastName_CV.pdf</span>{" "}
                      (example: <span className="font-semibold">Saurabh_Verma_CV.pdf</span>). Avoid spaces and symbols.
                    </div>

                    <div className="flex justify-center">
                      <Button asChild variant="outline" className="border-primary">
                        <Link href="/templates">Download DOCX Templates</Link>
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="py-20 text-center space-y-4">
                    <p className="text-muted-foreground">
                      Education & Certifications section can be added here following the same pattern.
                    </p>
                    <Button onClick={nextStep}>Continue to Next Section</Button>
                  </div>
                )}

                {currentStep === 5 && (
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

                    <Card className="bg-white border shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                          <Info className="h-4 w-4" /> Support
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Want to support this project? Buy me a coffee.
                        </p>
                        <Button asChild className="bg-accent hover:bg-accent/90 text-white">
                          <Link href="/buy-me-coffee">Buy me a coffee</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sticky Tips Panel */}
            <aside className="hidden lg:block space-y-6">
              <div className="sticky top-28 space-y-6">
                <Card className="bg-primary text-primary-foreground border-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Info className="h-4 w-4" /> Builder Tip
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs leading-relaxed opacity-80">
                    {steps[currentStep].id === 'personal' && "German recruiters expect to see your current location. If you are abroad, mention your relocation timeline and work permit status immediately."}
                    {steps[currentStep].id === 'summary' && "This is your 6-second hook. Mention your main tech stack, years of experience, and strongest achievement right at the start."}
                    {steps[currentStep].id === 'experience' && "Use the past tense for previous roles and present tense for current ones. Always start with an action verb (e.g., 'Implemented', 'Reduced', 'Collaborated')."}
                    {steps[currentStep].id === 'skills' && "Categorize your skills if possible (e.g., Languages, Frameworks, Tools). Avoid generic skills like 'Hardworking' or 'Microsoft Word'."}
                  </CardContent>
                </Card>

                <div className="p-4 border border-dashed rounded-xl bg-accent/5 space-y-2">
                  <p className="text-xs font-bold text-accent uppercase tracking-widest">ATS Alert</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Critical Rule:</p>
                  <p className="text-xs font-medium">Avoid images, graphics, and tables. Our templates handle this automatically, but keep your inputs text-based.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      
      {/* Hidden CV Preview for Printing */}
      <div className="hidden print:block fixed inset-0 bg-white z-[9999] overflow-auto">
        <div className="container mx-auto p-12 space-y-8 bg-white max-w-[210mm] min-h-[297mm]">
          <div className="flex justify-between items-start border-b-2 border-primary pb-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold font-headline">{cvData.personal.fullName || "Your Name"}</h1>
              <p className="text-accent font-bold tracking-widest uppercase text-sm">{cvData.experience[0]?.title || "Professional Profile"}</p>
            </div>
            <div className="text-right text-sm space-y-1">
              <p>{cvData.personal.email}</p>
              <p>{cvData.personal.phone}</p>
              <p>{cvData.personal.address}</p>
              <p>{cvData.personal.linkedin}</p>
              <p className="font-bold text-accent">{cvData.personal.workAuth}</p>
            </div>
          </div>

          <section className="space-y-2">
            <h2 className="text-lg font-bold font-headline uppercase border-b pb-1">Professional Summary</h2>
            <p className="text-sm leading-relaxed">{cvData.summary || "Summary goes here..."}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold font-headline uppercase border-b pb-1">Professional Experience</h2>
            {cvData.experience.map(exp => (
              <div key={exp.id} className="space-y-2">
                <div className="flex justify-between font-bold text-sm">
                  <p>{exp.title} | {exp.company}</p>
                  <p>{exp.duration}</p>
                </div>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {exp.description
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line, i) => <li key={i}>{line}</li>)}
                  {exp.description.trim().length === 0 && <li>Experience details go here...</li>}
                </ul>
              </div>
            ))}
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold font-headline uppercase border-b pb-1">Education</h2>
            {cvData.education.map(ed => (
              <div key={ed.id} className="flex justify-between text-sm">
                <p><span className="font-bold">{ed.degree}</span>, {ed.school}</p>
                <p>{ed.year}</p>
              </div>
            ))}
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold font-headline uppercase border-b pb-1">Technical Skills</h2>
            <p className="text-sm">{cvData.skills.join(" • ")}</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold font-headline uppercase border-b pb-1">Languages</h2>
            <div className="grid grid-cols-3 gap-4">
              {cvData.languages.map(l => (
                <p key={l.id} className="text-sm"><span className="font-bold">{l.name}</span>: {l.level}</p>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
