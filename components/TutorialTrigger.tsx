"use client";

import { useTutorial } from "@/lib/useTutorial";
import { useProducts } from "@/lib/useProducts";
import { useRouter } from "next/navigation";

// The top-right "Mode Tutorial" button Jo asked for, for first-time
// visitors to trigger a guided walkthrough on demand rather than being
// forced through one. The tour now walks through an actual product's
// checklist (see lib/tutorialSteps.ts) rather than the homepage, so this
// needs a product to exist first — with none yet, it sends the visitor to
// /produk instead of starting a tour with nothing to spotlight.
export default function TutorialTrigger() {
  const { start } = useTutorial();
  const { products, hydrated } = useProducts();
  const router = useRouter();

  function handleClick() {
    if (hydrated && products.length === 0) {
      router.push("/produk");
      return;
    }
    router.push("/checklist");
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
