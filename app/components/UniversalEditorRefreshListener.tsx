"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/** Content mutation events from Universal Editor (bubble to body). */
const AUE_CONTENT_EVENTS = [
  "aue:content-add",
  "aue:content-move",
  "aue:content-patch",
  "aue:content-remove",
  "aue:content-update",
] as const;

const REFRESH_DEBOUNCE_MS = 150;

/**
 * Listens for Universal Editor content events and refetches server-rendered
 * content. Events bubble to body per UE docs; debounced to coalesce bursts.
 */
export default function UniversalEditorRefreshListener() {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const scheduleRefresh = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        router.refresh();
      }, REFRESH_DEBOUNCE_MS);
    };

    const onContentChange = () => scheduleRefresh();

    for (const eventName of AUE_CONTENT_EVENTS) {
      document.body.addEventListener(eventName, onContentChange);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      for (const eventName of AUE_CONTENT_EVENTS) {
        document.body.removeEventListener(eventName, onContentChange);
      }
    };
  }, [router]);

  return null;
}
