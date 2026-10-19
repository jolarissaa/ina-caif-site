"use client";

import { useTutorial } from "@/lib/useTutorial";
import { useRouter, usePathname } from "next/navigation";

// The top-right "Mode Tutorial" button Jo asked for, for first-time
// visitors to trigger a guided walkthrough on demand rather than being
// forced through one. Lives in Header, so it's available on every page; the
// tour itself always starts from the homepage (see lib/tutorialSteps.ts),
// so this navigates there first when clicked from anywhere else.
export default function TutorialTrigger() {
  const { start } = useTutorial();
  const router = useRouter();
  const pathname = usePathname();

  function handleClick() {
    if (pathname !== "/") router.push("/");
    start();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 rounded-pill border border-brand/30 bg-brand/5 px-3 py-1.5 text-xs font-semibold text-brand hover:border-brand hover:bg-brand/10"
    >
      <svg aria-hidden viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
        <circle cx="10" cy="10" r="7.5" strokeLinejoin="round" />
        <path d="M7.8 7.8a2.2 2.2 0 1 1 3.1 2c-.7.5-1.1 1-1.1 1.9" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="14" r="0.6" fill="currentColor" stroke="none" />
      </svg>
      Mode Tutorial
    </button>
  );
}
