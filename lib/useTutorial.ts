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
}

export function useTutorial() {
  const [state, setState] = useState<StoredState>({ active: false, stepIndex: 0 });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
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

  return {
    active: hydrated && state.active,
    stepIndex: state.stepIndex,
    start,
    stop,
    next,
    skipStep,
    hydrated,
  };
}
