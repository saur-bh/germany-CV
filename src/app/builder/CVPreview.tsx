import React from "react";

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
    <div className="bg-white text-[#222] mx-auto w-[210mm] min-h-[297mm] font-[Calibri,Arial,sans-serif] text-[11px] leading-[1.5] print:shadow-none flex shrink-0">
      {/* ───── SIDEBAR ───── */}
      <div className="w-[32%] bg-[#f4f6f8] p-8 border-r border-gray-200 print:bg-[#f4f6f8] flex flex-col gap-6">
        {photoUrl && (
          <div className="flex justify-center mb-2">
            <img src={photoUrl} alt="Photo" className="w-[120px] h-[150px] object-cover border-4 border-white shadow-sm" />
          </div>
        )}

        <SidebarSection title="Contact">
          <div className="space-y-1.5 text-[10.5px]">
            {cvData.personal.email && <p className="break-all">{cvData.personal.email}</p>}
            {cvData.personal.phone && <p>{cvData.personal.phone}</p>}
            {cvData.personal.address && <p>{cvData.personal.address}</p>}
            {cvData.personal.linkedin && <p className="text-blue-700 break-all">{cvData.personal.linkedin}</p>}
          </div>
        </SidebarSection>

        {(cvData.personal.dob || cvData.personal.nationality) && (
          <SidebarSection title="Personal Info">
            <div className="space-y-1.5 text-[10.5px]">
              {cvData.personal.dob && <p>DOB: {cvData.personal.dob}</p>}
              {cvData.personal.nationality && <p>Nationality: {cvData.personal.nationality}</p>}
            </div>
          </SidebarSection>
        )}

        {cvData.skills.length > 0 && (
          <SidebarSection title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {cvData.skills.map((skill, i) => (
                <span key={i} className="bg-white border border-gray-200 px-2 py-0.5 rounded text-[10px] text-[#444]">
                  {skill}
                </span>
              ))}
            </div>
          </SidebarSection>
        )}

        {cvData.languages.some(l => l.name.trim()) && (
          <SidebarSection title="Languages">
            <div className="space-y-1.5 text-[10.5px]">
              {cvData.languages.filter(l => l.name.trim()).map((l) => (
                <div key={l.id} className="flex justify-between">
                  <span>{l.name}</span>
                  <span className="text-[#666]">{l.level}</span>
                </div>
              ))}
            </div>
          </SidebarSection>
        )}

        {(cvData.chance.visaStatus || cvData.personal.workAuth) && (
          <SidebarSection title="Work Authorization">
            <div className="space-y-1.5 text-[10.5px]">
              {cvData.personal.workAuth && <p className="font-bold">{cvData.personal.workAuth}</p>}
              {cvData.chance.visaStatus && <p>{cvData.chance.visaStatus}</p>}
              {cvData.chance.availability && <p>Available: {cvData.chance.availability}</p>}
              {cvData.chance.targetCity && <p>Target: {cvData.chance.targetCity}</p>}
            </div>
          </SidebarSection>
        )}
      </div>

      {/* ───── MAIN CONTENT ───── */}
      <div className="w-[68%] p-8 bg-white flex flex-col gap-6">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-[#1a1a1a] leading-none mb-1">
            {cvData.personal.fullName || "Full Name"}
          </h1>
          {cvData.targetRole && (
            <h2 className="text-[14px] text-blue-700 font-medium tracking-wide uppercase">
              {cvData.targetRole}
            </h2>
          )}
        </div>

        {cvData.summary && (
          <MainSection title="Professional Summary">
            <p className="text-[11px] leading-relaxed text-[#333]">{cvData.summary}</p>
          </MainSection>
        )}

        {cvData.experience.some(e => e.title || e.company) && (
          <MainSection title="Work Experience">
            <div className="space-y-5">
              {cvData.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-[12px] text-[#1a1a1a]">{exp.title}</h3>
                    <span className="text-[10.5px] text-[#666] whitespace-nowrap ml-2">{exp.duration}</span>
                  </div>
                  <div className="text-[11px] italic text-[#444] mb-1.5">
                    {exp.company}{exp.location ? ` | ${exp.location}` : ""}
                  </div>
                  {exp.description && (
                    <ul className="list-disc ml-4 space-y-0.5 text-[10.5px] text-[#333]">
                      {exp.description.split("\n").filter(Boolean).map((line, i) => (
                        <li key={i} className="leading-relaxed pl-1">{line.replace(/^[-•\s]+/, "")}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </MainSection>
        )}

        {cvData.education.some(e => e.degree || e.school) && (
          <MainSection title="Education">
            <div className="space-y-4">
              {cvData.education.map((ed) => (
                <div key={ed.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-[11px] text-[#1a1a1a]">{ed.degree}</h3>
                    <span className="text-[10.5px] text-[#666] whitespace-nowrap ml-2">{ed.year}</span>
                  </div>
                  <div className="text-[11px] text-[#444]">
                    {ed.school}{ed.location ? `, ${ed.location}` : ""}
                  </div>
                </div>
              ))}
            </div>
          </MainSection>
        )}

        <div className="mt-auto pt-8">
          <div className="border-t border-gray-200 pt-4 text-[10px] text-[#666] space-y-3">
            <p>I hereby declare that the information provided above is true and correct to the best of my knowledge.</p>
            <div>
              <p>{cvData.chance.currentCity || "Place"}, {today}</p>
              <p className="font-bold text-[#1a1a1a] mt-1">{cvData.personal.fullName || "Full Name"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <h3 className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-wider mb-2 border-b border-gray-300 pb-1">{title}</h3>
      {children}
    </div>
  );
}

function MainSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[14px] font-bold text-[#1a1a1a] uppercase tracking-wider border-b-2 border-[#1a1a1a] pb-1 mb-3">{title}</h2>
      {children}
    </section>
  );
}

