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

function toTimeStr(raw?: string): string {
  const trimmed = (raw || '').trim();
  if (!trimmed) return '00:00:00';
  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) return trimmed;
  if (/^\d{2}:\d{2}$/.test(trimmed)) return `${trimmed}:00`;
  return '00:00:00';
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

// ─── Tournament helpers ────────────────────────────────────────────────────────

async function getOrCreateTournament(venue: string, tournamentName?: string): Promise<number> {
  try {
    const res = await fetch(`${API_BASE}tournaments/`);
    const list = await safeJson(res);
    if (Array.isArray(list)) {
      const exact = list.find((item) => item?.name === tournamentName);
      if (exact?.id) return exact.id;
      if (list.length > 0) return list[0].id;
    }
  } catch (_) {}

  const today = new Date().toISOString().split('T')[0];
  const res = await fetch(`${API_BASE}tournaments/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: tournamentName || 'Default OCR Tournament',
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
  const sheetPayload = typeof m.sheet_payload === 'object' && m.sheet_payload ? m.sheet_payload : {};
  const officials = typeof m.officials === 'object' && m.officials ? m.officials : {};

  // New format: "fingerprint|status|venue"
  // Legacy format: just a fingerprint string (no pipes)
  let fingerprint = remarks;
  let status: 'confirmed' | 'draft' = 'confirmed';
  let venue = m.tournament_details?.venue || sheetPayload?.match_info?.venue || 'Unknown Venue';

  if (remarks.includes('|')) {
    const parts = remarks.split('|');
    fingerprint = parts[0] || remarks;
    status = parts[1] === 'draft' ? 'draft' : 'confirmed';
    venue = parts[2] || venue;
  }

  const teamAPayloadPlayers = Array.isArray(sheetPayload?.teams?.team_a?.players)
    ? sheetPayload.teams.team_a.players
    : [];
  const teamBPayloadPlayers = Array.isArray(sheetPayload?.teams?.team_b?.players)
    ? sheetPayload.teams.team_b.players
    : [];
  const teamAApiPlayers = Array.isArray(m.team_a_details?.players)
    ? m.team_a_details.players.map((player: Record<string, any>) => ({
        name: player.name || '',
        score: 0,
        confidence: 1,
      }))
    : [];
  const teamBApiPlayers = Array.isArray(m.team_b_details?.players)
    ? m.team_b_details.players.map((player: Record<string, any>) => ({
        name: player.name || '',
        score: 0,
        confidence: 1,
      }))
    : [];

  const totalAScore =
    Number(sheetPayload?.score?.team_a_points) ||
    teamAPayloadPlayers.reduce((sum: number, player: Record<string, any>) => sum + (Number(player.score) || 0), 0);
  const totalBScore =
    Number(sheetPayload?.score?.team_b_points) ||
    teamBPayloadPlayers.reduce((sum: number, player: Record<string, any>) => sum + (Number(player.score) || 0), 0);

  return {
    id: String(m.id),
    requestId: m.source_upload_request ? String(m.source_upload_request) : undefined,
    tournament: m.tournament_details?.name || sheetPayload?.match_info?.tournament || '',
    date: m.date || new Date().toISOString().split('T')[0],
    time: m.time || sheetPayload?.match_info?.time || '',
    venue,
    courtNo: m.court_number || sheetPayload?.match_info?.court_no || '',
    matchNo:
      m.match_number !== undefined && m.match_number !== null
        ? String(m.match_number)
        : sheetPayload?.match_info?.match_no || '',
    tossWinner: sheetPayload?.match_info?.toss_winner || '',
    choice: m.choice || sheetPayload?.match_info?.choice || '',
    result: m.result_margin || sheetPayload?.result?.summary || '',
    remarks: remarks.includes('|') ? sheetPayload?.remarks || '' : remarks,
    officials,
    sheetPayload,
    sourceImageUrl: sheetPayload?.metadata?.source_image_url || '',
    venueConfidence: 1,
    dateConfidence: 1,
    teamA: {
      name: m.team_a_details?.name || sheetPayload?.teams?.team_a?.name || 'Team A',
      nameConfidence: 1,
      players:
        teamAPayloadPlayers.length > 0
          ? teamAPayloadPlayers.map((player: Record<string, any>) => ({
              name: player.name || '',
              score: Number(player.score) || 0,
              confidence: 1,
            }))
          : teamAApiPlayers,
      totalScore: totalAScore,
      coach: m.team_a_details?.coach || sheetPayload?.teams?.team_a?.coach || '',
      manager: m.team_a_details?.manager || sheetPayload?.teams?.team_a?.manager || '',
      supportStaff: sheetPayload?.teams?.team_a?.support_staff || '',
    },
    teamB: {
      name: m.team_b_details?.name || sheetPayload?.teams?.team_b?.name || 'Team B',
      nameConfidence: 1,
      players:
        teamBPayloadPlayers.length > 0
          ? teamBPayloadPlayers.map((player: Record<string, any>) => ({
              name: player.name || '',
              score: Number(player.score) || 0,
              confidence: 1,
            }))
          : teamBApiPlayers,
      totalScore: totalBScore,
      coach: m.team_b_details?.coach || sheetPayload?.teams?.team_b?.coach || '',
      manager: m.team_b_details?.manager || sheetPayload?.teams?.team_b?.manager || '',
      supportStaff: sheetPayload?.teams?.team_b?.support_staff || '',
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
    const tId = await getOrCreateTournament(match.venue, match.tournament);
    const teamAId = await createTeam(match.teamA.name);
    const teamBId = await createTeam(match.teamB.name);

    const dateStr = toDateStr(match.date);
    const timeStr = toTimeStr(match.time);
    // Pack extra metadata into remarks so we can restore it on read
    const remarks = `${match.fingerprint}|${match.status}|${match.venue}`;

    // If match already has an API id (pure digit string), try PATCH first
    const isExisting = match.id && /^\d+$/.test(match.id);

    if (isExisting) {
      const patchRes = await fetch(`${API_BASE}matches/${match.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournament: tId,
          match_number: Number(match.matchNo) || Math.floor(Math.random() * 10000),
          court_number: match.courtNo || '',
          date: dateStr,
          time: timeStr,
          choice: match.choice || null,
          result_margin: match.result || null,
          officials: match.officials || {},
          sheet_payload: match.sheetPayload || {},
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
        match_number: Number(match.matchNo) || Math.floor(Math.random() * 10000),
        court_number: match.courtNo || '',
        date: dateStr,
        time: timeStr,
        team_a: teamAId,
        team_b: teamBId,
        choice: match.choice || null,
        result_margin: match.result || null,
        officials: match.officials || {},
        sheet_payload: match.sheetPayload || {},
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
