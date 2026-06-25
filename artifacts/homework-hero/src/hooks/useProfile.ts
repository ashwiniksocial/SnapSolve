/**
 * useProfile — student identity hook with cloud sync + localStorage fallback.
 *
 * - Always reads/writes localStorage (works signed-out or when server is down).
 * - When signed in, fetches profile from /api/profile on mount and keeps in sync.
 * - updateProfile() writes localStorage immediately then async-syncs to server.
 */

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StudentProfile {
  board:       string | null;
  classLevel:  number | null;
  displayName: string | null;
}

// ─── localStorage keys ────────────────────────────────────────────────────────

const LS_BOARD = "studyai_board";
const LS_CLASS = "studyai_class";
const LS_NAME  = "studyai_display_name";

function readLocal(): StudentProfile {
  return {
    board:       localStorage.getItem(LS_BOARD),
    classLevel:  localStorage.getItem(LS_CLASS) ? parseInt(localStorage.getItem(LS_CLASS)!) : null,
    displayName: localStorage.getItem(LS_NAME),
  };
}

function writeLocal(p: Partial<StudentProfile>) {
  if (p.board       !== undefined) {
    if (p.board)      localStorage.setItem(LS_BOARD, p.board);
    else              localStorage.removeItem(LS_BOARD);
  }
  if (p.classLevel  !== undefined) {
    if (p.classLevel !== null) localStorage.setItem(LS_CLASS, String(p.classLevel));
    else                       localStorage.removeItem(LS_CLASS);
  }
  if (p.displayName !== undefined) {
    if (p.displayName) localStorage.setItem(LS_NAME, p.displayName);
    else               localStorage.removeItem(LS_NAME);
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProfile() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<StudentProfile>(readLocal);
  const [isSyncing, setIsSyncing] = useState(false);
  const fetchedRef = useRef(false);

  // Fetch from server once after sign-in
  useEffect(() => {
    if (!isLoaded || fetchedRef.current) return;
    if (!user) { fetchedRef.current = true; return; }

    fetchedRef.current = true;
    setIsSyncing(true);

    fetch("/api/profile")
      .then(r => r.ok ? r.json() as Promise<StudentProfile> : null)
      .then(data => {
        if (!data) return;
        setProfile(data);
        writeLocal(data);
      })
      .catch(() => { /* server down — stay on localStorage */ })
      .finally(() => setIsSyncing(false));
  }, [user, isLoaded]);

  // Reset on sign-out so a new user gets a clean state
  useEffect(() => {
    if (isLoaded && !user) {
      fetchedRef.current = false;
    }
  }, [user, isLoaded]);

  async function updateProfile(updates: Partial<StudentProfile>) {
    const next = { ...profile, ...updates };
    setProfile(next);
    writeLocal(updates);

    if (user) {
      try {
        await fetch("/api/profile", {
          method:  "PUT",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(updates),
        });
      } catch { /* localStorage already updated — server sync optional */ }
    }
  }

  const profileReady = isLoaded && (!user || !isSyncing || fetchedRef.current);

  return { profile, isSyncing, profileReady, updateProfile };
}
