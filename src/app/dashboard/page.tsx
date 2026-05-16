"use client";

import { useEffect, useState, useMemo } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Trash2, Calendar, User, Clock, ArrowRight, Cpu } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface ResumeFile {
  name: string;
  id: string;
  updated_at: string;
  metadata: {
    size: number;
    mimetype: string;
  };
}

export default function DashboardPage() {
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const { toast } = useToast();

  useEffect(() => {
    if (!supabase) return;

    const fetchResumes = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      setUserEmail(user.email ?? null);

      // Fetch saved API key from localStorage
      const savedKey = window.localStorage.getItem("deepseek_key");
      if (savedKey) setApiKey(savedKey);

      const { data, error } = await supabase.storage
        .from('resumes')
        .list(user.id, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'desc' },
        });

      if (error) {
        console.error("Error fetching resumes:", error);
      } else {
        setResumes((data as any[]) || []);
      }
      setLoading(false);
    };

    fetchResumes();
  }, [supabase]);

  const handleDownload = async (fileName: string) => {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase.storage
      .from('resumes')
      .download(`${user.id}/${fileName}`);

    if (error) {
      toast({
        title: "Download Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.split('/').pop() || 'resume';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.storage
      .from('resumes')
      .remove([`${user.id}/${fileName}`]);

    if (error) {
      toast({
        title: "Delete Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setResumes(resumes.filter(r => r.name !== fileName));
      toast({
        title: "Deleted",
        description: "Resume removed from your account.",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-3xl font-bold">Please log in to see your resumes</h1>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-6xl space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold font-headline">My Dashboard</h1>
          <p className="text-muted-foreground italic">Welcome back, {userEmail}</p>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90">
          <Link href="/builder">Build New CV <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Stored Resumes
              </CardTitle>
              <CardDescription>
                Resumes you've uploaded to the builder are saved here for future reference.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resumes.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground">No resumes stored yet.</p>
                  <Button variant="link" asChild>
                    <Link href="/builder">Upload your first resume in the builder</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {resumes.map((resume) => (
                    <div 
                      key={resume.id} 
                      className="flex items-center justify-between p-4 bg-white border rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-sm truncate max-w-[200px] sm:max-w-xs">{resume.name}</p>
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase tracking-wider">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(resume.updated_at).toLocaleDateString()}</span>
                            <span>{(resume.metadata.size / 1024).toFixed(1)} KB</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDownload(resume.name)}
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(resume.name)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-none rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Cpu className="h-5 w-5" /> AI Settings
              </CardTitle>
              <CardDescription className="text-primary-foreground/70">Manage your DeepSeek API Key</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">DeepSeek Key</p>
                <div className="flex gap-2">
                  <input 
                    type="password" 
                    value={apiKey}
                    onChange={(e) => {
                      const newKey = e.target.value;
                      setApiKey(newKey);
                      window.localStorage.setItem("deepseek_key", newKey);
                    }}
                    placeholder="sk-..."
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs w-full focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                </div>
              </div>
              <p className="text-[10px] opacity-60 leading-relaxed italic">
                This key is stored locally in your browser for privacy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" /> Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="outline" className="w-full justify-start border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/sessions">View Sessions & Insights</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/guide">Read German CV Guide</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg border-accent/20 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-accent" /> Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Want <b>Saurabh Verma</b> to review one of these resumes?
              </p>
              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-white font-bold">
                <Link href="/buy-me-coffee">Book 1:1 Review</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
