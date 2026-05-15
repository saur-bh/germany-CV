
import { 
  AlertTriangle, 
  BookOpen, 
  CheckCircle, 
  Info, 
  Layout, 
  ListOrdered, 
  LucideIcon, 
  ShieldAlert, 
  Smartphone,
  CheckCircle2,
  XCircle
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
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline">Germany CV Guide</h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
          Everything you need to know about crafting a CV that satisfies German Applicant Tracking Systems (ATS) and professional recruiters.
        </p>
      </div>

      <div className="grid lg:grid-cols-[250px_1fr] gap-12">
        {/* Sticky Sidebar Nav */}
        <aside className="hidden lg:block">
          <nav className="sticky top-28 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Contents</p>
            {[
              "Best Practices",
              "ATS Rules",
              "Section Order",
              "Profile Summary",
              "Experience",
              "Skills & Languages",
              "Relocation Status"
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
          <GuideSection title="Best Practices" icon={CheckCircle}>
            <div className="grid gap-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                The German market values structure, precision, and factual evidence. Unlike CVs in some other countries, German CVs (Lebenslauf) are typically more direct and less "salesy."
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-white border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Standard Formatting</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>• 1-2 pages maximum (be concise)</p>
                    <p>• Standard A4 page size</p>
                    <p>• Reverse-chronological order (newest first)</p>
                    <p>• Professional, clear font (e.g., Inter, Helvetica)</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Cultural Specifics</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>• Professional photo (becoming optional but common)</p>
                    <p>• Signed and dated (traditionally, but optional digitally)</p>
                    <p>• Clear language levels (e.g., German B2, English C1)</p>
                    <p>• Work authorization clearly stated</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </GuideSection>

          <GuideSection title="ATS Rules" icon={ShieldAlert}>
            <div className="space-y-6">
              <div className="bg-accent/5 border border-accent/20 p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-3 text-accent font-bold">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Crucial for Machine Reading</span>
                </div>
                <p className="text-sm leading-relaxed">
                  Applicant Tracking Systems (ATS) are used by most large German companies (DAX corporations and major Mittelstand). To ensure your CV is parsed correctly:
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-bold flex items-center gap-2 text-red-600">
                    <XCircle className="h-5 w-5" /> Avoid
                  </h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex gap-2"><span>❌</span> <span>Complex tables and nested grids</span></li>
                    <li className="flex gap-2"><span>❌</span> <span>Icons, graphics, or images in header/body</span></li>
                    <li className="flex gap-2"><span>❌</span> <span>Skill bars or "star ratings" for proficiency</span></li>
                    <li className="flex gap-2"><span>❌</span> <span>Information in Headers/Footers (often missed)</span></li>
                    <li className="flex gap-2"><span>❌</span> <span>Multi-column layouts (use single column)</span></li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" /> Preferred
                  </h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex gap-2"><span>✅</span> <span>Simple, logical document flow</span></li>
                    <li className="flex gap-2"><span>✅</span> <span>Standard headings (e.g., "Professional Experience")</span></li>
                    <li className="flex gap-2"><span>✅</span> <span>Clean bullet points with action verbs</span></li>
                    <li className="flex gap-2"><span>✅</span> <span>Quantifiable metrics (% growth, € budget)</span></li>
                    <li className="flex gap-2"><span>✅</span> <span>Keywords directly from the job description</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </GuideSection>

          <GuideSection title="Section Order" icon={ListOrdered}>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                German HR managers scan CVs in a specific order. Deviating from this can make it harder for them to find key info.
              </p>
              <div className="space-y-4">
                {[
                  { title: "1. Personal Information", desc: "Name, address, phone, email, LinkedIn, and work permit status." },
                  { title: "2. Profile Summary", desc: "3-5 lines summarizing your professional value proposition." },
                  { title: "3. Professional Experience", desc: "The core of your CV. Reverse-chronological." },
                  { title: "4. Education & Certifications", desc: "University degrees and relevant professional training." },
                  { title: "5. Technical/Professional Skills", desc: "Categorized skills relevant to the role." },
                  { title: "6. Languages", desc: "Clearly graded using CEFR standards (A1 to C2)." },
                  { title: "7. Optional Info", desc: "Projects, volunteering, or relevant hobbies." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-lg bg-white border shadow-sm">
                    <span className="font-bold text-accent shrink-0">{item.title.split('.')[0]}</span>
                    <div>
                      <h4 className="font-bold">{item.title.split('. ')[1]}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GuideSection>

          <GuideSection title="Profile Summary" icon={BookOpen}>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                A profile summary is not an "Objective." It should focus on what you bring to the table, not what you want from the company.
              </p>
              <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle className="text-lg">Bad Example (Generic)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm italic opacity-80">
                  "I am a hard-working software engineer looking for a new challenge in Germany where I can grow my skills and help a great team succeed."
                </CardContent>
              </Card>
              <Card className="bg-accent/10 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-lg text-accent">Good Example (Specific)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm italic font-medium">
                  "Senior Frontend Engineer with 7+ years of experience in React and TypeScript. Proven track record of optimizing web performance by 40% for high-traffic e-commerce platforms. Fluent in English (C1) and actively learning German (B1). Relocating to Berlin with valid Blue Card eligibility."
                </CardContent>
              </Card>
            </div>
          </GuideSection>

          <GuideSection title="Relocation Status" icon={Info}>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                For international candidates, transparency regarding work authorization is a top priority for German recruiters.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-white space-y-2">
                  <h4 className="font-bold">Scenario: Blue Card Eligible</h4>
                  <p className="text-xs text-muted-foreground">"Status: Relocating to Germany; Blue Card eligible (Degree recognized via Anabin)."</p>
                </div>
                <div className="p-4 rounded-lg border bg-white space-y-2">
                  <h4 className="font-bold">Scenario: EU Citizen</h4>
                  <p className="text-xs text-muted-foreground">"Work Authorization: EU Citizen (unrestricted work permit)."</p>
                </div>
              </div>
            </div>
          </GuideSection>
        </div>
      </div>
    </div>
  );
}
