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
  Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const GuideSection = ({ title, icon: Icon, children }: { title: string, icon: LucideIcon, children: React.ReactNode }) => (
  <section id={title.toLowerCase().replace(/\s+/g, '-')} className="space-y-6 scroll-mt-24">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-accent/10 rounded-lg text-accent">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold font-headline">{title}</h2>
    </div>
    {children}
    <Separator className="mt-12" />
  </section>
);

export default function GuidePage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20 max-w-5xl">
      <div className="space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline">Germany CV Guide (For Indians)</h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
          A simplified, ATS-friendly guide to build a clear, structured, Germany-ready CV.
        </p>
      </div>

      <div className="grid lg:grid-cols-[250px_1fr] gap-12">
        {/* Sticky Sidebar Nav */}
        <aside className="hidden lg:block">
          <nav className="sticky top-28 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Contents</p>
            {[
              "Keep It Simple",
              "Save as PDF",
              "Design Rules",
              "Best Structure",
              "Personal Details",
              "Profile Summary",
              "Work Experience",
              "Education & Certifications",
              "Skills",
              "Languages",
              "Work Authorization",
              "Final Checklist",
              "Common Rejections"
            ].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="block text-sm py-2 hover:text-accent transition-colors border-l-2 border-transparent hover:border-accent pl-4"
              >
                {item}
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-20">
          <GuideSection title="Keep It Simple" icon={CheckCircle}>
            <div className="space-y-6">
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Length</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• 1 page if you have less experience</p>
                  <p>• Maximum 2 pages for senior roles</p>
                  <p>• Recruiters scan CVs quickly (30–60 seconds)</p>
                </CardContent>
              </Card>
            </div>
          </GuideSection>

          <GuideSection title="Save as PDF" icon={FileText}>
            <div className="space-y-6">
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">File name format</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="font-semibold">FirstName_LastName_CV.pdf</p>
                  <p className="text-muted-foreground">Example: Saurabh_Verma_CV.pdf</p>
                  <p>• Avoid spaces</p>
                  <p>• Avoid symbols</p>
                  <p>• Avoid fancy file names</p>
                </CardContent>
              </Card>
            </div>
          </GuideSection>

          <GuideSection title="Design Rules" icon={ShieldAlert}>
            <div className="space-y-6">
              <div className="bg-accent/5 border border-accent/20 p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-3 text-accent font-bold">
                  <AlertTriangle className="h-5 w-5" />
                  <span>ATS can fail to read fancy layouts</span>
                </div>
                <p className="text-sm leading-relaxed">
                  Keep it plain, single-column, and text-first.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-bold flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" /> Use
                  </h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex gap-2"><span>✅</span> <span>Simple layout</span></li>
                    <li className="flex gap-2"><span>✅</span> <span>Single column</span></li>
                    <li className="flex gap-2"><span>✅</span> <span>Normal fonts (Calibri, Arial)</span></li>
                    <li className="flex gap-2"><span>✅</span> <span>Left-aligned text</span></li>
                    <li className="flex gap-2"><span>✅</span> <span>Bullet points</span></li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold flex items-center gap-2 text-red-600">
                    <XCircle className="h-5 w-5" /> Avoid
                  </h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex gap-2"><span>❌</span> <span>Tables</span></li>
                    <li className="flex gap-2"><span>❌</span> <span>Icons</span></li>
                    <li className="flex gap-2"><span>❌</span> <span>Skill bars</span></li>
                    <li className="flex gap-2"><span>❌</span> <span>Charts / graphics</span></li>
                    <li className="flex gap-2"><span>❌</span> <span>Multiple columns</span></li>
                    <li className="flex gap-2"><span>❌</span> <span>Fancy templates</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </GuideSection>

          <GuideSection title="Best Structure" icon={CheckCircle}>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Use this section order for Germany:
              </p>
              <div className="space-y-3">
                {[
                  { title: "Personal Details", icon: Info, desc: "Name, City + Country, phone, email, LinkedIn." },
                  { title: "Profile Summary", icon: BookOpen, desc: "3–4 lines. Role, years, main skills, target position." },
                  { title: "Work Experience", icon: Briefcase, desc: "Reverse-chronological with 4–6 bullets per role." },
                  { title: "Education & Certifications", icon: GraduationCap, desc: "Degree + completed certifications only." },
                  { title: "Skills", icon: Cpu, desc: "Grouped keywords from job description." },
                  { title: "Languages", icon: Globe, desc: "Be honest. Use CEFR levels (A1–C2)." },
                  { title: "Work Authorization", icon: ShieldAlert, desc: "Visa / residence permit and relocation willingness." },
                ].map((item) => (
                  <Card key={item.title} className="bg-white border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <item.icon className="h-4 w-4 text-accent" />
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      {item.desc}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </GuideSection>

          <GuideSection title="Personal Details" icon={Info}>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-white border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Include</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>• Full Name</p>
                    <p>• City + Country</p>
                    <p>• Phone number</p>
                    <p>• Professional email</p>
                    <p>• LinkedIn profile</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Do not include</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>• Age / Date of birth</p>
                    <p>• Gender</p>
                    <p>• Marital status</p>
                    <p>• Passport number</p>
                    <p>• Full address</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </GuideSection>

          <GuideSection title="Profile Summary" icon={BookOpen}>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Keep it 3–4 lines. Mention role, years of experience, main skills, and target position. Avoid buzzwords.
              </p>
              <Card className="bg-accent/10 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-lg text-accent">Example</CardTitle>
                </CardHeader>
                <CardContent className="text-sm italic font-medium">
                  QA Automation Engineer with 6+ years of experience in manual and automation testing using Playwright, Cypress, API testing, and CI/CD pipelines.
                </CardContent>
              </Card>
            </div>
          </GuideSection>

          <GuideSection title="Work Experience" icon={Briefcase}>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                For each role include job title, company, location, and dates. Use 4–6 bullet points max and focus on impact.
              </p>
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Good bullet example</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• Reduced regression testing time by 40% using Playwright automation.</p>
                  <p>• Built CI checks in GitHub Actions to catch flaky tests early.</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Employment gaps</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• Be honest (relocation, studies, job search, upskilling, family reasons)</p>
                  <p>• Never hide gaps</p>
                </CardContent>
              </Card>
            </div>
          </GuideSection>

          <GuideSection title="Education & Certifications" icon={GraduationCap}>
            <div className="space-y-6">
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Education</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• Degree</p>
                  <p>• University</p>
                  <p>• Location</p>
                  <p>• Graduation year</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Certifications</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• Only add completed certifications</p>
                  <p>• Do not add “in progress”</p>
                  <p>• Avoid random courses unless directly relevant</p>
                </CardContent>
              </Card>
            </div>
          </GuideSection>

          <GuideSection title="Skills" icon={Cpu}>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Skills are very important for ATS. Use keywords from the job description and group them.
              </p>
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Example grouping</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p><span className="font-semibold">Testing:</span> Manual Testing, Regression Testing, API Testing</p>
                  <p><span className="font-semibold">Automation:</span> Playwright, Cypress, Selenium</p>
                  <p><span className="font-semibold">Programming:</span> JavaScript, TypeScript, Python</p>
                  <p><span className="font-semibold">Tools:</span> Jira, GitHub Actions, Jenkins, Docker</p>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Avoid</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• Skill percentages / star ratings</p>
                  <p>• Soft skills list</p>
                </CardContent>
              </Card>
            </div>
          </GuideSection>

          <GuideSection title="Languages" icon={Globe}>
            <div className="space-y-6">
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Example</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• English: Fluent</p>
                  <p>• German: B1</p>
                </CardContent>
              </Card>
            </div>
          </GuideSection>

          <GuideSection title="Work Authorization" icon={ShieldAlert}>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Very important in Germany. Mention visa status, residence permit validity, and relocation willingness.
              </p>
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Example</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  Valid German residence permit until 2028. Open to relocation within Germany.
                </CardContent>
              </Card>
            </div>
          </GuideSection>

          <GuideSection title="Final Checklist" icon={CheckCircle}>
            <div className="space-y-6">
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Before applying</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>✅ PDF format</p>
                  <p>✅ No spelling mistakes</p>
                  <p>✅ Clear dates</p>
                  <p>✅ ATS-friendly layout</p>
                  <p>✅ Keywords from job posting</p>
                  <p>✅ LinkedIn matches CV</p>
                  <p>✅ Max 2 pages</p>
                </CardContent>
              </Card>
            </div>
          </GuideSection>

          <GuideSection title="Common Rejections" icon={AlertTriangle}>
            <div className="space-y-6">
              <Card className="bg-white border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Top reasons German recruiters reject CVs</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>❌ Too fancy design</p>
                  <p>❌ No clear role focus</p>
                  <p>❌ Missing dates</p>
                  <p>❌ Unexplained gaps</p>
                  <p>❌ Weak achievement bullets</p>
                  <p>❌ Missing visa/work authorization</p>
                  <p>❌ Missing language levels</p>
                </CardContent>
              </Card>
            </div>
          </GuideSection>
        </div>
      </div>
    </div>
  );
}
