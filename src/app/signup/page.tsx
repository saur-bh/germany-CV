import { Suspense } from "react";
import { SignupClient } from "@/app/signup/SignupClient";

export default function SignupPage() {
  return (
    <Suspense>
      <SignupClient />
    </Suspense>
  );
}
