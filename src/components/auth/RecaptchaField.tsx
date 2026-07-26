"use client";

import { useEffect, useId, useRef } from "react";
import { getRecaptchaSiteKey } from "@/lib/security/recaptcha-public";

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        params: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "dark" | "light";
        }
      ) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
    };
    __qsRecaptchaOnLoad?: () => void;
  }
}

const SCRIPT_ID = "google-recaptcha-v2";

export function RecaptchaField({
  onToken,
}: {
  onToken: (token: string | null) => void;
}) {
  const siteKey = getRecaptchaSiteKey();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const reactId = useId();

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    function renderWidget() {
      if (!containerRef.current || !window.grecaptcha || widgetIdRef.current != null) {
        return;
      }
      try {
        widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          theme: "dark",
          callback: (token: string) => onToken(token),
          "expired-callback": () => onToken(null),
          "error-callback": () => onToken(null),
        });
      } catch (err) {
        console.error("[recaptcha] render failed:", err);
      }
    }

    if (window.grecaptcha) {
      renderWidget();
      return;
    }

    window.__qsRecaptchaOnLoad = () => {
      renderWidget();
    };

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src =
        "https://www.google.com/recaptcha/api.js?onload=__qsRecaptchaOnLoad&render=explicit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    return () => {
      widgetIdRef.current = null;
    };
  }, [siteKey, onToken]);

  if (!siteKey) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-xs uppercase tracking-wider text-slate-400">
        Verify you&apos;re human
      </label>
      <div
        ref={containerRef}
        id={`recaptcha-${reactId.replace(/:/g, "")}`}
        className="min-h-[78px]"
      />
    </div>
  );
}
