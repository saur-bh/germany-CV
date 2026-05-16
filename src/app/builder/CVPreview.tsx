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

export function CVPreview({ cvData, photoUrl }: { cvData: CVData; photoUrl: string | null; isMini?: boolean }) {
  const today = new Date().toLocaleDateString("en-DE", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="bg-white text-[#222] p-10 max-w-[210mm] mx-auto min-h-[297mm] font-[Calibri,Arial,sans-serif] text-[11px] leading-[1.5] print:p-0 print:shadow-none">

      {/* ───── HEADER ───── */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h1 className="text-[22px] font-bold tracking-tight text-[#1a1a1a] mb-1">
            {cvData.personal.fullName || "Full Name"}
          </h1>
          <div className="space-y-0 text-[10.5px] text-[#444]">
            {cvData.personal.address && <p>{cvData.personal.address}</p>}
            {cvData.personal.phone && <p>{cvData.personal.phone}</p>}
            {cvData.personal.email && <p>{cvData.personal.email}</p>}
            {cvData.personal.linkedin && (
              <p className="text-blue-700">{cvData.personal.linkedin}</p>
            )}
            {cvData.personal.dob && <p>Date of Birth: {cvData.personal.dob}</p>}
            {cvData.personal.nationality && <p>Nationality: {cvData.personal.nationality}</p>}
          </div>
        </div>
        {photoUrl && (
          <img src={photoUrl} alt="Photo" className="w-[90px] h-[110px] object-cover border border-gray-200 ml-6" />
        )}
      </div>

      {/* ───── PROFILE ───── */}
      {cvData.summary && (
        <Section title="Profile">
          <p className="text-[11px] leading-relaxed">{cvData.summary}</p>
        </Section>
      )}

      {/* ───── AREAS OF EXPERTISE ───── */}
      {cvData.skills.length > 0 && (
        <Section title="Areas of Expertise">
          <p className="text-[11px] leading-relaxed">{cvData.skills.join(" · ")}</p>
        </Section>
      )}

      {/* ───── WORK EXPERIENCE ───── */}
      {cvData.experience.some(e => e.title || e.company) && (
        <Section title="Work Experience">
          <div className="space-y-4">
            {cvData.experience.map((exp) => (
              <div key={exp.id} className="grid grid-cols-[130px_1fr] gap-4">
                <div className="text-[10.5px] text-[#555] pt-0.5">{exp.duration}</div>
                <div className="space-y-1">
                  <p className="font-bold text-[11px]">
                    {exp.company}{exp.location ? `, ${exp.location}` : ""}
                  </p>
                  <p className="text-[11px] italic">{exp.title}</p>
                  {exp.description && (
                    <ul className="list-disc ml-4 space-y-0.5 text-[10.5px]">
                      {exp.description.split("\n").filter(Boolean).map((line, i) => (
                        <li key={i} className="leading-relaxed">{line.replace(/^[-•\s]+/, "")}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ───── EDUCATION ───── */}
      {cvData.education.some(e => e.degree || e.school) && (
        <Section title="Education">
          <div className="space-y-3">
            {cvData.education.map((ed) => (
              <div key={ed.id} className="grid grid-cols-[130px_1fr] gap-4">
                <div className="text-[10.5px] text-[#555] pt-0.5">{ed.year}</div>
                <div className="space-y-0.5">
                  <p className="text-[11px]"><span className="font-bold">{ed.school}</span>{ed.location ? `, ${ed.location}` : ""}</p>
                  <p className="text-[11px]">{ed.degree}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ───── SKILLS (table style) ───── */}
      {cvData.skills.length > 0 && (
        <Section title="Skills">
          <div className="grid grid-cols-[130px_1fr] gap-4">
            <div className="text-[10.5px] text-[#555]">Computer/Software</div>
            <div className="text-[11px]">{cvData.skills.join(", ")}</div>
          </div>
        </Section>
      )}

      {/* ───── LANGUAGES ───── */}
      {cvData.languages.some(l => l.name.trim()) && (
        <Section title="Language Skills">
          <div className="grid grid-cols-[130px_1fr] gap-4">
            <div className="text-[10.5px] text-[#555]">Languages</div>
            <div className="space-y-0.5 text-[11px]">
              {cvData.languages.filter(l => l.name.trim()).map((l) => (
                <p key={l.id}>{l.name}: {l.level}</p>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ───── VISA / AVAILABILITY (Chancenkarte specific) ───── */}
      {(cvData.chance.visaStatus || cvData.personal.workAuth) && (
        <Section title="Work Authorization">
          <div className="grid grid-cols-[130px_1fr] gap-4">
            <div className="text-[10.5px] text-[#555]">Status</div>
            <div className="text-[11px] space-y-0.5">
              {cvData.personal.workAuth && <p>{cvData.personal.workAuth}</p>}
              {cvData.chance.visaStatus && <p>{cvData.chance.visaStatus}</p>}
              {cvData.chance.availability && <p>Available: {cvData.chance.availability}</p>}
              {cvData.chance.targetCity && <p>Target location: {cvData.chance.targetCity}</p>}
            </div>
          </div>
        </Section>
      )}

      {/* ───── REFERENCES ───── */}
      <Section title="References">
        <p className="text-[11px] italic">Available upon request.</p>
      </Section>

      {/* ───── DECLARATION ───── */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-[10.5px] text-[#555] space-y-4">
        <p>I hereby declare that the information provided above is true and correct to the best of my knowledge.</p>
        <div className="pt-4">
          <p>{cvData.chance.currentCity || "Place"}, {today}</p>
          <p className="font-bold text-[#222]">{cvData.personal.fullName || "Full Name"}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Reusable section heading ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h2 className="text-[13px] font-bold text-[#1a1a1a] uppercase tracking-wide border-b border-[#ccc] pb-1 mb-2">{title}</h2>
      {children}
    </section>
  );
}
