import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";

export default function TemplatesPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20 max-w-5xl space-y-10">
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Germany CV <span className="text-accent">Templates</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          We use high-conversion, ATS-optimized PDF layouts that recruiters in Germany trust. 
          No more worrying about complex DOCX formatting.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {[
          {
            title: "1-Page ATS Standard",
            desc: "The gold standard for graduates and mid-level professionals. Clean, linear, and text-focused.",
            icon: FileText,
          },
          {
            title: "2-Page Professional",
            desc: "Designed for senior leaders and specialists with 10+ years of experience. Includes more space for achievements.",
            icon: FileText,
          },
        ].map((t, i) => (
          <Card key={i} className="bg-white border-none shadow-xl rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="h-2 bg-primary" />
            <CardHeader className="space-y-2 pt-8">
              <div className="p-3 bg-primary/5 rounded-2xl w-fit group-hover:bg-primary group-hover:text-white transition-colors">
                <t.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-headline">{t.title}</CardTitle>
              <p className="text-muted-foreground">{t.desc}</p>
            </CardHeader>
            <CardContent className="pb-8">
              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-12 rounded-xl">
                <Link href="/builder">
                  Use this template in Builder <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-primary text-primary-foreground p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold font-headline">Still want a DOCX version?</h3>
          <p className="text-primary-foreground/70">Join our Sunday sessions to get exclusive access to our legacy Word templates.</p>
        </div>
        <Button asChild variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-8 rounded-xl h-12">
          <Link href="/sessions">View Sessions</Link>
        </Button>
      </div>
    </div>
  );
}
