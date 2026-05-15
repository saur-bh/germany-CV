
import { 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const ExampleCard = ({ title, before, after, description }: { title: string, before: string, after: string, description: string }) => (
  <div className="space-y-6 border rounded-2xl p-6 lg:p-10 bg-white shadow-lg overflow-hidden relative">
    <div className="space-y-2">
      <h3 className="text-2xl font-bold font-headline">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-8 items-start relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block z-10">
        <div className="bg-white rounded-full p-2 shadow-md border">
          <ArrowRight className="h-6 w-6 text-accent" />
        </div>
      </div>

      {/* Before */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-red-600 font-bold uppercase text-xs tracking-widest px-3 py-1 bg-red-50 rounded-full w-fit">
          <XCircle className="h-4 w-4" /> Before
        </div>
        <div className="p-6 bg-red-50/30 border border-red-100 rounded-xl font-mono text-sm min-h-[120px] leading-relaxed italic text-muted-foreground">
          "{before}"
        </div>
      </div>

      {/* After */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-green-600 font-bold uppercase text-xs tracking-widest px-3 py-1 bg-green-50 rounded-full w-fit">
          <CheckCircle2 className="h-4 w-4" /> After (German Optimized)
        </div>
        <div className="p-6 bg-green-50/30 border border-green-100 rounded-xl text-sm min-h-[120px] leading-relaxed font-medium">
          {after}
        </div>
      </div>
    </div>
  </div>
);

export default function ExamplesPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20 max-w-5xl space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Before & After Showcase</h1>
        <p className="text-lg text-muted-foreground">
          See how generic descriptions are transformed into high-impact, ATS-friendly content for the German job market.
        </p>
      </div>

      <div className="space-y-12">
        <ExampleCard 
          title="Job Description: Project Management"
          description="Transforming vague tasks into quantifiable achievements with strong action verbs."
          before="Managed several small projects and helped the team with their daily tasks. Responsible for reporting to management and keeping clients happy."
          after="Directed a portfolio of 15+ concurrent IT infrastructure projects with a total budget of €200k. Implemented Agile methodologies (Scrum), reducing project turnaround time by 25% and achieving a 98% client satisfaction rating."
        />

        <ExampleCard 
          title="Profile Summary: Software Engineer"
          description="Switching from a generic 'objective' to a professional summary of value."
          before="I am a passionate coder looking for a job in a German tech company. I know Python and Java and want to learn more about cloud technologies."
          after="Full-Stack Developer with 5 years of experience specializing in scalable Java microservices and Python automation. Expert in AWS architecture and CI/CD pipelines. Relocating to Munich with Blue Card eligibility and German B2 proficiency."
        />

        <ExampleCard 
          title="Skill Section: General Professional"
          description="Avoiding vague 'soft skills' and skill bars for a structured category-based approach."
          before="Communication: [■■■■□], Leadership: [■■■□□], Microsoft Office: Expert, Team Player."
          after="• Project Tools: JIRA, Confluence, Trello\n• Methodologies: Scrum, Kanban, Prince2\n• Data Analysis: Advanced Excel (Macros/VBA), SQL, Tableau\n• Soft Skills: Stakeholder Management, Intercultural Communication"
        />
      </div>

      <section className="bg-primary rounded-3xl p-8 lg:p-12 text-primary-foreground space-y-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-headline">Why this works</h2>
            <p className="opacity-80 leading-relaxed">
              German recruiters look for concrete evidence of your competence. "Helped the team" is a task; "Reduced turnaround time by 25%" is a result. By using the C-A-R (Context, Action, Result) method, you make your value undeniable.
            </p>
            <div className="flex gap-4">
              <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 border-white/20 text-white">Quantifiable</Badge>
              <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 border-white/20 text-white">Action-Oriented</Badge>
              <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 border-white/20 text-white">Direct</Badge>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h4 className="font-bold flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-accent" />
              Recruiter Insight
            </h4>
            <p className="text-sm italic opacity-70">
              "The average time spent on the first screen of a CV is 6 seconds. If I don't see numbers or relevant technology keywords immediately, I move on. The optimized 'After' examples make my job easy."
            </p>
            <p className="text-xs mt-4 font-bold">— HR Lead, German Tech Unicorn</p>
          </div>
        </div>
      </section>

      <div className="text-center pt-8">
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white">
          <Link href="/builder">
            Start Optimizing Your CV <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
