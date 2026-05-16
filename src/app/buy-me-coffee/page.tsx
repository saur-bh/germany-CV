import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { AlertCircle } from "lucide-react";

export default function BuyMeCoffeePage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20 max-w-3xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Buy me a coffee
        </h1>
        <p className="text-muted-foreground">
          Pay ₹99 to support the project. This covers a <b>Priority 1:1 CV Review session</b> or enables “Use my
          AI key” for your account (DeepSeek).
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="bg-white border shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Step 1: Pay ₹99 via UPI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-xl bg-white p-4 flex justify-center">
              <Image
                src="/api/qr"
                alt="Buy me a coffee QR code"
                width={320}
                height={320}
                className="h-auto w-full max-w-[320px]"
                priority
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Scan and pay using any UPI app.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border shadow-sm border-accent/20">
          <CardHeader>
            <CardTitle className="text-xl">Step 2: Book Your Slot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">
              After payment, select a time that works for you on my calendar.
            </p>
            <a 
              href="https://calendar.app.google/GwuUsxx89FjMeCpX8" 
              target="_blank" 
              className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white hover:bg-accent/90 w-full"
            >
              Open Booking Calendar
            </a>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Pre-requisite</span>
              </div>
              <p className="text-xs text-muted-foreground bg-amber-50 p-3 rounded-lg border border-amber-100 italic">
                ⚠️ Please have your current CV open and ready to share on screen at the very start of the meeting.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-headline">📅 Meeting Agenda (60 Mins)</h2>
        <div className="grid gap-4">
          {[
            { time: "00:05", title: "Welcome & Goals", desc: "Align on target roles, cities, and visa status." },
            { time: "00:30", title: "Live CV Review", desc: "First impression audit, rewriting bullet points (X-Y-Z formula), and tech-stack clarity." },
            { time: "00:20", title: "Search Strategy", desc: "LinkedIn vs. Xing, local boards (StepStone/Indeed), and cultural nuances." },
            { time: "00:05", title: "Action Items", desc: "Define specific edits and goals for the upcoming week." },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start p-4 bg-muted/30 rounded-2xl border">
              <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full shrink-0">
                {item.time}
              </div>
              <div className="space-y-1">
                <p className="font-bold text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
