import { MatchData } from './types';
import { generateFingerprint, generateId } from './match-storage';

export interface ScoresheetPlayerDraft {
  name: string;
  score: string;
}

export interface ScoresheetTeamDraft {
  name: string;
  coach: string;
  manager: string;
  supportStaff: string;
  players: ScoresheetPlayerDraft[];
}

export interface ScoresheetOfficialsDraft {
  referee1: string;
  referee2: string;
  scorer: string;
  timekeeper: string;
}

export interface ScoresheetDraft {
  requestId?: string;
  imageUri?: string;
  source: 'dummy';
  tournament: string;
  category: string;
  stage: string;
  date: string;
  time: string;
  venue: string;
  courtNo: string;
  matchNo: string;
  tossWinner: string;
  result: string;
  remarks: string;
  officials: ScoresheetOfficialsDraft;
  teamA: ScoresheetTeamDraft;
  teamB: ScoresheetTeamDraft;
}

export interface DraftValidationIssue {
  key: string;
  label: string;
}

function formatSheetTime(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return '';
  }
  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  if (/^\d{2}:\d{2}$/.test(trimmed)) {
    return `${trimmed}:00`;
  }
  return trimmed;
}

export function buildScheduledTimestamp(draft: ScoresheetDraft): string {
  const datePart = draft.date.trim() || new Date().toISOString().split('T')[0];
  const timePart = formatSheetTime(draft.time) || '00:00:00';
  return `${datePart}T${timePart}`;
}

const teamAPlayers = [
  ['Ananya Patil', '4'],
  ['Kavya Deshmukh', '2'],
  ['Sakshi Pawar', '6'],
  ['Ishwari Jadhav', '2'],
  ['Rutuja Shinde', '4'],
  ['Tejal More', '0'],
  ['Komal Gawade', '3'],
  ['Prajakta Kadam', '1'],
  ['Snehal Chavan', '4'],
  ['Pooja Mali', '0'],
  ['Minal Thorat', '1'],
  ['Shweta Shirsekar', '0'],
] as const;

const teamBPlayers = [
  ['Riya Shinde', '3'],
  ['Vaishnavi Jagtap', '2'],
  ['Pratiksha Kale', '5'],
  ['Pallavi Dhumal', '1'],
  ['Trupti More', '4'],
  ['Sonali Pawar', '2'],
  ['Nikita Patole', '0'],
  ['Aditi Nalawade', '2'],
  ['Srushti Salunkhe', '1'],
  ['Monika Mhaske', '0'],
  ['', '0'],
  ['', '0'],
] as const;

function buildPlayers(seed: readonly (readonly [string, string])[]): ScoresheetPlayerDraft[] {
  return seed.map(([name, score]) => ({ name, score }));
}

export function createDummyScoresheetDraft(input?: {
  requestId?: string;
  imageUri?: string;
}): ScoresheetDraft {
  return {
    requestId: input?.requestId,
    imageUri: input?.imageUri,
    source: 'dummy',
    tournament: 'Maharashtra State Kho-Kho Championship',
    category: 'Senior Women',
    stage: 'League Round',
    date: '2026-03-24',
    time: '',
    venue: '',
    courtNo: '',
    matchNo: '',
    tossWinner: 'Shivneri Warriors',
    result: 'Winner to be confirmed after manual review',
    remarks: '',
    officials: {
      referee1: 'S. Patil',
      referee2: 'M. Jadhav',
      scorer: '',
      timekeeper: '',
    },
    teamA: {
      name: 'Shivneri Warriors',
      coach: 'A. Kulkarni',
      manager: 'V. Patil',
      supportStaff: 'Physio Desk',
      players: buildPlayers(teamAPlayers),
    },
    teamB: {
      name: 'Pune Panthers',
      coach: 'R. Gaikwad',
      manager: 'N. Shinde',
      supportStaff: 'Support Desk',
      players: buildPlayers(teamBPlayers),
    },
  };
}

export function cloneDraft(draft: ScoresheetDraft): ScoresheetDraft {
  return JSON.parse(JSON.stringify(draft)) as ScoresheetDraft;
}

export function getTeamTotal(team: ScoresheetTeamDraft): number {
  return team.players.reduce((sum, player) => sum + (parseInt(player.score, 10) || 0), 0);
}

function hasAtLeastNinePlayers(team: ScoresheetTeamDraft): boolean {
  return team.players.filter((player) => player.name.trim()).length >= 9;
}

