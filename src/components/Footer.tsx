
import Link from "next/link";
import { FileText, Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 no-print">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary rounded p-1">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-headline font-bold text-lg tracking-tighter">
                Deutsch<span className="text-accent">CV</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Empowering international professionals to succeed in the German job market with ATS-optimized tools.
            </p>
            <div className="flex gap-4">
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-accent cursor-pointer" />
              <Github className="h-5 w-5 text-muted-foreground hover:text-accent cursor-pointer" />
              <Mail className="h-5 w-5 text-muted-foreground hover:text-accent cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/guide" className="hover:text-accent">Germany CV Guide</Link></li>
              <li><Link href="/examples" className="hover:text-accent">Before & After Examples</Link></li>
              <li><Link href="/builder" className="hover:text-accent">ATS CV Builder</Link></li>
              <li><Link href="/guide#best-practices" className="hover:text-accent">Best Practices</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-accent">About Us</Link></li>
              <li><Link href="#" className="hover:text-accent">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-accent">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-accent">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get tips on relocation and German job hunting.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-background border rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm hover:bg-primary/90">
                Join
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} DeutschCV. All rights reserved.</p>
          <div className="flex gap-6">
            <p>Made with precision for the German job market.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
