import Link from "next/link";
import { FileText } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30 no-print">
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary rounded p-1">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-headline font-bold text-lg tracking-tighter">
                German<span className="text-accent">CV</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Simple, ATS-friendly CV builder for Indians targeting the German job market.
            </p>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-4">Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/guide" className="hover:text-accent">Germany CV Guide</Link></li>
              <li><Link href="/templates" className="hover:text-accent">DOCX Templates</Link></li>
              <li><Link href="/builder" className="hover:text-accent">CV Builder</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/buy-me-coffee" className="hover:text-accent">Buy me a coffee</Link></li>
              <li><Link href="/login" className="hover:text-accent">Login</Link></li>
              <li><Link href="/signup" className="hover:text-accent">Sign up</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t text-xs text-muted-foreground flex items-center justify-between">
          <p>© {year} GermanCV</p>
          <p>ATS-friendly. Simple. Single-column.</p>
        </div>
      </div>
    </footer>
  );
}