export function getDraftValidationIssues(draft: ScoresheetDraft): DraftValidationIssue[] {
  const issues: DraftValidationIssue[] = [];
  const requiredFields: Array<[string, string, string]> = [
    ['tournament', 'Tournament', draft.tournament],
    ['date', 'Match Date', draft.date],
    ['time', 'Match Time', draft.time],
    ['venue', 'Venue', draft.venue],
    ['courtNo', 'Court Number', draft.courtNo],
    ['matchNo', 'Match Number', draft.matchNo],
    ['teamA.name', 'Team A Name', draft.teamA.name],
    ['teamB.name', 'Team B Name', draft.teamB.name],
    ['officials.scorer', 'Scorer', draft.officials.scorer],
    ['officials.timekeeper', 'Timekeeper', draft.officials.timekeeper],
  ];

  requiredFields.forEach(([key, label, value]) => {
    if (!value.trim()) {
      issues.push({ key, label });
    }
  });

  if (!hasAtLeastNinePlayers(draft.teamA)) {
    issues.push({ key: 'teamA.players', label: 'At least 9 Team A players' });
  }

  if (!hasAtLeastNinePlayers(draft.teamB)) {
    issues.push({ key: 'teamB.players', label: 'At least 9 Team B players' });
  }

  return issues;
}

export function buildMatchFromDraft(draft: ScoresheetDraft): MatchData {
  const date = draft.date || new Date().toISOString().split('T')[0];
  const venue = draft.venue || 'Manual Venue';
  const teamAName = draft.teamA.name || 'Team A';
  const teamBName = draft.teamB.name || 'Team B';

  return {
    id: generateId(),
    requestId: draft.requestId,
    tournament: draft.tournament,
    date,
    time: draft.time,
    venue,
    courtNo: draft.courtNo,
    matchNo: draft.matchNo,
    tossWinner: draft.tossWinner,
    result: draft.result,
    remarks: draft.remarks,
    officials: draft.officials,
    sheetPayload: buildPipelineSheetPayload(draft),
    venueConfidence: 1,
    dateConfidence: 1,
    teamA: {
      name: teamAName,
      nameConfidence: 1,
      players: draft.teamA.players
        .filter((player) => player.name.trim())
        .map((player) => ({
          name: player.name.trim(),
          score: parseInt(player.score, 10) || 0,
          confidence: 1,
        })),
      totalScore: getTeamTotal(draft.teamA),
      coach: draft.teamA.coach,
      manager: draft.teamA.manager,
      supportStaff: draft.teamA.supportStaff,
    },
    teamB: {
      name: teamBName,
      nameConfidence: 1,
      players: draft.teamB.players
        .filter((player) => player.name.trim())
        .map((player) => ({
          name: player.name.trim(),
          score: parseInt(player.score, 10) || 0,
          confidence: 1,
        })),
      totalScore: getTeamTotal(draft.teamB),
      coach: draft.teamB.coach,
      manager: draft.teamB.manager,
      supportStaff: draft.teamB.supportStaff,
    },
    imageUri: draft.imageUri,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isAutoFilled: true,
    autoFilledFields: ['dummy-record'],
    status: 'confirmed',
    fingerprint: generateFingerprint(teamAName, teamBName, date, venue),
  };
}

export function buildPipelineSheetPayload(draft: ScoresheetDraft): Record<string, any> {
  const teamAScore = getTeamTotal(draft.teamA);
  const teamBScore = getTeamTotal(draft.teamB);
  const resultWinner =
    teamAScore > teamBScore
      ? draft.teamA.name
      : teamBScore > teamAScore
        ? draft.teamB.name
        : '';

  return {
    match_info: {
      tournament: draft.tournament,
      category: draft.category,
      stage: draft.stage,
      date: draft.date,
      time: draft.time,
      scheduled_at: buildScheduledTimestamp(draft),
      venue: draft.venue,
      court_no: draft.courtNo,
      match_no: draft.matchNo,
      toss_winner: draft.tossWinner,
      choice: '',
      source: draft.source,
    },
    teams: {
      team_a: {
        name: draft.teamA.name,
        coach: draft.teamA.coach,
        manager: draft.teamA.manager,
        support_staff: draft.teamA.supportStaff,
        players: draft.teamA.players.map((player, index) => ({
          no: index + 1,
          name: player.name,
          score: parseInt(player.score, 10) || 0,
        })),
      },
      team_b: {
        name: draft.teamB.name,
        coach: draft.teamB.coach,
        manager: draft.teamB.manager,
        support_staff: draft.teamB.supportStaff,
        players: draft.teamB.players.map((player, index) => ({
          no: index + 1,
          name: player.name,
          score: parseInt(player.score, 10) || 0,
        })),
      },
    },
    score: {
      team_a_points: teamAScore,
      team_b_points: teamBScore,
    },
    officials: {
      referee1: draft.officials.referee1,
      referee2: draft.officials.referee2,
      scorer: draft.officials.scorer,
      timekeeper: draft.officials.timekeeper,
    },
    result: {
      winner: resultWinner,
      summary: draft.result,
    },
    remarks: draft.remarks,
    metadata: {
      request_id: draft.requestId || '',
      image_uri: draft.imageUri || '',
      source: draft.source,
      captured_at: new Date().toISOString(),
    },
  };
}
