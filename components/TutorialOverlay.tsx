"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTutorial } from "@/lib/useTutorial";
import { TUTORIAL_STEPS } from "@/lib/tutorialSteps";
import { useProducts } from "@/lib/useProducts";
import { useQualifyingAnswers } from "@/lib/useQualifyingAnswers";
import { deriveClassification } from "@/lib/classification";
import { KEMENKES_SUBMISSION_GUIDE_URL } from "@/lib/checklistData";

type Rect = { top: number; left: number; width: number; height: number };

function getRect(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

// Mounted once in app/layout.tsx so it survives client-side navigation
// between the tour's steps (a per-page component would unmount and lose
// state every time a step moves to a different route). Renders nothing
// when the tour isn't active — see components/TutorialTrigger.tsx for how
// it starts.
//
// Per Jo: a thin grey overlay (not solid black) that dims everything except
// one spotlighted element at a time, with a short instruction card next to
// it — "game-like", not a block of onboarding text up front. Implemented as
// four strips around the target's bounding box rather than a box-shadow
// cutout, so the math stays simple for an arbitrary element size/position
// and the strips can independently block clicks outside the spotlight while
// the spotlighted element itself stays fully interactive (needed for the
// one step that asks the visitor to click it).
export default function TutorialOverlay() {
  const { active, stepIndex, next, skipStep, stop, hydrated } = useTutorial();
  const pathname = usePathname();
  const router = useRouter();
  const [rect, setRect] = useState<Rect | null>(null);
  const [notFound, setNotFound] = useState(false);
  const navigatedRef = useRef<string | null>(null);

  // Used to fill in the {KLASIFIKASI} token in the "form-explainer" intro
  // step's body with the visitor's own product classification, when it's
  // already known — read directly off localStorage via the same hooks the
  // checklist page itself uses, since the overlay is mounted globally
  // (app/layout.tsx) and has no product context passed down to it.
  const { activeProductId } = useProducts();
  const { answers } = useQualifyingAnswers(activeProductId);
  const classification = deriveClassification(answers);

  const step = active ? TUTORIAL_STEPS[stepIndex] : null;
  const onRightPage = step ? pathname === step.path : false;
  const hasSpotlight = step ? step.selector !== null : false;
  const stepBody = step
    ? step.body.replace(
        "{KLASIFIKASI}",
        classification === "SiMD" ? "SiMD" : classification === "SaMD" ? "SaMD" : "produk Anda"
      )
    : "";

  // Navigate to the step's own page when it isn't the current one — once
  // per step (guarded by navigatedRef) so this never fights a visitor who
  // manually navigates elsewhere mid-tour.
  useEffect(() => {
    if (!step) return;
    if (onRightPage) return;
    if (navigatedRef.current === step.id) return;
    navigatedRef.current = step.id;
    router.push(step.path);
  }, [step, onRightPage, router]);

  // Locate (and keep up to date) the target element for the current step.
  // Steps with no selector (selector: null — the intro step) render as a
  // centered card with nothing to measure, so this skips the whole
  // DOM-polling dance for them.
  useEffect(() => {
    if (!step || !onRightPage || !hasSpotlight) {
      setRect(null);
      setNotFound(false);
      return;
    }

    let cancelled = false;
    let attempts = 0;
    setNotFound(false);

    function measure() {
      const el = document.querySelector(step!.selector!);
      if (el) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        // Small delay so the measurement happens after the smooth-scroll
        // settles rather than mid-flight.
        window.setTimeout(() => {
          if (cancelled) return;
          const found = document.querySelector(step!.selector!);
          if (found) setRect(getRect(found));
        }, 300);
        return true;
      }
      return false;
    }

    function poll() {
      if (cancelled) return;
      if (measure()) return;
      attempts += 1;
      // Target not in the DOM yet (route still rendering) — keep trying
      // briefly, then give up rather than spotlighting nothing forever.
      if (attempts < 15) {
        window.setTimeout(poll, 200);
      } else {
        setNotFound(true);
      }
    }
    poll();

    function onViewportChange() {
      const el = document.querySelector(step!.selector!);
      if (el) setRect(getRect(el));
    }
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, true);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
    };
  }, [step, onRightPage]);

  // "click" steps: advance as soon as the visitor clicks inside the
  // spotlighted element — the click itself is never intercepted, so
  // whatever the element normally does (navigate, toggle, etc.) still
  // happens.
  useEffect(() => {
    if (!step || !hasSpotlight || step.advance !== "click" || !rect) return;
    function onClick(e: MouseEvent) {
      const el = document.querySelector(step!.selector!);
      if (el && e.target instanceof Node && el.contains(e.target)) {
        window.setTimeout(() => next(), 50);
      }
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [step, rect, next]);

  // Still waiting on the right page to mount, or the element genuinely
  // isn't there — rather than leaving the visitor staring at a frozen dim
  // screen, skip straight ahead instead of blocking the tour. Done as an
  // effect (not inline during render) since it changes tutorial state.
  useEffect(() => {
    if (notFound) skipStep();
  }, [notFound, skipStep]);

  if (!hydrated || !active || !step) return null;

  const stepNumber = stepIndex + 1;
  const totalSteps = TUTORIAL_STEPS.length;

  if (!hasSpotlight) {
    if (!onRightPage) {
      return <div className="pointer-events-none fixed inset-0 z-[90] bg-ink/10" aria-hidden />;
    }
    // The "form-explainer" intro step: no element on the page to point at
    // yet, so this renders as a plain centered card over a full dim,
    // instead of the spotlight-ring layout below. Wider than the regular
    // instruction card since it carries a short illustration (Form A–E +
    // an upload step) rather than a one-paragraph tip.
    return (
      <div className="fixed inset-0 z-[90]" role="dialog" aria-label="Mode Tutorial">
        <div className="pointer-events-auto fixed inset-0 bg-ink/50" onClick={stop} aria-hidden />
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center p-4">
          <div className="pointer-events-auto w-full max-w-md rounded-lg border border-border-subtle bg-surface p-5 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                Langkah {stepNumber} dari {totalSteps}
              </p>
              <button
                type="button"
                onClick={stop}
                aria-label="Tutup tutorial"
                className="flex-shrink-0 text-ink-muted hover:text-ink"
              >
                ✕
              </button>
            </div>
            <h3 className="mt-1 font-display text-base font-semibold text-ink">{step.title}</h3>

            {/* Illustrative mockup, not a real screenshot — the actual
                e-Regalkes interface (with real screenshots of Form A–E and
                the file-upload step) is one click away via the Kemenkes PDF
                guide linked below. */}
            <div className="mt-3 rounded-md border border-dashed border-border-subtle bg-surface-alt p-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {["A", "B", "C", "D", "E"].map((label) => (
                  <span
                    key={label}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-border-subtle bg-surface text-xs font-semibold text-ink-muted"
                  >
                    {label}
                  </span>
                ))}
                <span aria-hidden className="mx-1 text-ink-muted">
                  +
                </span>
                <span className="inline-flex h-8 items-center rounded-md border border-border-subtle bg-surface px-2.5 text-[11px] font-medium text-ink-muted">
                  Pilih File ↑
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-[16px] text-ink-muted">
                Ilustrasi struktur formulir e-Regalkes, bukan tangkapan layar asli.
              </p>
            </div>

            <p className="mt-3 text-sm leading-[20px] text-ink-muted">{stepBody}</p>

            <a
              href={KEMENKES_SUBMISSION_GUIDE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs font-medium text-brand hover:underline"
            >
              Lihat contoh tangkapan layar asli di pedoman Kemenkes →
            </a>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={stop}
                className="text-xs font-medium text-ink-muted hover:text-brand"
              >
                Lewati tutorial
              </button>
              <button
                type="button"
                onClick={next}
                className="rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-on-brand hover:bg-brand-dark"
              >
                Lanjut
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !onRightPage || !rect) {
    // Brief transition state while navigating — a light dim with no
    // spotlight yet, so the screen doesn't flash unstyled between steps.
    return <div className="pointer-events-none fixed inset-0 z-[90] bg-ink/10" aria-hidden />;
  }

  const PAD = 8;
  const top = Math.max(rect.top - PAD, 0);
  const left = Math.max(rect.left - PAD, 0);
  const width = rect.width + PAD * 2;
  const height = rect.height + PAD * 2;

  const cardTop = step.placement === "top" ? Math.max(top - 170, 12) : top + height + 12;

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-label="Mode Tutorial">
      {/* Four dimming strips around the spotlight — thin grey, not solid black. */}
      <div
        className="pointer-events-auto fixed left-0 right-0 top-0 bg-ink/35"
        style={{ height: top }}
      />
      <div
        className="pointer-events-auto fixed left-0 right-0 bottom-0 bg-ink/35"
        style={{ top: top + height }}
      />
      <div
        className="pointer-events-auto fixed bottom-0 left-0 bg-ink/35"
        style={{ top, height, width: left }}
      />
      <div
        className="pointer-events-auto fixed bottom-0 right-0 bg-ink/35"
        style={{ top, height, left: left + width }}
      />

      {/* Spotlight ring — no backdrop over the target itself, and clicks
          pass straight through to it. */}
      <div
        className="pointer-events-none fixed rounded-md ring-2 ring-brand ring-offset-2"
        style={{ top, left, width, height }}
      />

      {/* Instruction card. */}
      <div
        className="pointer-events-auto fixed w-[min(320px,calc(100vw-32px))] rounded-lg border border-border-subtle bg-surface p-4 shadow-lg"
        style={{
          top: cardTop,
          left: Math.min(Math.max(left, 16), typeof window !== "undefined" ? window.innerWidth - 336 : left),
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            Langkah {stepNumber} dari {totalSteps}
          </p>
          <button
            type="button"
            onClick={stop}
            aria-label="Tutup tutorial"
            className="flex-shrink-0 text-ink-muted hover:text-ink"
          >
            ✕
          </button>
        </div>
        <h3 className="mt-1 font-display text-sm font-semibold text-ink">{step.title}</h3>
        <p className="mt-1.5 text-sm leading-[20px] text-ink-muted">{stepBody}</p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={stop}
            className="text-xs font-medium text-ink-muted hover:text-brand"
          >
            Lewati tutorial
          </button>
          {step.advance === "button" ? (
            <button
              type="button"
              onClick={next}
              className="rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-on-brand hover:bg-brand-dark"
            >
              {stepNumber === totalSteps ? "Selesai" : "Lanjut"}
            </button>
          ) : (
            <span className="text-xs font-medium text-brand">Klik elemen yang disorot →</span>
          )}
        </div>
      </div>
    </div>
  );
}
