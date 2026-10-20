"use client";

import { useCallback, useEffect, useState } from "react";
import { TUTORIAL_STEPS } from "./tutorialSteps";

// Minimal localStorage-backed state for the guided tour — just "is it
// running" and "which step" — mirroring the hydration pattern every other
// stateful hook on this site uses (see lib/useProducts.ts). Stored (not
// just React state) so a page refresh mid-tour doesn't silently drop the
// visitor back to step one with no explanation; cleared once the tour
// finishes or is explicitly closed.
const STATE_KEY = "ina-caif-tutorial-v1";

// This hook has two independent call sites that are never the same React
// component instance: TutorialOverlay (mounted once, in app/layout.tsx, and
// never remounted by client-side navigation) and TutorialTrigger (rendered
// inside each page's own <Header/>, so it remounts on every navigation).
// useState alone gives each call site its own private state — writing to
// localStorage from one does NOT re-render the other. Concretely, this is
// why "Mode Tutorial" couldn't restart a finished tour: TutorialTrigger's
// start() updated only its own (disposable, about-to-unmount) copy of
// state, while the long-lived TutorialOverlay instance — the one that
// actually renders the spotlight — never found out. A same-tab custom
// event, fired on every save() and listened for by every hook instance, is
// the fix: it makes every mounted instance re-read localStorage immediately
// whenever any other instance changes it, without needing a shared context
// provider.
const SYNC_EVENT = "ina-caif-tutorial-sync";

type StoredState = { active: boolean; stepIndex: number };

function load(): StoredState {
  try {
    const raw = window.localStorage.getItem(STATE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredState;
      if (
        typeof parsed.active === "boolean" &&
        typeof parsed.stepIndex === "number" &&
        parsed.stepIndex >= 0 &&
        parsed.stepIndex < TUTORIAL_STEPS.length
      ) {
        return parsed;
      }
    }
  } catch {
    // Ignore malformed/inaccessible storage.
  }
  return { active: false, stepIndex: 0 };
}

function save(state: StoredState) {
  try {
    window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    // Ignore.
  }
  try {
    window.dispatchEvent(new Event(SYNC_EVENT));
  } catch {
    // Ignore (e.g. no window during SSR, though this module is client-only).
  }
}

export function useTutorial() {
  const [state, setState] = useState<StoredState>({ active: false, stepIndex: 0 });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
    // Re-sync whenever ANY mounted useTutorial() instance changes the
    // shared localStorage state — see the SYNC_EVENT comment above.
    function onSync() {
      setState(load());
    }
    window.addEventListener(SYNC_EVENT, onSync);
    return () => window.removeEventListener(SYNC_EVENT, onSync);
  }, []);

  const start = useCallback(() => {
    const next = { active: true, stepIndex: 0 };
    setState(next);
    save(next);
  }, []);

  const stop = useCallback(() => {
    const next = { active: false, stepIndex: 0 };
    setState(next);
    save(next);
  }, []);

  const next = useCallback(() => {
    setState((current) => {
      const nextIndex = current.stepIndex + 1;
      if (nextIndex >= TUTORIAL_STEPS.length) {
        const finished = { active: false, stepIndex: 0 };
        save(finished);
        return finished;
      }
      const updated = { active: true, stepIndex: nextIndex };
      save(updated);
      return updated;
    });
  }, []);

  // Skips the current step without ending the tour — used when a step's
  // target can't be found on the page (e.g. layout changed under us) so
  // the tour never silently gets stuck on a spotlight that never appears.
  const skipStep = next;

  // Goes back one step without ending the tour — stays on step 0 rather
  // than wrapping or closing, so repeatedly pressing it is harmless.
  const prev = useCallback(() => {
    setState((current) => {
      const prevIndex = Math.max(current.stepIndex - 1, 0);
      const updated = { active: true, stepIndex: prevIndex };
      save(updated);
      return updated;
    });
  }, []);

  return {
    active: hydrated && state.active,
    stepIndex: state.stepIndex,
    start,
    stop,
    next,
    prev,
    skipStep,
    hydrated,
  };
}
