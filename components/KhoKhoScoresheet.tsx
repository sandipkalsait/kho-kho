import React, { useState } from 'react';
import './KhoKhoScoresheet.css';
import { MatchData, TeamData, Player } from '../lib/types';
import PlayerInfoTable from './PlayerInfoTable';
import DefenseTable from './DefenseTable';
import ChaseTable from './ChaseTable';

// Mock Data for testing
const mockPlayers: Player[] = Array.from({ length: 12 }, (_, i) => ({
  name: `Player ${i + 1}`,
  score: 0,
  confidence: 0,
}));

const mockTeamA: TeamData = {
  name: 'Team A',
  nameConfidence: 0.9,
  players: mockPlayers,
  totalScore: 0,
};

const mockTeamB: TeamData = {
  name: 'Team B',
  nameConfidence: 0.9,
  players: mockPlayers,
  totalScore: 0,
};

const mockMatchData: MatchData = {
  id: 'mock-match-1',
  date: new Date().toISOString(),
  venue: 'Mock Venue',
  venueConfidence: 0.9,
  dateConfidence: 0.9,
  teamA: mockTeamA,
  teamB: mockTeamB,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isAutoFilled: false,
  autoFilledFields: [],
  status: 'draft',
  fingerprint: 'mock-fingerprint',
};

interface KhoKhoScoresheetProps {
  matchData?: MatchData;
}

const KhoKhoScoresheet: React.FC<KhoKhoScoresheetProps> = ({ matchData = mockMatchData }) => {
  if (!matchData) {
    // Render a placeholder or loading state if no data is provided
    return <div>Loading scoresheet...</div>;
  }

  const { teamA, teamB } = matchData;

  return (
    <div className="scoresheet-page-container">
      <div className="scoresheet-teams-stack">
        <TeamSheet team={teamA} />
        <div className="team-divider" />
        <TeamSheet team={teamB} />
      </div>
    </div>
  );
};

interface TeamSheetProps {
  team: TeamData;
}

const TeamSheet: React.FC<TeamSheetProps> = ({ team }) => {
  const [manager, setManager] = useState('');
  const [coach, setCoach] = useState('');
  const [supportStaff, setSupportStaff] = useState('');
  const [substitutes, setSubstitutes] = useState(['']);

  const addSubstitute = () => {
    setSubstitutes((prev) => [...prev, '']);
  };

  const handleSubstituteChange = (index: number, value: string) => {
    const newSubstitutes = [...substitutes];
    newSubstitutes[index] = value;
    setSubstitutes(newSubstitutes);
  };

  return (
    <section className="scoresheet-team-section">
      <h2 className="scoresheet-team-header">{team.name}</h2>
      <div className="staff-info">
        <div className="staff-item">
          <label>Manager:</label>
          <input type="text" value={manager} onChange={(e) => setManager(e.target.value)} />
        </div>
        <div className="staff-item">
          <label>Coach:</label>
          <input type="text" value={coach} onChange={(e) => setCoach(e.target.value)} />
        </div>
        <div className="staff-item">
          <label>Supportive Staff:</label>
          <input type="text" value={supportStaff} onChange={(e) => setSupportStaff(e.target.value)} />
        </div>
      </div>

      <div className="scoresheet-grid">
        <PlayerInfoTable players={team.players} />
        <div className="tables-group">
          <DefenseTable rows={12} />
          <ChaseTable rows={12} />
        </div>
      </div>
      
      <div className="substitute-players">
        <table className="excel-table substitute-table">
          <thead>
            <tr>
              <th colSpan={2}>Substitute Players</th>
            </tr>
          </thead>
          <tbody>
            {substitutes.map((sub, subIndex) => (
              <tr key={subIndex}>
                <td>
                  <input
                    type="text"
                    placeholder="Name of substitute"
                    value={sub}
                    onChange={(e) => handleSubstituteChange(subIndex, e.target.value)}
                  />
                </td>
                <td>
                  {subIndex === substitutes.length - 1 && (
                    <button onClick={addSubstitute} className="add-button">
                      + Add
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const KhoKhoScoresheetWithData: React.FC = () => {
  return <KhoKhoScoresheet matchData={mockMatchData} />;
};

export { KhoKhoScoresheet, KhoKhoScoresheetWithData };
