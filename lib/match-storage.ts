/**
 * match-storage.ts  —  All reads + writes go through the local Django API.
 * Falls back gracefully when server is unreachable.
 */

import { Platform } from 'react-native';
import { MatchData, TeamData, Player } from './types';
import * as Crypto from 'expo-crypto';

// ─── Base URL ─────────────────────────────────────────────────────────────────
const API_BASE =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000/api/'
    : 'http://127.0.0.1:8000/api/';

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function generateFingerprint(
  teamA: string,
  teamB: string,
  date: string,
  venue: string,
): string {
  return `${teamA.toLowerCase().trim()}-${teamB.toLowerCase().trim()}-${date.trim()}-${venue
    .toLowerCase()
    .trim()}`.replace(/\s+/g, '_');
}

export function generateId(): string {
  return Crypto.randomUUID();
}

function toDateStr(raw: string): string {
  try {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  } catch (_) {}
  return new Date().toISOString().split('T')[0];
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

// ─── Tournament helpers ────────────────────────────────────────────────────────

async function getOrCreateTournament(venue: string): Promise<number> {
  try {
    const res = await fetch(`${API_BASE}tournaments/`);
    const list = await safeJson(res);
    if (Array.isArray(list) && list.length > 0) return list[0].id;
  } catch (_) {}

  const today = new Date().toISOString().split('T')[0];
  const res = await fetch(`${API_BASE}tournaments/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Default OCR Tournament',
      venue: venue || 'Unknown Venue',
      start_date: today,
      end_date: today,
      organizer: 'OCR System',
    }),
  });
  const data = await safeJson(res);
  return data.id;
}

async function createTeam(name: string): Promise<number> {
  const res = await fetch(`${API_BASE}teams/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name || 'Unknown Team' }),
  });
  const data = await safeJson(res);
  return data.id;
}

// ─── Map Django match → app MatchData ─────────────────────────────────────────

function mapApiMatch(m: Record<string, any>): MatchData {
  const remarks: string = m.remarks || '';

  // New format: "fingerprint|status|venue"
  // Legacy format: just a fingerprint string (no pipes)
  let fingerprint = remarks;
  let status: 'confirmed' | 'draft' = 'confirmed'; // default confirmed for API-sourced matches
  let venue = m.tournament_details?.venue || 'Unknown Venue';

  if (remarks.includes('|')) {
    const parts = remarks.split('|');
    fingerprint = parts[0] || remarks;
    status = parts[1] === 'draft' ? 'draft' : 'confirmed';
    venue = parts[2] || venue;
  }

  // Score events aggregate for each inning
  let totalAScore = 0;
  let totalBScore = 0;
  const innings: any[] = m.innings || [];
  innings.forEach((inn: any) => {
    const pts = (inn.score_events || []).reduce(
      (s: number, e: any) => s + (e.points || 0),
      0,
    );
    // Inning 1 & 3 → chasing = Team A typically; simplified aggregation
    totalAScore += pts > 0 ? pts : 0;
  });

  return {
    id: String(m.id),
    date: m.date || new Date().toISOString().split('T')[0],
    venue,
    venueConfidence: 1,
    dateConfidence: 1,
    teamA: {
      name: m.team_a_details?.name || 'Team A',
      nameConfidence: 1,
      players: [],
      totalScore: totalAScore,
    },
    teamB: {
      name: m.team_b_details?.name || 'Team B',
      nameConfidence: 1,
      players: [],
      totalScore: totalBScore,
    },
    imageUri: undefined,
    createdAt: m.created_at || new Date().toISOString(),
    updatedAt: m.updated_at || new Date().toISOString(),
    isAutoFilled: false,
    autoFilledFields: [],
    status,
    fingerprint,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getAllMatches(): Promise<MatchData[]> {
  try {
    const res = await fetch(`${API_BASE}matches/`);
    if (!res.ok) return [];
    const data = await safeJson(res);
    if (!Array.isArray(data)) return [];
    return data.map(mapApiMatch);
  } catch (e) {
    console.warn('[match-storage] getAllMatches failed:', e);
    return [];
  }
}

export async function saveMatch(
  match: MatchData,
): Promise<{ success: boolean; duplicate: boolean }> {
  try {
    const tId = await getOrCreateTournament(match.venue);
    const teamAId = await createTeam(match.teamA.name);
    const teamBId = await createTeam(match.teamB.name);

    const dateStr = toDateStr(match.date);
    // Pack extra metadata into remarks so we can restore it on read
    const remarks = `${match.fingerprint}|${match.status}|${match.venue}`;

    // If match already has an API id (pure digit string), try PATCH first
    const isExisting = match.id && /^\d+$/.test(match.id);

    if (isExisting) {
      const patchRes = await fetch(`${API_BASE}matches/${match.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: dateStr,
          remarks,
          team_a: teamAId,
          team_b: teamBId,
        }),
      });
      if (patchRes.ok) return { success: true, duplicate: false };
    }

    // Otherwise POST a new match
    const matchRes = await fetch(`${API_BASE}matches/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tournament: tId,
        match_number: Math.floor(Math.random() * 10000),
        date: dateStr,
        time: '10:00:00',
        team_a: teamAId,
        team_b: teamBId,
        remarks,
      }),
    });

    if (!matchRes.ok) {
      const err = await safeJson(matchRes);
      console.warn('[match-storage] saveMatch POST failed:', err);
      return { success: false, duplicate: false };
    }

    return { success: true, duplicate: false };
  } catch (e) {
    console.warn('[match-storage] saveMatch error:', e);
    return { success: false, duplicate: false };
  }
}

export async function deleteMatch(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}matches/${id}/`, { method: 'DELETE' });
  } catch (e) {
    console.warn('[match-storage] deleteMatch error:', e);
  }
}

export async function getMatch(id: string): Promise<MatchData | undefined> {
  try {
    const res = await fetch(`${API_BASE}matches/${id}/`);
    if (!res.ok) return undefined;
    const data = await safeJson(res);
    return mapApiMatch(data);
  } catch {
    return undefined;
  }
}

// ─── OCR simulation (UI preview while real OCR runs) ──────────────────────────

export function simulateOCR(): {
  teamAPlayers: Player[];
  teamBPlayers: Player[];
} {
  const first = ['Rahul', 'Amit', 'Priya', 'Sneha', 'Vikas', 'Deepak', 'Kavita', 'Rohan'];
  const last = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Desai', 'Joshi', 'Verma', 'Gupta'];
  const used = new Set<string>();
  const makeName = () => {
    let n = '';
    do {
      n =
        first[Math.floor(Math.random() * first.length)] +
        ' ' +
        last[Math.floor(Math.random() * last.length)];
    } while (used.has(n));
    used.add(n);
    return n;
  };
  const makePlayer = (): Player => ({
    name: makeName(),
    score: Math.floor(Math.random() * 8),
    confidence: 0.5 + Math.random() * 0.5,
  });
  return {
    teamAPlayers: Array.from({ length: 9 }, makePlayer),
    teamBPlayers: Array.from({ length: 9 }, makePlayer),
  };
}
