import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const templates = [
  {
    id: "one-page",
    title: "1-Page Germany ATS Template",
    description: "Best for freshers and people with less experience (single page).",
    fileLabel: "Germany_CV_Template_1Page.docx",
  },
  {
    id: "two-page",
    title: "2-Page Germany ATS Template",
    description: "Best for senior roles (up to 2 pages).",
    fileLabel: "Germany_CV_Template_2Page.docx",
  },
] as const;

export default function TemplatesPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20 max-w-5xl space-y-10">
      <div className="space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          CV Templates (Germany ATS) - Indian Format
        </h1>
        <p className="text-muted-foreground">
          Download the exact DOCX formats and keep your CV simple: single-column,
          normal fonts (Calibri/Arial), and bullet points.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {templates.map((t) => (
          <Card key={t.id} className="bg-white border shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">{t.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{t.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">{t.fileLabel}</p>
              <div className="flex gap-3">
                <Button asChild className="bg-accent hover:bg-accent/90 text-white">
                  <a href={`/api/templates/${t.id}`}>Download DOCX</a>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/guide">Read the Guide</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
