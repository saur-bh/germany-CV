import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

const templates = {
  "one-page": {
    source: "1-page.docx",
    download: "Germany_CV_Template_1Page.docx",
  },
  "two-page": {
    source: "2-page.docx",
    download: "Germany_CV_Template_2Page.docx",
  },
} as const;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ template: string }> }
) {
  const { template } = await params;

  const selected = templates[template as keyof typeof templates];
  if (!selected) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "CV", selected.source);
  const fileBuffer = await readFile(filePath);

  return new NextResponse(new Uint8Array(fileBuffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${selected.download}"`,
      "Cache-Control": "no-store",
    },
  });
}
