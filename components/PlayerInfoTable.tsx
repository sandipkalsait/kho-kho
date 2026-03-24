import React from 'react';
import { Player } from '../lib/types';

interface PlayerInfoTableProps {
  players: Player[];
}

const PlayerInfoTable: React.FC<PlayerInfoTableProps> = ({ players }) => {
  return (
    <div className="scoresheet-table-wrapper">
      <div className="scoresheet-title">Player Info</div>
      <table className="excel-table player-info-table" aria-label="Player Info">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Name of Player</th>
            <th>Chest No.</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, rowIndex) => (
            <tr key={rowIndex}>
              <td>{rowIndex + 1}</td>
              <td>{player.name}</td>
              <td></td>
            </tr>
          ))}
          {/* Add empty rows to reach a total of 12 if needed */}
          {Array.from({ length: Math.max(0, 12 - players.length) }, (_, i) => (
             <tr key={`empty-${i}`}>
              <td>{players.length + i + 1}</td>
              <td></td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerInfoTable;
