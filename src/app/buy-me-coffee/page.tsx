import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

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

      <Card className="bg-white border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">QR code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-xl bg-white p-4 flex justify-center">
            <Image
              src="/api/qr"
              alt="Buy me a coffee QR code"
              width={420}
              height={420}
              className="h-auto w-full max-w-[420px]"
              priority
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Scan and pay using UPI.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
