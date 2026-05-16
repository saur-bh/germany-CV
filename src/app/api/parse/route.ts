import { NextResponse } from "next/server";
// @ts-ignore
import pdf from "pdf-parse";
import mammoth from "mammoth";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log(`Parsing file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
    let text = "";

    if (file.type === "application/pdf") {
      console.log("Starting PDF extraction...");
      const data = await pdf(buffer);
      text = data.text;
      console.log(`PDF extraction complete. Text length: ${text.length}`);
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (file.type === "text/plain") {
      text = buffer.toString("utf-8");
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload PDF or DOCX." },
        { status: 400 }
      );
    }

    return NextResponse.json({ text: text.trim() });
  } catch (error: any) {
    console.error("Parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse file", details: error.message },
      { status: 500 }
    );
  }
}
