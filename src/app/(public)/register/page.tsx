import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="font-mono text-slate-500">Loading...</div>}>
        <AuthForm mode="register" />
      </Suspense>
    </section>
  );
}