export interface Player {
  name: string;
  score: number;
  confidence: number;
}

export interface TeamData {
  name: string;
  nameConfidence: number;
  players: Player[];
  totalScore: number;
  coach?: string;
  manager?: string;
  supportStaff?: string;
}

export interface MatchData {
  id: string;
  requestId?: string;
  tournament?: string;
  date: string;
  time?: string;
  venue: string;
  courtNo?: string;
  matchNo?: string;
  tossWinner?: string;
  choice?: string;
  result?: string;
  remarks?: string;
  officials?: Record<string, any>;
  sheetPayload?: Record<string, any>;
  sourceImageUrl?: string;
  venueConfidence: number;
  dateConfidence: number;
  teamA: TeamData;
  teamB: TeamData;
  imageUri?: string;
  createdAt: string;
  updatedAt: string;
  isAutoFilled: boolean;
  autoFilledFields: string[];
  status: 'draft' | 'confirmed';
  fingerprint: string;
}

export interface OCRResult {
  teamAName: string;
  teamANameConfidence: number;
  teamBName: string;
  teamBNameConfidence: number;
  teamAPlayers: Player[];
  teamBPlayers: Player[];
  teamAScore: number;
  teamBScore: number;
  date: string;
  dateConfidence: number;
  venue: string;
  venueConfidence: number;
  autoFilledFields: string[];
}
