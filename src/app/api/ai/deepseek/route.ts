import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type DeepSeekTask = "profile_summary" | "skills" | "experience_bullets";

function parsePaidEmails(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 500 }
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        task: DeepSeekTask;
        input: Record<string, unknown>;
        userApiKey?: string;
        useServerKey?: boolean;
      }
    | null;

  if (!body || !body.task || !body.input) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const useServerKey = Boolean(body.useServerKey);
  const paidEmails = parsePaidEmails(process.env.PAID_EMAILS);

  const apiKey = useServerKey ? process.env.DEEPSEEK_API_KEY : body.userApiKey;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: useServerKey
          ? "Server AI key is not configured"
          : "Missing user API key",
      },
      { status: 400 }
    );
  }

  if (useServerKey) {
    const email = (user.email ?? "").toLowerCase();
    const metaPaid = Boolean((user.user_metadata as any)?.ai_paid);
    if ((!email || !paidEmails.includes(email)) && !metaPaid) {
      return NextResponse.json(
        { error: "Payment required (₹99) to use server AI key" },
        { status: 402 }
      );
    }
  }

  const system = (() => {
    if (body.task === "profile_summary") {
      return "You are a career advisor for Indians applying to jobs in Germany (Chancenkarte). Write ATS-friendly CV content. Keep it factual and concise. No tables or icons.";
    }
    if (body.task === "skills") {
      return "You are an ATS keyword expert for German job applications. Suggest specific technical and professional skills only. Avoid generic soft skills.";
    }
    return "You are an ATS CV editor for German job applications. Convert raw experience into 4-6 action-led bullet points with measurable impact where possible.";
  })();

  const prompt = (() => {
    if (body.task === "profile_summary") {
      const experience = String(body.input.experience ?? "");
      const skills = String(body.input.skills ?? "");
      const targetRole = String(body.input.targetRole ?? "");
      const workAuth = String(body.input.workAuth ?? "");
      const language = String(body.input.language ?? "");
      return [
        "Write a 3-4 line profile summary.",
        targetRole ? `Target role: ${targetRole}` : "",
        workAuth ? `Work authorization: ${workAuth}` : "",
        language ? `Languages: ${language}` : "",
        experience ? `Experience: ${experience}` : "",
        skills ? `Skills: ${skills}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    }

    if (body.task === "skills") {
      const role = String(body.input.targetRole ?? "");
      const experience = String(body.input.experience ?? "");
      return [
        "Return a comma-separated list of 15-30 skills grouped by category (Testing, Automation, Programming, Tools, Cloud, etc.).",
        role ? `Target role: ${role}` : "",
        experience ? `Experience: ${experience}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    }

    const raw = String(body.input.experienceText ?? "");
    const jobTitle = String(body.input.jobTitle ?? "");
    const company = String(body.input.company ?? "");
    const location = String(body.input.location ?? "");
    const duration = String(body.input.duration ?? "");
    return [
      "Return bullet points only. One bullet per line.",
      jobTitle ? `Job title: ${jobTitle}` : "",
      company ? `Company: ${company}` : "",
      location ? `Location: ${location}` : "",
      duration ? `Duration: ${duration}` : "",
      raw ? `Raw text: ${raw}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  })();

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      stream: false,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    return NextResponse.json(
      { error: "DeepSeek request failed", details: text.slice(0, 500) },
      { status: 502 }
    );
  }

  const json = (await response.json()) as any;
  const content = json?.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    return NextResponse.json(
      { error: "Invalid AI response" },
      { status: 502 }
    );
  }

  return NextResponse.json({ text: content.trim() });
}
