import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { cloneDraft, createDummyScoresheetDraft, ScoresheetDraft } from '@/lib/dummy-ocr';

type TeamKey = 'teamA' | 'teamB';
type TeamField = 'name' | 'coach' | 'manager' | 'supportStaff';
type MetaField =
  | 'tournament'
  | 'category'
  | 'stage'
  | 'date'
  | 'time'
  | 'venue'
  | 'courtNo'
  | 'matchNo'
  | 'tossWinner'
  | 'result'
  | 'remarks';
type OfficialField = 'referee1' | 'referee2' | 'scorer' | 'timekeeper';
type PlayerField = 'name' | 'score';

interface OcrDraftContextValue {
  draft: ScoresheetDraft | null;
  ensureDummyDraft: (input?: { requestId?: string; imageUri?: string }) => void;
  resetDraft: () => void;
  updateMetaField: (field: MetaField, value: string) => void;
  updateOfficialField: (field: OfficialField, value: string) => void;
  updateTeamField: (team: TeamKey, field: TeamField, value: string) => void;
  updatePlayerField: (team: TeamKey, index: number, field: PlayerField, value: string) => void;
}

const OcrDraftContext = createContext<OcrDraftContextValue | null>(null);

function shouldReuseDraft(
  draft: ScoresheetDraft | null,
  input?: { requestId?: string; imageUri?: string },
): boolean {
  if (!draft) return false;
  if (input?.requestId && draft.requestId === input.requestId) return true;
  if (!input?.requestId && input?.imageUri && draft.imageUri === input.imageUri) return true;
  if (!input?.requestId && !input?.imageUri) return true;
  return false;
}

export function OcrDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<ScoresheetDraft | null>(null);

  const ensureDummyDraft = useCallback((input?: { requestId?: string; imageUri?: string }) => {
    setDraft((current) => {
      if (shouldReuseDraft(current, input)) {
        return current;
      }
      return createDummyScoresheetDraft(input);
    });
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(null);
  }, []);

  const updateMetaField = useCallback((field: MetaField, value: string) => {
    setDraft((current) => {
      if (!current) return current;
      const next = cloneDraft(current);
      next[field] = value;
      return next;
    });
  }, []);

  const updateOfficialField = useCallback((field: OfficialField, value: string) => {
    setDraft((current) => {
      if (!current) return current;
      const next = cloneDraft(current);
      next.officials[field] = value;
      return next;
    });
  }, []);

  const updateTeamField = useCallback((team: TeamKey, field: TeamField, value: string) => {
    setDraft((current) => {
      if (!current) return current;
      const next = cloneDraft(current);
      next[team][field] = value;
      return next;
    });
  }, []);

  const updatePlayerField = useCallback((team: TeamKey, index: number, field: PlayerField, value: string) => {
    setDraft((current) => {
      if (!current || !current[team].players[index]) return current;
      const next = cloneDraft(current);
      next[team].players[index][field] = value;
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      draft,
      ensureDummyDraft,
      resetDraft,
      updateMetaField,
      updateOfficialField,
      updateTeamField,
      updatePlayerField,
    }),
    [draft, ensureDummyDraft, resetDraft, updateMetaField, updateOfficialField, updateTeamField, updatePlayerField],
  );

  return <OcrDraftContext.Provider value={value}>{children}</OcrDraftContext.Provider>;
}

export function useOcrDraft() {
  const context = useContext(OcrDraftContext);
  if (!context) {
    throw new Error('useOcrDraft must be used within an OcrDraftProvider');
  }
  return context;
}
