import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  Award, 
  ShieldCheck, 
  Search, 
  AlertCircle,
  FileText
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-20 lg:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>
        
        <div className="container relative mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
              <Award className="h-4 w-4" />
              <span>Optimized for German Recruiters</span>
            </div>
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
              Your Gateway to a Career in <span className="text-accent underline decoration-wavy underline-offset-8">Germany</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-xl leading-relaxed">
              Designed for international talent and <b>Chancenkarte</b> holders. Build a CV that meets strict German standards and speaks the language of local recruiters.
            </p>
            <div className="flex items-center gap-4 py-2">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-primary bg-muted flex items-center justify-center text-[10px] font-bold text-primary">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-primary-foreground/70">Join 2,400+ expats landing interviews</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white font-semibold">
                <Link href="/signup">
                  Start Building Your CV <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/guide">Read the Guide</Link>
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4 text-primary-foreground/60 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> <span>Professional PDF Exports</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-primary-foreground/10 aspect-[4/3] lg:aspect-auto min-h-[400px]">
              <Image 
                src="/hero.png" 
                alt="Working in Germany" 
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Why the German Market is Different</h2>
          <p className="text-muted-foreground text-lg">
            German recruiters have high standards for structure, clarity, and factual accuracy. Generic international CVs often fail initial screening.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "German Standard Layout",
              desc: "Follow the precise structure expected by German HR (Lebenslauf), optimized for clarity and professionalism.",
              icon: <Search className="h-8 w-8 text-accent" />
            },
            {
              title: "Chancenkarte Ready",
              desc: "Clearly communicate your visa status, availability, and relocation timeline—the #1 thing German recruiters look for.",
              icon: <FileText className="h-8 w-8 text-accent" />
            },
            {
              title: "International Move Expert",
              desc: "Translate your international experience into terms that German hiring managers understand and value.",
              icon: <Award className="h-8 w-8 text-accent" />
            }
          ].map((benefit, i) => (
            <Card key={i} className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 space-y-4">
                <div className="p-3 bg-accent/5 rounded-2xl w-fit">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Guide Preview */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">The Ultimate Germany CV Guide</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our comprehensive guide covers everything from the ideal length (1-2 pages) to how to describe your work authorization status.
            </p>
            <ul className="space-y-4">
              {[
                "Modern German 'Lebenslauf' structure",
                "Clear visa & Chancenkarte status communication",
                "Professional summary tailored for the German market",
                "CEFR language proficiency guidelines (A1-C2)",
                "Relocation timeline and availability standards"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <Button asChild variant="link" className="text-accent p-0 h-auto font-bold text-lg group">
              <Link href="/guide">
                Explore the full guide <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="bg-muted rounded-3xl p-8 lg:p-12 border shadow-inner">
            <div className="bg-white rounded-xl shadow-2xl p-6 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h4 className="font-bold text-accent">Pro Tip: No Tables</h4>
                <AlertCircle className="h-5 w-5 text-accent" />
              </div>
              <p className="text-sm italic text-muted-foreground">
                "ATS software often struggles to parse tables correctly. German recruiters prefer a logical, linear layout using margins and spacing for structure rather than complex grid systems."
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <p className="text-xs font-bold text-red-600 mb-1">COMMON MISTAKE</p>
                  <p className="text-xs">Being vague about your visa or relocation status in Germany.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <p className="text-xs font-bold text-green-600 mb-1">GERMAN WAY</p>
                  <p className="text-xs">Explicitly stating 'Chancenkarte holder' or 'Relocating in Aug'.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Preview */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">See the Difference</h2>
            <p className="text-muted-foreground text-lg">
              Check out our before-and-after examples showing how we transform weak international CVs into Germany-ready applications.
            </p>
          </div>
          <Button asChild variant="outline" className="border-primary">
            <Link href="/examples">View All Examples</Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="overflow-hidden border-2 border-red-100 bg-red-50/20">
            <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-widest text-center">Weak International CV</div>
            <CardContent className="p-8 space-y-4 opacity-70">
              <h4 className="font-bold text-xl line-through decoration-red-400">John Doe - Resume</h4>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-20 bg-gray-100 rounded w-full flex items-center justify-center border-dashed border-2">
                  <span className="text-xs text-red-400">Vague profile summary & skill bars</span>
                </div>
              </div>
              <div className="space-y-4 pt-4">
                <div className="flex gap-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full shrink-0"></div>
                  <div className="space-y-2 w-full">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-2 border-green-100 bg-green-50/20">
            <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-widest text-center">GermanCV Optimized</div>
            <CardContent className="p-8 space-y-4">
              <h4 className="font-bold text-xl text-primary">Johannes Mueller</h4>
              <p className="text-xs text-muted-foreground">Professional Summary - Targeted at Senior Software Engineer</p>
              <div className="space-y-2">
                <div className="h-4 bg-primary/20 rounded w-full"></div>
                <div className="h-4 bg-primary/20 rounded w-5/6"></div>
                <div className="h-4 bg-primary/10 rounded w-2/3"></div>
              </div>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 bg-primary/30 rounded w-1/3"></div>
                    <div className="h-3 bg-muted rounded w-24"></div>
                  </div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-11/12"></div>
                  <div className="flex gap-2">
                    <div className="h-5 px-3 bg-accent/10 border border-accent/20 rounded text-[10px] text-accent font-bold">REACT</div>
                    <div className="h-5 px-3 bg-accent/10 border border-accent/20 rounded text-[10px] text-accent font-bold">GERMAN C1</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about CVs for Germany.</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-bold py-6">Do I need a photo on my German CV?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                While legally not required due to anti-discrimination laws (AGG), photos remain very common in Germany. However, for large international tech companies and many startups, it is becoming standard to omit them to reduce bias. Our builder lets you decide.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-bold py-6">Is one page enough or should I use two?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                In Germany, 1 page is preferred for graduates or those with less than 5 years of experience. For senior roles, 2 pages are perfectly acceptable. Quality and logical flow are more important than squeezing everything into one page.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-bold py-6">What about the "Lebenslauf" format?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                The modern German "Lebenslauf" is reverse-chronological. It should be factual, signed (optional for digital applications), and include a clear section for languages and IT skills.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="bg-primary text-primary-foreground rounded-[2rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent via-transparent to-transparent" />
          </div>
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-headline">Ready to apply for jobs in Germany?</h2>
            <p className="text-xl text-primary-foreground/80">
              Join thousands of candidates using GermanCV to land interviews at top German companies.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white px-10 text-lg">
                <Link href="/builder">Create My CV Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-10 text-lg">
                <Link href="/guide">Read the Guide</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
