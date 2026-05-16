import { CheckCircle } from "lucide-react";

interface CVData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    workAuth: string;
    dob: string;
    nationality: string;
  };
  chance: {
    currentCity: string;
    targetCity: string;
    availability: string;
    visaStatus: string;
    template: "one-page" | "two-page";
  };
  targetRole: string;
  summary: string;
  experience: { id: number; title: string; company: string; location: string; duration: string; description: string }[];
  education: { id: number; degree: string; school: string; location: string; year: string }[];
  skills: string[];
  languages: { id: number; name: string; level: string }[];
}

export function CVPreview({ cvData, photoUrl, isMini = false }: { cvData: CVData; photoUrl: string | null; isMini?: boolean }) {
  if (cvData.chance.template === "two-page") {
    return (
      <div className={`bg-white shadow-2xl border ${isMini ? 'scale-[0.5] origin-top' : ''} p-10 max-w-[210mm] mx-auto min-h-[297mm]`}>
        <div className="grid grid-cols-[180px_1fr] gap-8">
          <aside className="space-y-8">
            <div className="space-y-4">
              {photoUrl ? (
                <img src={photoUrl} alt="Photograph" className="w-24 h-24 rounded-full object-cover border" />
              ) : (
                <div className="w-24 h-24 rounded-full border flex items-center justify-center text-[10px] text-muted-foreground">Photo</div>
              )}
              <div className="space-y-1">
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Contact</p>
                <div className="text-[10px] space-y-0.5">
                  <p>{cvData.personal.phone}</p>
                  <p className="truncate">{cvData.personal.email}</p>
                  <p>{cvData.personal.address}</p>
                  <p className="truncate text-blue-600">{cvData.personal.linkedin}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Education</p>
              <div className="space-y-2">
                {cvData.education.map((ed) => (
                  <div key={ed.id} className="text-[10px]">
                    <p className="font-semibold">{ed.degree}</p>
                    <p className="text-muted-foreground">{ed.school}</p>
                    <p className="text-muted-foreground opacity-70">{ed.year}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Core Skills</p>
              <p className="text-[10px] leading-relaxed">{cvData.skills.join(", ")}</p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Languages</p>
              <div className="space-y-0.5 text-[10px]">
                {cvData.languages.filter(l => l.name.trim()).map((l) => (
                  <p key={l.id}><span className="font-semibold">{l.name}</span>: {l.level}</p>
                ))}
              </div>
            </div>
          </aside>

          <main className="space-y-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-primary">
                {(cvData.personal.fullName || "NAME").toUpperCase()}
              </h1>
              <p className="text-sm font-medium text-muted-foreground">{cvData.targetRole || "Target Role"}</p>
              <p className="text-[10px] text-accent font-bold uppercase tracking-wider">{cvData.personal.workAuth}</p>
            </div>

            <section className="space-y-2">
              <h2 className="text-xs tracking-widest uppercase text-muted-foreground font-bold border-b pb-1">Profile</h2>
              <p className="text-xs leading-relaxed">{cvData.summary || "Summary goes here..."}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xs tracking-widest uppercase text-muted-foreground font-bold border-b pb-1">Professional Experience</h2>
              <div className="space-y-5">
                {cvData.experience.map((exp) => (
                  <div key={exp.id} className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <p className="text-xs font-bold">{exp.title || "Job Title"}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{exp.duration}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide">
                      {exp.company} {exp.location ? `| ${exp.location}` : ''}
                    </p>
                    <ul className="list-disc list-inside text-xs space-y-0.5">
                      {exp.description.split("\n").filter(Boolean).map((line, i) => (
                        <li key={i} className="pl-1 -indent-3.5 ml-3.5 leading-relaxed">{line.replace(/^[-•\s]+/, "")}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white shadow-2xl border ${isMini ? 'scale-[0.5] origin-top' : ''} p-12 max-w-[210mm] mx-auto min-h-[297mm] space-y-8`}>
      <div className="flex justify-between items-start">
        <div className="text-xs space-y-1">
          <h1 className="text-2xl font-bold text-primary">{(cvData.personal.fullName || "NAME").toUpperCase()}</h1>
          <p>{cvData.personal.address}</p>
          <p>{cvData.personal.phone}</p>
          <p>{cvData.personal.email}</p>
          <p className="text-accent font-bold uppercase tracking-wide pt-1">{cvData.personal.workAuth}</p>
        </div>
        <div className="w-24 h-32 border flex items-center justify-center text-[10px] text-muted-foreground">
          {photoUrl ? <img src={photoUrl} alt="Photograph" className="w-full h-full object-cover" /> : <span>Photograph</span>}
        </div>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-primary uppercase tracking-wider border-b-2 border-primary/10 pb-1">Profile</h2>
        <p className="text-xs leading-relaxed">{cvData.summary}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-primary uppercase tracking-wider border-b-2 border-primary/10 pb-1">Skills</h2>
        <p className="text-xs font-medium">{cvData.skills.join(" • ")}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold text-primary uppercase tracking-wider border-b-2 border-primary/10 pb-1">Experience</h2>
        <div className="space-y-6">
          {cvData.experience.map((exp) => (
            <div key={exp.id} className="grid grid-cols-[120px_1fr] gap-6">
              <div className="text-[10px] text-muted-foreground font-bold">{exp.duration}</div>
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-primary">{exp.title} | {exp.company}</p>
                <ul className="list-disc list-inside text-xs space-y-1 leading-relaxed">
                  {exp.description.split("\n").filter(Boolean).map((line, i) => (
                    <li key={i}>{line.replace(/^[-•\s]+/, "")}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-primary uppercase tracking-wider border-b-2 border-primary/10 pb-1">Education</h2>
        <div className="space-y-3">
          {cvData.education.map((ed) => (
            <div key={ed.id} className="flex justify-between items-baseline">
              <div>
                <p className="text-xs font-bold">{ed.degree}</p>
                <p className="text-[10px] text-muted-foreground">{ed.school}</p>
              </div>
              <p className="text-[10px] font-bold">{ed.year}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
